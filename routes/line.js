var express = require('express');
var router = express.Router();
var request = require('request');
var url = require('url');
var model = require("../model/com_up_app_db.js")

AUTHORIZATION = 'Bearer '+ process.env.CHANNEL_ACCESS_TOKEN
LINE_BOT_NAME = process.env.LINE_BOT_NAME
DOMAIN_PATH = process.env.DOMAIN_PATH
TEMPLATE_MESSAGE = [
  "会員登録がされていません\nuser_name/password\nの形式で入力してください",
  "userとpasswordが一致しません\nuser_name/password\nの形式で入力してください",
  "success",
  "友達登録ありがとうございます\nslackで送られてきたusernameとパスワードを\nuser/password\nの形式で入力してください"
];


//lineに送信するためのリクエストのDicを生成するfunction
//引数はuser_nameと送り先のLineのuser_idを表すto_user_idと送信するメッセージのmessage
function line_messsage_req(user_name,to_user_id,message){
  var options = {
    "url": "https://api.line.me/v2/bot/message/push",
    "method": 'POST',
    "headers": {
      "Content-Type":"application/json",
      Authorization:AUTHORIZATION
    },
    "json": true,
    "body": {
      "to": to_user_id,
      "messages":[{
        "type":"text",
        "text":"from " + user_name + "\n" + message
      }]
    }
  };
  return options
}

//postリクエストを送るfunction
//引数にリクエストのDicを指定する。
function pos(request_json){
  request.post(request_json, function(error, response, body){
    if (!error && response.statusCode == 200) {
      console.log(body.name);
    } else {
      console.log(body)
      console.log('error: '+ response.statusCode);
    }
  });
}


//LBのヘルスチェック用の受け口
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hello Line!' });
});

//slack側のメッセージをLineに送信する受け口
// "/push?message=...&id+..."の形でリクエストが来る。それ以外は想定していない。
router.get('/push', function(req, res, next) {

  message = req.query.message;
  id = req.query.id;
  mention_id = req.query.mention_id
  res.send(200,"");
  if(mention_id == "undefined"){
    model.query('SELECT name FROM slack_line_ids WHERE id = ?', [id], function(err, rows) {
      model.query('SELECT line_id FROM slack_line_ids', function(err, rows2) {
        for(i = 0; i < rows2.length; i++){
          to_user = rows2[i]["line_id"]
          pos(line_messsage_req(rows[0]["name"],to_user,message));
        };
      });
    });
  }
  else{
    model.query('SELECT line_id FROM slack_line_ids WHERE slack_id = ?', [mention_id], function(err, rows) {
      if(rows.length!=0){
        model.query('SELECT name FROM slack_line_ids WHERE id = ?', [id] , function(err, rows2) {
          to_user = rows[0]["line_id"]
          pos(line_messsage_req(rows2[0]["name"],to_user,message));
        });
      }
    });
  }
});


//line側のメッセージをSlackに送信する受け口
router.post('/', function(req, res, next){
  line_user_id = req.body["events"][0]["source"]["userId"]//webhookで飛んできたLine->botにメセージを送ったユーザのLineのuser_id
  event = req.body["events"][0]["type"]
  if(event == "follow"){
    pos(line_messsage_req(LINE_BOT_NAME,line_user_id,TEMPLATE_MESSAGE[3]))
    console.log("follow")
  }
  else if(event == "unfollow"){
    console.log("unfollow")
    model.query('DELETE FROM slack_line_ids WHERE line_id = ?', [line_user_id])
  }
  else if(event == "message"){
    received_message = req.body["events"][0]["message"]["text"]//webhookで飛んできたLine->botに送ったメッセージ
    //DB上にUserのマッチング情報が存在するかの確認
    model.query('SELECT EXISTS(SELECT * FROM slack_line_ids WHERE line_id = ?) AS exist', [line_user_id], function(err, rows) {
      //DB上に存在しないときの処理。
      if(rows[0]["exist"]==0){
        //送られてきたメッセージが"user_name/password"の形式で送られてきているかのチェック。
        //送られてきていればuser_pass[1]にuser_name,user_pass[2]にpasswordが入り、送られてきていなければuser_passはnullが入る。
        user_pass = received_message.match(/([^\/]+)\/([a-z0-9]{4})/)
        //"user_name/password"の形式じゃなかった場合、まだ登録が済んでいないので済ませる旨を伝える。
        if(user_pass == null){
          pos(line_messsage_req(LINE_BOT_NAME,line_user_id,TEMPLATE_MESSAGE[0]))
        }
        //"user_name/password"の形式だった場合の処理。
        else{
          //user_nemeとpasswordの組み合わせがDBに登録されているかを確認する。
          model.query('SELECT EXISTS(SELECT * FROM register_table WHERE name = ? AND pass = ?) AS exist', user_pass.slice(1,3), function(err, rows) {//userとpassの組み合わせがDB上に存在するかの確認
            //存在する場合の処理
            if(rows[0]["exist"]== 1){
              //DBに登録されているslack_idを取得
              model.query('SELECT slack_id FROM register_table WHERE name = ? AND pass = ?', user_pass.slice(1,3), function(err, rows){
                slack_id = rows[0]["slack_id"]
                //DBからuser情報を削除
                model.query('DELETE FROM register_table WHERE name = ? AND pass = ?', user_pass.slice(1,3))
                //DBにuser情報を追加
                model.query('INSERT INTO slack_line_ids (slack_id, line_id, name) VALUES (?,?,?);', [slack_id,line_user_id,user_pass[1]])
                //マッチングが取れた旨をLineに送信
                pos(line_messsage_req(LINE_BOT_NAME,line_user_id,TEMPLATE_MESSAGE[2]))
              });
            }
            //存在しない場合の処理
            else{
              //userとpassが一致しないため再度送る旨を送信
              pos(line_messsage_req(LINE_BOT_NAME,line_user_id,TEMPLATE_MESSAGE[1]))
            }
          });
        }
      }
  
      //DB上に存在するときの処理。
      else{
        if(received_message == "@"){
          member_list = ""
          model.query('SELECT name FROM slack_line_ids', function(err, rows) {
            for(i = 0; i < rows.length; i++){
              member_list += rows[i]["name"] + "\n"
            }
            pos(line_messsage_req(LINE_BOT_NAME,line_user_id,member_list))
          });
        }
        else{
          model.query('select id from slack_line_ids where line_id = ?', [line_user_id], function(err, rows){
            request_message = received_message.replace(/(@[^ ]*)( .*)/, "<$1>$2").replace(/@here/,"!here|@here")
            var options = {url: DOMAIN_PATH + '/slack?message=' + encodeURIComponent(request_message) + "&id=" + encodeURIComponent(rows[0]["id"])}
            request.get(options);
          });
        }
      }
    });
  };
});
module.exports = router;

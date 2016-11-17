var express = require('express');
var router = express.Router();
var RtmClient = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;
var request = require('request');

var token = process.env.SLACK_BOT_TOKEN;
var channel_id = process.env.CHANNEL_ID;
var line_url = process.env.LINE_URL;
var domain_path = process.env.DOMAIN_PATH

var model = require('../model/com_up_app_db.js');
//var user = model.User;

var rtm = new RtmClient(token,{logLevel: 'error'});
rtm.start();
 
rtm.on(RTM_EVENTS.MESSAGE, function (message) {
  if (message.channel[0] == 'D'){
    var user = rtm.dataStore.getUserById(message.user)

    var dm = rtm.dataStore.getDMByName(user.name);
          
    rtm.sendMessage('Hello ' + user.name + '!', dm.id);
    rtm.sendMessage('lineで ' + line_url + ' を友達登録して、', dm.id);
    var key = Math.random().toString(36).slice(-4);
    rtm.sendMessage(user.name + '/' + key + 'を打ってください', dm.id);
    model.query('insert into register_table (slack_id, pass, name) values(?,?,?)',[message.user, key, user.name]);
    return;
    }
  else{
//    user.find({ where: {slack_id: message.user} }).success(function(result) {
    model.query('select id from slack_line_ids where slack_id = ?', [message.user], function(err, rows) {
    if(!rows.length){
      return;
    }
    else{
      mention = message.text.match(/(<\![^>]*>)?(<@([^>]+)>:? )?(.+$)/);
      var options = {
        url: domain_path + '/line/push?message=' + encodeURIComponent(mention[4]) + '&id=' + rows[0].id + '&mention_id=' + mention[3]
      }
  　  request.get(options);
    }
  　});
  }
});

router.get('/', function(req, res, next) {
   message = req.query.message;
   id = req.query.id;
    model.query('select name from slack_line_ids where id = ?', [id], function(err, rows) {
//user.find({ where: {id: id} }).success(function(result) {
     rtm.sendMessage('from ' + rows[0].name +'\n'+ message , channel_id, function messageSent(){});
   });
   res.send("ok");
  });
 
module.exports = router;


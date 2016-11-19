# tsunagu-kun

## 1.tsunagu-kunとは？？
tsunagu-kunはLineとSlackという異なるアプリケーション間でコミュニケーションを可能にするBOTである。Slack側のBOTはtsunagu-kun-sanで、Line側のBOTはtsunagu-kun-chanである。このBOTを使うことによってLine→Slackにメッセージを送ったり、Slack→Lineにメッセージを送ったり、またメンションをつけることによって任意のユーザにメッセージを送ることが出来る。


|Slack||Line|
|:-:|:-:|:-:|
|<img src=./img/slack.jpg width=200px height=200px>|⇔|<img src=./img/line.jpg width=200px height=200px>|
|**tsunagu-kun-san(Slack BOT)**||**tsunagu-kun-chan(Line BOT)**|
|<img src=./img/tsunagu-kun-san.png width=200px height=250px>|⇔|<img src=./img/tsunagu-kun-chan.png width=200px height=250px>|




## 2.用意するもの
* slack
* line
* コミュ力(無くても良い)

## 3.使用手順
* 3.1. slackのチャンネルにtsunagu-kun-sanを招待
* 3.2. 会員登録をする(slackによるDM)
* 3.3. 会員認証をする(Lineで友達登録してslackで受け取ったuser_id/passを入力する)
* 3.4. 認証が取れたと出れば準備完了！

### 3.1. Slackのチャンネルにtsunagu-kun-sanを招待
![](./img/tsunagu-kun-san_active.png)  

tsunagu-kun-sanをSlackのchannelに招待し、Active(◯が緑色)になっていることを確認する


### 3.2. 会員登録をしよう！
Slackでtsunagu-kun-sanにダイレクトメッセージを送ろう！
送るメッセージはなんでもOK！メッセージを送るとtsunagu-kun-sanからメッセージが送られてきて、user名と認証用のpassが送られてきます。
<img src=./img/touroku.png height=200>  

### 3.3. line側で会員認証をしよう！
slackで送られてきた[リンク](https://line.me/R/ti/p/%40vih9944f)をクリックして以下のQRコードから友だち追加をします。  

[<img src = ./img/qr.png height = 200>](https://line.me/R/ti/p/%40vih9944f)  

↑tsunagu-kun-chan登録用QRコード  


<img src=./img/line_follow.jpg height = 400>  

Lineでtsunagu-kun-chanを友達に追加するか聞かれるので"追加"をタップする。



すると以下のようなメッセージが来るので先程Slackから送られてきたユーザ名とパスワードを入力します。  

<img src=./img/follow_message.png height = 200>


### 3.4. 認証が取れたと出れば準備完了
<img src=./img/line_login.png height=200>  

user名とパスワードが一致すると"認証がとれた"のメッセージが出るので成功！



## 4.tsunagu-kunを使用する
||tsunagu-kunでできること|
|:-:|:--|
|4.1|slack->lineへメッセージを送る|
|4.2|line->slackへメッセージを送る|
|4.3|メンションを使ってslackから任意のユーザにLineメッセージを送る|
|4.4|LineからSlackへメンションをつけて送る|
|4.5|Lineでメンションで送れる一覧を表示|


### 4.1. slack->lineへメッセージを送る
まずはSlackからLineへメッセージを送ろう！  

Slackで好きな言葉を発してみよう！  

<img src=./img/from_slack.png height=75>  


するとline側にtsunagu-kun-chanからメッセージが届きます！  
<img src=./img/from_slack_line.png height=100>  

### 4.2. line->slackへメッセージを送る
次にLineからSlackへメッセージを送ろう！

Lineで好きな言葉を発してみよう！  

<img src=./img/from_line.png height = 75>  

するとSlack側にtsunagu-kun-sanからメッセージが届きます！

<img src=./img/from_line_slack.png height = 100>  



### 4.3. メンションを使ってslackから任意のユーザにLineメッセージを送る
<img src=./img/from_slack_mention.png height=75>  

Slackからメンション付きでメッセージを送ってみよう!
@usernameでメンション付きメッセージを送れます！

<img src=./img/from_slack_mention_line.png height=100>  

するとメンションの付いたユーザにだけLineにメッセージを送ります。
またメンションがついていることがわかるように＠ユーザ名がメッセージの最初に付与されます。

### 4.4. LineからSlackへメンションをつけて送る
<img src=./img/from_line_mention.png height=50>  

Lineからメンション付きでメッセージを送ってみよう！
@usernameでメンション付きメッセージを送れます！  

<img src=./img/from_line_mention_slack.png height=100>

するとslack側でメンションがついてメッセージが送られてきます。




### 4.5. Lineでメンションで送れる一覧を表示
<img src=./img/mention_list.png height = 300>  

tsunagu-kun-chanに"@"というメッセージを送るとメンションを送れるユーザの一覧が取得できます

## 5. 退会
tsunagu-kunから情報を受け取りたくなくなったらLine側でブロックすることによって完全に退会することが出来ます。データベースの認証情報も全て削除されます

## 6. 再会員登録
Lineでtsunagu-kunのブロックを解除して再び3.の手順を踏むと再びtsunagu-kunから情報を受け取れるようになります。

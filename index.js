var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
const { text } = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// app.listen((process.env.PORT || 3000));
app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
    });


// Server frontpage
app.get('/', function (req, res) {
    res.send('Final Editing');
}); 

// Facebook Webhook 
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});  

// handler receiving messages
app.post('/webhook', function (req, res) { 
    var events = req.body.entry[0].messaging; 
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message) {
            if (!kittenMessage(event.sender.id, event.message.text)) {
                sendMessage(event.sender.id);
            }
        }
        if (event.message) {
            if (!sendButtonMessage(event.sender.id, event.message.text)) {
                sendMessage(event.sender.id);
            } 
        }    
        if(event.message){
             if(!sendQuickReply(event.sender.id, event.message.text)){
                sendMessage(event.sender.id); 
             }
        }
        if(event.message){
            if(!sendReplymm(event.sender.id, event.message.text)){
               sendMessage(event.sender.id); 
            }
       } 
        else if (event.postback) {
           receivedPostback(event.postback.payload_event);
          //  sendMessage(event.sender.id);
           
          // console.log("Postback received: " + JSON.stringify(event.postback));
          // receivedPostback(payload_event);
      }
    } 
    res.sendStatus(200);
});

// generic function sending messages
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}; 
// handle postback message
function receivedPostback(recipientId, payload_event){

  var payload = payload_event.postback.payload; 
  if(payload === 'အကြောင်းအရာ'){
    message = { "text": "Oops, try sending another image." };
     sendMessage(recipientId, message);
     return true;
  } 
};
// send rich message with kitten
function kittenMessage(recipientId, text) {
    
    text = text || "";
    var values = text.split();
    if (values[0] === 'ရန်ကုန်') {
            var imageUrl = "https://placekitten.com/";
            message = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "ရန်ကုန်",
                            "subtitle": "ရန်ကုန်အကြောင်းအရာ",
                            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Travel-Burma-yangon-shwedagon-pagoda.jpg/1280px-Travel-Burma-yangon-shwedagon-pagoda.jpg",
                            "buttons": [{
                              "type": "web_url",
                              "url": "https://www.neptunemm.com/",
                              "title": "ဝဘ်ဆိုက်တွင်ကြည့်ရန်"
                              },
                              {
                                "type": "postback",
                                "title": "အကြောင်းအရာကြည့်ရန်",
                                "payload": "အကြောင်းအရာ",
                              } 
                            ] 
                        }]
                    } 
                }
            };
            sendMessage(recipientId, message);
            return true;  
    }   
    return false;  
};   

function sendButtonMessage(recipientId, text) { 
  text = text || "";
  var values = text.split();
  if (values[0] === 'button') { 
          message = {
            "attachment": {
              "type": "template",
              "payload": {
                "template_type": "button",
                "text": "This is test text",
                buttons:[{
                  type: "web_url",
                  url: "https://www.neptunemm.com/",
                  title: "Open Web URL"
                }, {
                  type: "postback",
                  title: "Trigger Postback",
                  payload: "DEVELOPER_DEFINED_PAYLOAD"
                }, {
                  type: "phone_number",
                  title: "Call Phone Number",
                  payload: "09967669132"
                }]
              }
            }
          }  
        sendMessage(recipientId, message);    
                return true;   
}    
};   
  
  function sendQuickReply(recipientId, text) { 
    text = text || "";
    var values = text.split(); 
    if (values[0] === 'hi' || values[0] === 'Hi') {
            message = {
                text: "Choose Language",
                quick_replies: [
                  { 
                    "content_type":"text",
                    "title":"Myanmar",
                    "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_ACTION"
                  },
                  {
                    "content_type":"text",
                    "title":"English",
                    "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_COMEDY"
                  },
                ]
              }
            sendMessage(recipientId, message);    
                          return true; 
    }
  }; 
  function sendReplymm(recipientId, text) { 
    text = text || "";
    var values = text.split(); 
    if (values[0] === 'Myanmar') {
            message = {
                text: "Choose Your City",
                quick_replies: [
                  { 
                    "content_type":"text",
                    "title":"ရန်ကုန်",
                    "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_ACTION"
                  },
                  {
                    "content_type":"text",
                    "title":"မန္တလေး",
                    "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_COMEDY"
                  },
                  {
                    "content_type":"text",
                    "title":"တောင်ကြီး",
                    "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"
                  },
                  {
                    "content_type":"text",
                    "title":"နေပြည်တော်",
                    "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_COMEDY"
                  },
                  {
                    "content_type":"text",
                    "title":"မော်လမြိုင်",
                    "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"
                  }
                ]
              }
            sendMessage(recipientId, message);    
                          return true; 
    } 
    if (values[0] === 'English') {
      message = {
          text: "Choose Your City",
          quick_replies: [
            { 
              "content_type":"text",
              "title":"Yangon",
              "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_ACTION"
            },
            {
              "content_type":"text",
              "title":"Mandalay",
              "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_COMEDY"
            },
            {
              "content_type":"text",
              "title":"Taunggyi",
              "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"
            }, 
            {
              "content_type":"text",
              "title":"Naypyidaw",
              "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"
            },
            {
              "content_type":"text",
              "title":"Mawlamyine",
              "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"
            }
          ]
        }
      sendMessage(recipientId, message);    
                    return true; 
}
  };

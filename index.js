var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
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
        if (event.message) {
            if (!sendChooseButton(event.sender.id, event.message.text)) {
                sendMessage(event.sender.id);
            }
        }
        else if (event.postback) {
            console.log("Postback received: " + JSON.stringify(event.postback));
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
// send rich message with kitten
function kittenMessage(recipientId, text) {
    
    text = text || "";
    var values = text.split(' ');
    
    if (values.length === 3 && values[0] === 'kitten') {
        if (Number(values[1]) > 0 && Number(values[2]) > 0) {
            
            var imageUrl = "https://placekitten.com/" + Number(values[1]) + "/" + Number(values[2]);
            
            message = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Kitten",
                            "subtitle": "Cute kitten picture",
                            "image_url": imageUrl ,
                            "buttons": [{
                                "type": "web_url",
                                "url": imageUrl,
                                "title": "Show kitten"
                                }, {
                                "type": "postback",
                                "title": "I like this",
                                "payload": "User " + recipientId + " likes kitten " + imageUrl,
                            }]
                        }]
                    }
                }
            };
    
            sendMessage(recipientId, message);
            
            return true;
        }
    }   
    return false;  
};   

function sendButtonMessage(recipientId, text) { 
    text = text || "";
    var values = text.split(' ');
    if (values.length === 3 && values[0] === 'button') { 
        if (Number(values[1]) > 0 && Number(values[2]) > 0) {
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
}    
  }; 

  function sendChooseButton(recipientId, text) { 
    text = text || "";
    var values = text.split(' ');
    if (values.length === 3 && values[0] === 'Hi') { 
        if (Number(values[1]) > 0 && Number(values[2]) > 0) {
            message = {
              "attachment": {
                "messaging_type": "RESPONSE",
                "message":{
                  "text": "Where Would You Like To Go?",
                  "quick_replies":[
                    {
                      "content_type":"text",
                      "title":"Yangon",
                      "payload":"DEVELOPER_DEFINED_PAYLOAD",
                    },{
                      "content_type":"text",
                      "title":"Mandalay",
                      "payload":"DEVELOPER_DEFINED_PAYLOAD",
                    },
                    {
                        "content_type":"text",
                        "title":"Taunggyi",
                        "payload":"DEVELOPER_DEFINED_PAYLOAD",
                      }
                  ]
                }
              }
            }  
          sendMessage(recipientId, message);    
                  return true;
    }
}    
  }

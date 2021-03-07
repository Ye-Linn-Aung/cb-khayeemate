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
curl -X POST -H "Content-Type: application/json" -d '{ 
"get_started":{
    "payload":"GET_PAYLOAD_PAAYLLOAD"
}
}' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=EAALPiZB55UboBAADOCunxh1p1dznEQZBajOCyNU2ZBAZBdHYiGKc4ZBZAP0WopGuIoZAExxt26su3G68y0bKq89N3Qpfi3XhI1jbqbRpoH9ghF2NxCua3ZBgkQH3S4U96vmU2cmUyN77EZBU6002cga8oLaOGrZAtJr8sjb2xTpqeExogg9WJ8NTq3"
{"result":"success"}

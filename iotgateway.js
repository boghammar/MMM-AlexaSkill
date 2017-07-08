/*
 * AWS IOT interface for the MMM-AlexaSkill
 */
var awsIot = require('aws-iot-device-sdk');


var app = {};

app.TOPIC_PLAY = "MagicMirror:Play";

// ------- Setup the IOT Gateway
app.setup = function () {
    try {
        app.device = awsIot.device({
            keyPath: __dirname + "/certs/MagicMirror.private.key",
            certPath: __dirname + "/certs/MagicMirror.cert.pem",
            caPath: __dirname + "/certs/root-CA.crt",
            clientId: "MirrorMirror" + (new Date().getTime()),
            region: "us-east-1",
        });

        app.device.on('connect', function () {
            console.log('connect');
        });

        app.device.on('message', function (topic, payload) {
            console.log('message', topic, payload.toString());
        });
    } catch (err) {
        console.log("AlexaComms - SERVICE_FAILURE: " + JSON.stringify(err), err);
    }
}

// ----- Handle a play request from Alexa
app.play = function (what, where, callback) {
    var data = {
        'what': what,
        'where': where
    };
    
    app.device.publish(app.TOPIC_PLAY, JSON.stringify(data), function() {
        console.log('Published topic: '+ app.TOPIC_PLAY + ' Data: '+ JSON.stringify(data));
        callback();
    });
}

module.exports = app;
/*
 * AWS IOT interface for the MMM-AlexaSkill
 */
var awsIot = require('aws-iot-device-sdk');


var app = {};

app.TOPIC_PLAY = "MagicMirror:Play";
app.TOPIC_PLAYVIDEO = "PLAYVIDEO";

// ------- Setup the IOT Gateway
app.setup = function (cfg) {
    try {
        var opt = {
            keyPath: __dirname + "/certs/" + cfg.certID + "-private.pem.key",
            certPath: __dirname + "/certs/" + cfg.certID + "-certificate.pem.crt",
            caPath: __dirname + "/certs/root-CA.crt",
            clientId: "MirrorMirror" + (new Date().getTime()),
            region: "us-east-1",
            host: cfg.IOTEndpoint
        }
        console.log("Creating device");
        app.device = awsIot.device(opt);

        app.device.on('connect', function () {
            console.log('IOT Device connected to '+ opt.host);
        });

        app.device.on('message', function (topic, payload) {
            console.log('message: ', topic, payload.toString());
        });
        
        console.log("AlexaComms - Created IOT device: " + opt.host);
    } catch (err) {
        console.log("AlexaComms - SERVICE_FAILURE: " + JSON.stringify(err), err);
    }
}

// ----- Handle a resume request from Alexa
app.resume = function (where, callback) {
    console.log("iotgateway: Got ResumeSonos Where="+where);
    var data = {
        'module': 'SonosPlay',
        'body': {
            'action': 'resume',
            'where': where
        }
    };
    app.publish(app.TOPIC_PLAY, data, callback);
}

// ----- Handle a stop request from Alexa
app.stop = function (where, callback) {
    console.log("iotgateway: Got StopSonos Where="+where);
    var data = {
        'module': 'SonosPlay',
        'body': {
            'action': 'stop',
            'where': where
        }
    };
    app.publish(app.TOPIC_PLAY, data, callback);
}

// ----- Handle a stop request from Alexa
app.next = function (where, callback) {
    console.log("iotgateway: Got NextSonos Where="+where);
    var data = {
        'module': 'SonosPlay',
        'body': {
            'action': 'next',
            'where': where
        }
    };
    app.publish(app.TOPIC_PLAY, data, callback);
}

// ----- Handle a play request from Alexa
app.play = function (what, from, where, callback) {
    console.log("iotgateway: Got PlaySonos What="+what + " From="+from + " Where="+where);
    var data = {
        'module': 'SonosPlay',
        'body': {
            'action': 'play',
            'what': what,
            'from': from,
            'where': where
        }
    };
    app.publish(app.TOPIC_PLAY, data, callback);
}

// ----- Handle a play video request from Alexa
app.playVideo = function (index, callback) {
    console.log("iotgateway: Got PlayVideo Index="+index);
    var data = {
        'module': 'MMM-Video',
        'body': {
            'action': 'play',
            'video': {
                'ix': index
            }
        }
    };
    app.publish(app.TOPIC_PLAYVIDEO, data, callback);
}

// ----- Handle a stop video request from Alexa
app.stopVideo = function (callback) {
    console.log("iotgateway: Got StopVideo");
    var data = {
        'module': 'MMM-Video',
        'body': {
            'action': 'stop'
        }
    };
    app.publish(app.TOPIC_PLAYVIDEO, data, callback);
}

// ----- Handle a play video request from Alexa
app.publish = function(topic, data, callback) {
    console.log("iotgateway: publish " + topic+ " Data="+JSON.stringify(data));
    try {
        app.device.publish(topic, JSON.stringify(data), function() {
            console.log('Published topic: '+ topic + ' Data: '+ JSON.stringify(data));
            callback();
        });
    } catch (err) {
        console.log("AlexaComms - SERVICE_FAILURE: " + JSON.stringify(err), err);
    }
}

module.exports = app;
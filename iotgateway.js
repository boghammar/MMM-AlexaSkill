/*
 * AWS IOT interface for the MMM-AlexaSkill
 */
var awsIot = require('aws-iot-device-sdk');


var app = {};

app.TOPIC_PLAY = "MagicMirror:Play";

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
    console.log("iotgateway: publish " + app.TOPIC_PLAY+ " Data="+JSON.stringify(data));
    try {
        app.device.publish(app.TOPIC_PLAY, JSON.stringify(data), function() {
            console.log('Published topic: '+ app.TOPIC_PLAY + ' Data: '+ JSON.stringify(data));
            callback();
        });
    } catch (err) {
        console.log("AlexaComms - SERVICE_FAILURE: " + JSON.stringify(err), err);
    }
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
    console.log("iotgateway: publish " + app.TOPIC_PLAY+ " Data="+JSON.stringify(data));
    try {
        app.device.publish(app.TOPIC_PLAY, JSON.stringify(data), function() {
            console.log('Published topic: '+ app.TOPIC_PLAY + ' Data: '+ JSON.stringify(data));
            callback();
        });
    } catch (err) {
        console.log("AlexaComms - SERVICE_FAILURE: " + JSON.stringify(err), err);
    }
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
    console.log("iotgateway: publish " + app.TOPIC_PLAY+ " Data="+JSON.stringify(data));
    try {
        app.device.publish(app.TOPIC_PLAY, JSON.stringify(data), function() {
            console.log('Published topic: '+ app.TOPIC_PLAY + ' Data: '+ JSON.stringify(data));
            callback();
        });
    } catch (err) {
        console.log("AlexaComms - SERVICE_FAILURE: " + JSON.stringify(err), err);
    }
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
    console.log("iotgateway: publish " + app.TOPIC_PLAY+ " Data="+JSON.stringify(data));
    try {
        app.device.publish(app.TOPIC_PLAY, JSON.stringify(data), function() {
            console.log('Published topic: '+ app.TOPIC_PLAY + ' Data: '+ JSON.stringify(data));
            callback();
        });
    } catch (err) {
        console.log("AlexaComms - SERVICE_FAILURE: " + JSON.stringify(err), err);
    }
}

module.exports = app;
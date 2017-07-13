'use strict'
const Alexa = require('alexa-sdk');

const APP_ID = require('./package.json').alexa.applicationId;

const mirror = require('./iotgateway');
var mirrorConfig = require('./certs/deployConfig'); // This file is put here by the prepareDeploy.js utility

// ------------ Configure the IOT device
console.log("Calling mirror.setup()");
mirror.setup(mirrorConfig);

exports.handler = function (event, context, callback) {
    let alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var languageStrings = {
    "en-US": {
        "translation": {
            "WELCOME_MESSAGE": "Hello my Queen, what can I do for you? ",
            "WELCOME_REPROMPT": "I can show play music on yor Sonos devices, turn on lights and control your magic mirror. If you give me commands like 'play beatles in the office' or 'play kitchen'. I can also open or close a magic mirror module, if you say commands like 'open compliments', or 'close weather forecast'. What can I do for you, my Queen?",
            "WELCOME_CARD": "Hello",
            "HELP_MESSAGE": "Hello my Queen, I can show you text and images, if you give me commands like 'say you are the fairest of them all' or 'find Snow White'. I can also open or close a magic mirror module, if you say commands like 'open compliments', or 'close weather forecast'. What can I do for you, my Queen?",
            "HELP_CARD": "Help",
            "PLAY_SONOS": "Yes, my Queen. %s",
            "PLAY_SONOS_ERR": "Sorry, my Queen, I didn't get that. %s",
            "PLAY_SONOS_CARD": "Play Sonos",
            "STOP_MESSAGE": "See you next time, my Queen!",
            "STOP_CARD": "Goodbye",
            "ERROR_CARD": "Error"
        }
    }
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('SayHello');
    },
    'MirrorMirrorHelloIntent': function () {
        this.emit('SayHello');
    },
    'SayHello': function () {
        this.emit(':askWithCard', this.t("WELCOME_MESSAGE"), this.t("WELCOME_REPROMPT"), this.t("WELCOME_CARD"), this.t("WELCOME_MESSAGE") + this.t("WELCOME_REPROMPT"));
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':askWithCard', this.t("HELP_MESSAGE"), this.t("HELP_MESSAGE"), this.t("HELP_CARD"), this.t("HELP_MESSAGE"));
    },
    'AMAZON.StopIntent': function () {
        this.emit('StopCommand');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('StopCommand');
    },
    'StopCommand': function () {
        this.emit(':tellWithCard', this.t("STOP_MESSAGE"), this.t("STOP_CARD"), this.t("STOP_MESSAGE"));
    },
    'StopSonos': function () {
        var self = this;
        let where = this.event.request.intent.slots.WHERE.value;
        console.log("index.js: Got StopSonos Where=" + where);
        mirror.stop(where, function(err) {
            if (err) {
                console.log("AlexaComms - SERVICE_FAILURE: " + JSON.stringify(err), err);
                var errorStr = self.t("PLAY_SONOS_ERR", JSON.stringify(err));
                self.emit(':askWithCard', errorStr, errorStr, self.t("ERROR_CARD"), errorStr)
                return;
            }
            console.log("index.js: Have sent the request StopSonos Where=" + where);
            var answer = "Ok. Stopping in " + where +"."
            self.emit(':tellWithCard', self.t("PLAY_SONOS", answer), self.t("PLAY_SONOS_CARD"), answer);
        });
    },
    'ResumeSonos': function () {
        var self = this;
        let where = this.event.request.intent.slots.WHERE.value;
        console.log("index.js: Got ResumeSonos Where=" + where);
        mirror.resume(where, function(err) {
            if (err) {
                console.log("AlexaComms - SERVICE_FAILURE: " + JSON.stringify(err), err);
                var errorStr = self.t("PLAY_SONOS_ERR", JSON.stringify(err));
                self.emit(':askWithCard', errorStr, errorStr, self.t("ERROR_CARD"), errorStr)
                return;
            }
            console.log("index.js: Have sent the request ResumeSonos Where=" + where);
            var answer = "Ok. Resuming in " + where +"."
            self.emit(':tellWithCard', self.t("PLAY_SONOS", answer), self.t("PLAY_SONOS_CARD"), answer);
        });
    },
    'NextSonos': function () {
        var self = this;
        let where = this.event.request.intent.slots.WHERE.value;
        console.log("index.js: Got NextSonos Where=" + where);
        mirror.next(where, function(err) {
            if (err) {
                console.log("AlexaComms - SERVICE_FAILURE: " + JSON.stringify(err), err);
                var errorStr = self.t("PLAY_SONOS_ERR", JSON.stringify(err));
                self.emit(':askWithCard', errorStr, errorStr, self.t("ERROR_CARD"), errorStr)
                return;
            }
            console.log("index.js: Have sent the request NextSonos Where=" + where);
            var answer = "Ok. Playing next in " + where +"."
            self.emit(':tellWithCard', self.t("PLAY_SONOS", answer), self.t("PLAY_SONOS_CARD"), answer);
        });
    },
    'PlaySonos': function () {
        var self = this;
        let what = this.event.request.intent.slots.WHAT.value;
        let from = this.event.request.intent.slots.FROM.value;
        let where = this.event.request.intent.slots.WHERE.value;
        console.log("index.js: Got PlaySonos What=" + what + " From=" + from+ " Where=" + where);
        mirror.play(what, from, where, function (err) {
            if (err) {
                console.log("AlexaComms - SERVICE_FAILURE: " + JSON.stringify(err), err);
                var errorStr = self.t("PLAY_SONOS_ERR", JSON.stringify(err));
                self.emit(':askWithCard', errorStr, errorStr, self.t("ERROR_CARD"), errorStr)
                //res.say('Could not comply with that. Sorry.');
                return;
            }
            console.log("index.js: Have sent the request PlaySonos What=" + what + " Where=" + where);
            var answer = "Ok. Playing " + what + " from " + from+ " in " + where +"."
            self.emit(':tellWithCard', self.t("PLAY_SONOS", answer), self.t("PLAY_SONOS_CARD"), answer);
            //res.say('Ok. Done and done.');
            /*if (what === undefined || what == '') {
                res.say('Ok. Resuming in ' + where + '.');
            } else {
                res.say('Ok. Playing ' + what + ' in ' + where + '.');
            }*/
        });
        //res.say('Ok. Playing ' + what + ' in ' + where + '.');
    }
};
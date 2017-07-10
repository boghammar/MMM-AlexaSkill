'use strict'
/*
 * An AWS Lambda function to control Alexa Skill MagicMirror requests.
 * 
 */
const Alexa = require('alexa-app');
const mirror = require('./iotgateway');

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;

// ------------ Define an alexa-app
var app = new Alexa.app('magicmirror')
app.id = require('./package.json').alexa.applicationId;
var mirrorConfig = require('./certs/deployConfig'); // This file is put here by the prepareDeploy.js utility

// ------------ Configure the IOT device
mirror.setup(mirrorConfig);

// ------------ Define the launch request
app.launch(function(req, res) {
    var prompt = 'What can I do for you? Say help for help.';
    res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

// ----------- Define the Play Sonos intent
app.intent('PlaySonos', 
    {
        'slots': {'WHAT': 'LITERAL', 'WHERE': 'LITERAL'},
        'utterances': ['play {tunein|WHAT} in {office|kitchen|WHERE}', 'start {office|kitchen|WHERE}'] 
    }, function(req, res) {
        var what = req.slot('WHAT');
        var where = req.slot('WHERE');
        mirror.play(what, where, function() {
            if (what === undefined || what == '') {
                res.say('Ok. Resuming in ' + where + '.');
            } else {
                res.say('Ok. Playing ' + what + ' in ' + where + '.');
            }
        });
    }
);

module.exports = app;
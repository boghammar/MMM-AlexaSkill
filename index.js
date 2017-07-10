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
console.log("Calling mirror.setup()");
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
        console.log("index.js: Got PlaySonos What="+what + " Where="+where);
        mirror.play(what, where, function(err) {
            if (err) {
                console.log("AlexaComms - SERVICE_FAILURE: " + JSON.stringify(err), err);
                res.say('Could not comply with that. Sorry.');
                return;
            }
            console.log("index.js: Have sent the request PlaySonos What="+what + " Where="+where);
            res.say('Ok. Done and done.');
            /*if (what === undefined || what == '') {
                res.say('Ok. Resuming in ' + where + '.');
            } else {
                res.say('Ok. Playing ' + what + ' in ' + where + '.');
            }*/
        });
        //res.say('Ok. Playing ' + what + ' in ' + where + '.');
    }
);

module.exports = app;
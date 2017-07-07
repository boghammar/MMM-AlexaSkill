'use strict'
/*
 * An AWS Lambda function to control Alexa Skill MagicMirror requests.
 * 
 */
const Alexa = require('alexa-app');

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;

// ------------ Define an alexa-app
var app = new Alexa.app('magicmirror')
app.id = require('./package.json').alexa.applicationId;

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
        if (req.slot('WHAT') === undefined || req.slot('WHAT') == '') {
            res.say('Ok. Resuming in ' + req.slot('WHERE') + '.');
        } else {
            res.say('Ok. Playing ' + req.slot('WHAT') + ' in ' + req.slot('WHERE') + '.');
        }
    }
);

module.exports = app;
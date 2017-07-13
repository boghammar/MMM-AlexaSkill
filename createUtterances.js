/*
 * Script to create the utterances and intent schemas using alexa utterances
 */

var alexa = require('alexa-app');
var fs = require('fs');

var app = new alexa.app();
app.dictionary =  {
    'places': ['office', 'kitchen', 'livingroom', 'bathroom'],
    'sources': ['spotify', 'tunein', 'sonos']
};

app.intent("PlaySonos",
    {
        'slots': {'WHAT': 'LITERAL', 'FROM': 'LITERAL', 'WHERE': 'LITERAL'},
        'utterances': [
            '{to|} play {a song|beatles|WHAT} from {sources|FROM} in {places|WHERE}'
        ]         
    }, function(req, res) {}
);

app.intent("ResumeSonos",
    {
        'slots': {'WHERE': 'LITERAL'},
        'utterances': [
            '{to|} {resume|start} {in|} {places|WHERE}'
        ]         
    }, function(req, res) {}
);

app.intent("StopSonos",
    {
        'slots': {'WHERE': 'LITERAL'},
        'utterances': [
            '{to|} {stop|halt} {playing|} {in|} {places|WHERE}'
        ]         
    }, function(req, res) {}
);

app.intent("NextSonos",
    {
        'slots': {'WHERE': 'LITERAL'},
        'utterances': [
            '{play|} {next|skip} {in|} {places|WHERE}'
        ]         
    }, function(req, res) {}
);

app.exhaustiveUtterances = true;
console.log('\nSCHEMA:');
var schema = app.schema();
console.log(schema);
fs.writeFileSync('./alexa/schema.txt', schema);
console.log('\nUTTERANCES:');
var utterances = app.utterances();
console.log(utterances);
fs.writeFileSync('./alexa/utterances.txt', utterances);

# MMM-AlexaSkill
This is an [AWS Lambda](http://aws.amazon.com/lambda) deployed Alexa skill that communicates with the [MagicMirror](https://github.com/MichMich/MagicMirror) module [MMM-Alexa](https://github.com/boghammar/MMM-Alexa) via the AWS IOT Gateway.

This work is inspired by joanaz [Mirror Mirror On The Wall Alexa Skill](https://github.com/joanaz/MirrorMirrorOnTheWallSkill). Major difference is that this implementation use the [alexa-app](https://github.com/alexa-js/alexa-app) SDK instead of the **alexa-skills-kit-sdk-for-nodejs** for creating the skill and of course there are other features of the skill. 

The main features that I developed this skill for was:
* to control my [Sonos](http://www.sonos.com/) speakers using Alexa
* to control my lights based on a [Vera solution](http://getvera.com/)
* to control various features of the [Magic Mirror](https://github.com/MichMich/MagicMirror)

## Installation
1. Install the MMM-Alexa module in your Magic Mirror installation
2. Clone this repository with `git clone https://github.com/boghammar/MMM-AlexaSkill.git`
3. Install dependencies by `cd MMM-AlexaSkill` and then `npm install`
4. Setup an AWS IOT device according to the instructions below
5. Configure your skill with the credentials from the AWS IOT device creation 
6. Deploy your code to AWS Lambda (see below)

## Setup an AWS IOT device

## Configure your skill

## Deploy your code to AWS Lambda
### Preparing the zip file
Since this skill relies on AWS IOT to communicate with the Magic Mirror you need to deploy your certificates along with the code when deploying to AWS Lambda. For that purpose use the utility `prepareDeploy.js` to pack the correct files for deployment. What this utility does is

1. Find out the secret directory by reading the Alexa.configPath in the package.js file.
2. Reads the `Alexa.configPath+/deployConfig.js` file that contains the following parameters
```javascript
// This is the deploy configuration for MMM-AlexaSkill
var cfg = {
	IOTEndpoint: 'apt******.iot.us-east-1.amazonaws.com',
	certPath: 'C:/_data/dev/certs', // Where are the certificates
	certID: '16cc68c66f'            // Whats the prefix of the certificate files
}
module.exports = cfg;
```
3. Copies the certificates files to the directory `./certs` within your source tree
4. Copies the deployConfig file to the directory `./certs` within your source tree
5. Zips all necessary source files (including the `node_modules` directory) along with the `./certs` directory.

The resulting zip file can then be uploaded using the [AWS Lambda Console](https://console.aws.amazon.com/lambda/home).

### Create intents and utterances
The utility `createUtterances.js` is used to create the files `alexa/schema.txt`and `alexa/utterances.txt`. The contents of these files can be pasted into the appropriate windows in the [Amazon Alexa Skill configuration](https://developer.amazon.com/edw/home.html#/skills).

## Message format 
The messages sent from the skill to the IOT device have the following format:
```json
{
    "module": "nameofmodule",
    "body": {
        // Module specific module data
    }
}
```
for instance the SonosPlay module takes this message
```json
{
    "module": "SonosPlay",
    "body": {
        "action": "play",
        "what": "beatles",
        "from": "spotify",
        "where": "kitchen"
    }
}
```
the MMM-Video module takes this message
```json
{
    "module": "MMM-Video",
    "body": {
        "action": "play",
        "video": {
            "ix": 0
        }
    }
}
```

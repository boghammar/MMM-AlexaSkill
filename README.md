# MMM-AlexaSkill
Companion project to the MMM-Alexa project. This is the Alexa skill that communicates with the Magic Mirror MMM-Alexa via the AWS IOT Gateway.

This is an [AWS Lambda](http://aws.amazon.com/lambda) function of an Alexa skill for communicating and controlling a [MagicMirror](https://github.com/MichMich/MagicMirror) using AWS IoT Device Gateway.

It is complementary to the Magic Mirror Module [MMM-Alexa](https://github.com/boghammar/MMM-Alexa).

This work is inspired by joanaz [Mirror Mirror On The Wall Alexa Skill](https://github.com/joanaz/MirrorMirrorOnTheWallSkill). Major difference is that this implementation use the [alexa-app](https://github.com/alexa-js/alexa-app) SDK instead of the **alexa-skills-kit-sdk-fr nodejs** for creating the skill and of course there are other features of the skill. 

The main features that I developed this skill for was:
* to control my [Sonos](http://www.sonos.com/) speakers sing Alexa
* to control my lights based on a [Vera solution](http://getvera.com/)
* to control various aspects of the [Magic Mirror](https://github.com/MichMich/MagicMirror)

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

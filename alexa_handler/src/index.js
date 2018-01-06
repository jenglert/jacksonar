/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = 'amzn1.ask.skill.1fac355c-7a4d-436a-b1c5-2ff910aad0c0';
const SKILL_NAME = "Jackson Sonar";


const handlers = {
    'AskName': function () {
        const speechOutput = 'His name is J.R., keep it straight.';
        
        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'LaunchRequest': function() {
        const speechOutput = 'Jacksonar is ready.';
        
        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    }
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

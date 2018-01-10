/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = 'amzn1.ask.skill.1fac355c-7a4d-436a-b1c5-2ff910aad0c0';
const SKILL_NAME = "Jackson Sonar";

// utility methods for creating Image and TextField objects
const makePlainText = Alexa.utils.TextUtils.makePlainText;
const makeImage = Alexa.utils.ImageUtils.makeImage;

const handlers = {
    'AskName': function () {
        const speechOutput = 'His name is J.R., keep it straight.';

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'LaunchRequest': function () {
        this.response.cardRenderer(SKILL_NAME, 'Jacksonar is ready!');
        this.response.speak('Jacksonar is ready.')
            .listen('What do you want to know about him?');

        this.emit(':responseReady');
    },
    'ShowJackson': function () {
        const builder = new Alexa.templateBuilders.BodyTemplate7Builder();

        const template = builder.setTitle('J.R.')
            .setImage(makeImage('http://jackson-uploads.s3-website-us-east-1.amazonaws.com/IMG_20171231_134231.jpg'))
            .build();

        this.response.speak('Here is a photo!')
            .renderTemplate(template);
        this.emit(':responseReady');
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = 'amzn1.ask.skill.1fac355c-7a4d-436a-b1c5-2ff910aad0c0';
const SKILL_NAME = "Jackson Sonar";

// utility methods for creating Image and TextField objects
const makePlainText = Alexa.utils.TextUtils.makePlainText;
const makeRichText = Alexa.utils.TextUtils.makeRichText;
const makeImage = Alexa.utils.ImageUtils.makeImage;

const backgroundImages = [
    'http://jackson-uploads.s3-website-us-east-1.amazonaws.com/background-1.jpg',
    'http://jackson-uploads.s3-website-us-east-1.amazonaws.com/background-2.jpg',
    'http://jackson-uploads.s3-website-us-east-1.amazonaws.com/background-3.jpg',
    'http://jackson-uploads.s3-website-us-east-1.amazonaws.com/background-4.jpg'
];

function randomBackground() {
    return backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
}

const jacksonFacts = [
    "Jackson's birthday is December 28th.",
    "Jackson was 20 inches long when he was born.",
    "Jackson was 7lbs 9oz when he was born.",
    "Jackson was born with alot of hair.",
    "Jackson's due date was December 18th.  He was 10 days late!",
    "Jackson's nurses at the hospital called him Spike.",
    "Jackson still lives at home with his parents - how embarrassing."
];

const handlers = {
    'AskName': function () {
        const speechOutput = 'His name is J.R., keep it straight.';

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'JacksonFact': function() {
        const builder = new Alexa.templateBuilders.BodyTemplate1Builder();

        const fact = jacksonFacts[Math.floor(Math.random() * jacksonFacts.length)];

        const template = builder.setTitle('Did you know?')
            .setBackgroundImage(makeImage(randomBackground()))
            .setTextContent(makeRichText('<b><font size="7">' + fact + '</font></b>'))
            .build();

        this.response.speak(fact)
            .renderTemplate(template);

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
    'Unhandled': function () {
        const speechOutput = "Jim apparently didn't program that...";

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

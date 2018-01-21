import AWS from 'aws-sdk';

import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: "us-east-1_YFHZEPdFQ",
    ClientId: "4bq6t81ffhhtficadhjiahm9ei"
};

var userPool = new CognitoUserPool(poolData);

export const setAwsCredentials = (accessKey) => {
    console.log("Setting access key:" + accessKey);
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:1e1afa1c-07a9-43ad-8092-eaf1836cfa57',
        RoleArn: "arn:aws:iam::725929794843:role/Cognito_jacksonarAuth_Role",
        Logins: {
            'cognito-idp.us-east-1.amazonaws.com/us-east-1_YFHZEPdFQ': accessKey
        }
    });
    console.log("Access key set");
}

/**
 *  Refreshes an access key so it doesn't expire after ~20 minutes.
 */
export const refreshAccessKey = () => {
    return new Promise(function (resolve, reject) {
        //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
        AWS.config.credentials.refresh((error) => {
            if (error) {
                reject("Unable to refresh credentials:" + error);
            } else {

                console.log('Successfully logged in!');
                resolve();
            }
        });
    });
}

export const resetPasswordAuthenticated = (cognitoUser, newPassword) => {
    new Promise(function (resolve, reject) {

        cognitoUser.completeNewPasswordChallenge(newPassword, null, {
            onSuccess: function (result) {
                console.log("User completed new user challenge: " + cognitoUser.username);
                resolve(true);
            },

            onFailure: function (err) {
                console.log("Failed to complete new user challenge: " + cognitoUser.username);
                reject(err);
            },
        });

    });
}

export function PasswordNeedsResetError(message, cognitoUser) {
    this.name = 'PasswordNeedsResetError';
    this.message = message;
    this.cognitoUser = cognitoUser;
    this.stack = (new Error()).stack;
}
PasswordNeedsResetError.prototype = new Error();


export const unlockPassword = (username, newPassword, verificationCode) => {
    var userData = {
        Username: username,
        Pool: userPool
    };

    var cognitoUser = new CognitoUser(userData);

    return new Promise(function (resolve, reject) {
        cognitoUser.confirmPassword(verificationCode, newPassword, {
            onSuccess() {
                console.log("User password reset with verification code: " + username);
                resolve('Your password has been reset.');
            },
            onFailure(err) {
                console.log("Failed to reset user password with verification code: " + username);
                reject('Unable to reset password: ' + err);
            }
        });
    });
}

/**
 * Sets logged in credentials globally on the AWS object.  It's somewhat unfortunate that
 * we store the 'logged in' state in react state + AWS global state, but life goes on...
 * 
 * @returns a promise with the JWT token - or a failure message
 */
export const loginToAws = (username, password) => {
    var authenticationData = {
        Username: username,
        Password: password,
    };

    var authenticationDetails = new AuthenticationDetails(authenticationData);

    var userData = {
        Username: username,
        Pool: userPool
    };

    var cognitoUser = new CognitoUser(userData);

    return new Promise(function (resolve, reject) {
        console.log("Authenticating user: " + username);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                console.log("User authentication successful: " + username);
                var accessKey = result.getIdToken().getJwtToken();
                setAwsCredentials(accessKey);
                resolve(accessKey);
            },

            onFailure: function (err) {
                console.log("User authentication failed: " + username);
                reject(err);
            },

            newPasswordRequired: function (userAttributes, requiredAttributes) {
                console.log("User requires new password: " + username);
                reject(new PasswordNeedsResetError("Password needs to be reset", cognitoUser));
            }

        });
    });
}
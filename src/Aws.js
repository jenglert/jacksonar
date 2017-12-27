import AWS from 'aws-sdk';

import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: "us-east-1_YFHZEPdFQ",
    ClientId: "4bq6t81ffhhtficadhjiahm9ei"
};

var userPool = new CognitoUserPool(poolData);

export const setAwsCredentials = (accessKey) => {
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:1e1afa1c-07a9-43ad-8092-eaf1836cfa57',
        RoleArn: "arn:aws:iam::725929794843:role/Cognito_jacksonarAuth_Role",
        Logins: {
            // Change the key below according to the specific region your user pool is in.
            'cognito-idp.us-east-1.amazonaws.com/us-east-1_YFHZEPdFQ': accessKey
        }
    });
}

/**
 *  Refreshes an access key so it doesn't expire after ~20 minutes.
 */
export const refreshAccessKey = (accessKey) => {
    return new Promise(function (resolve, reject) {
        //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
        AWS.config.credentials.refresh((error) => {
            if (error) {
                reject("Unable to refresh credentials:" + error);
            } else {

                console.log('Successfully logged in!');
                resolve(accessKey);
            }
        });
    });
}

export class PasswordNeedsResetError extends Error {
    constructor(...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(...params);

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, PasswordNeedsResetError);
        }
    }
}

export const unlockPassword = (username, newPassword, verificationCode) => {
    var userData = {
        Username: username,
        Pool: userPool
    };

    var cognitoUser = new CognitoUser(userData);

    return new Promise(function(resolve, reject) {
        cognitoUser.confirmPassword(verificationCode, newPassword, {
            onSuccess() {
                resolve('Your password has been reset.');
            },
            onFailure(err) {
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
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                setAwsCredentials(result.getIdToken().getJwtToken());
                resolve(result.getIdToken().getJwtToken());
            },

            onFailure: function (err) {
                reject(err);
            },

            newPasswordRequired: function (userAttributes, requiredAttributes) {
                reject(new PasswordNeedsResetError());
            }

        });
    });
}
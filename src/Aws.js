import AWS from 'aws-sdk';

import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

// Sets logged in credentials globally on the AWS object.  It's somewhat unfortunate that
// we store the 'logged in' state in react state + AWS global state, but life goes on...
const loginToAws = (username, password) => {
    const poolData = {
        UserPoolId: "us-east-1_YFHZEPdFQ",
        ClientId: "4bq6t81ffhhtficadhjiahm9ei"
    };

    AWS.config.region = 'us-east-1';

    var userPool = new CognitoUserPool(poolData);

    var authenticationData = {
        Username: username,
        Password: password,
    };

    var userData = {
        Username: username,
        Pool: userPool
    };

    var authenticationDetails = new AuthenticationDetails(authenticationData);

    var cognitoUser = new CognitoUser(userData);

    return new Promise(function(resolve, reject) {
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
               AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: 'us-east-1:1e1afa1c-07a9-43ad-8092-eaf1836cfa57', 
                    RoleArn: "arn:aws:iam::725929794843:role/Cognito_jacksonarAuth_Role",
                    Logins: {
                        // Change the key below according to the specific region your user pool is in.
                        'cognito-idp.us-east-1.amazonaws.com/us-east-1_YFHZEPdFQ': result.getIdToken().getJwtToken()
                    }
                });
    
                //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
                AWS.config.credentials.refresh((error) => {
                    if (error) {
                        reject("Unable to refresh credentials:" + error);
                    } else {
    
                        console.log('Successfully logged!');
                        resolve(true);
                    }
                });
            },
    
            onFailure: function (err) {
                reject("Unable to authenticate: " + err);
            },
    
            newPasswordRequired: function (userAttributes, requiredAttributes) {
                reject("A new password is required. Too bad I haven't build this capability!");
            }
    
        });
    });
}

export default loginToAws;
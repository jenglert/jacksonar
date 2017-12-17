import React, { Component } from 'react';
import AWS from 'aws-sdk';

import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = { username: '', password: '' };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
    }

    handleChangeUsername(event) {
        this.setState({username: event.target.value});
    }

    handleChangePassword(event) { 
        this.setState({password: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        alert(this.state.username);

        const poolData = {
            UserPoolId: "us-east-1_YFHZEPdFQ",
            ClientId: "4bq6t81ffhhtficadhjiahm9ei"
        };

        var userPool = new CognitoUserPool(poolData);

        var authenticationData = {
            Username: this.state.username,
            Password: this.state.password,
        };

        var userData = {
            Username: this.state.username,
            Pool: userPool
        };

        var authenticationDetails = new AuthenticationDetails(authenticationData);

        var cognitoUser = new CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                console.log('access token + ' + result.getAccessToken().getJwtToken());

                //POTENTIAL: Region needs to be set if not already set previously elsewhere.
                AWS.config.region = 'us-east-1';

                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: 'us-east-1:1e1afa1c-07a9-43ad-8092-eaf1836cfa57', // your identity pool id here
                    RoleArn: "arn:aws:iam::725929794843:role/Cognito_jacksonarAuth_Role",
                    Logins: {
                        // Change the key below according to the specific region your user pool is in.
                        'cognito-idp.us-east-1.amazonaws.com/us-east-1_YFHZEPdFQ': result.getIdToken().getJwtToken()
                    }
                });



                //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
                AWS.config.credentials.refresh((error) => {
                    if (error) {
                        console.error(error);
                    } else {

                        console.log(AWS.config.credentials);
                        // Instantiate aws sdk service objects now that the credentials have been updated.
                        var s3 = new AWS.S3();
                        s3.listObjects({ Bucket: "pi-pics" }, function (err, data) {
                            if (err) {
                                console.error("Cors err:", err);
                                return;
                            }

                            console.log("data", data);
                        });
                        console.log('Successfully logged!');
                    }
                });
            },

            onFailure: function (err) {
                alert(err);
            },

            newPasswordRequired: function (userAttributes, requiredAttributes) {
                alert("A new password is required!");
            }

        });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    email:
                    <input type="text" value={this.state.username} onChange={this.handleChangeUsername} />
                </label>
                <label>
                    password:
                    <input type="text" value={this.state.password} onChange={this.handleChangePassword} />
                </label>

                <input type="submit" value="Login" />
            </form>
        );
    }
}

export default Login;

import React, { Component } from 'react';
import loginToAws from './Aws.js';
import cookie from 'react-cookies'

class LoginState extends Component {

    constructor(props) {
        super(props);
    }

    loginCookieName = 'ak';

    saveAccessKey = (accessKey) => {
        cookie.save(loginCookieName, accessKey, { path: '/' })
    }

    getAccessKey = () => {
        const cookieVal = cookie.load(loginCookieName);

        if (cookieVal != null) {
            // TODO: test the cookie's validity
            return cookieVal;
        }

        return false;
    }

    render() {
        return (
            null
        );
    }
}

export default LoginState;

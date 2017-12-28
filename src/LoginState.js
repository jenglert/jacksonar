import { Component } from 'react';
import cookie from 'react-cookies'

// TODO: clean this up - the class is somewhat disasterful...
class LoginState extends Component {

    static saveAccessKey = (accessKey) => {
        if (accessKey.length < 20) {  // Abject hackery to avoid an invalid cookie from being set due to developer error.
            throw new Error("Invalid access key detected.");
        }
        cookie.save('ak', accessKey, { path: '/' })
    }

    static removeAccessKey = () => {
        cookie.remove('ak');
    }

    static getAccessKey = () => {
        const cookieVal = cookie.load('ak');

        if (cookieVal != null) {
            // TODO: test the cookie's validity
            return cookieVal;
        }

        return null;
    }
}

export default LoginState;

import React, { Component } from 'react';
import { loginToAws, PasswordNeedsResetError, unlockPassword, resetPasswordAuthenticated } from './Aws.js';
import { timeout } from 'promise-timeout';

class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            verificationCode: '',
            isLoading: false,
            errorMsg: false,
            needsVerificationCode: false,
            needsInitialPasswordReset: false,
            userMessage: '',
            newPassword: '',
            cognitoUser: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeUsername = (event) => {
        this.setState({ username: event.target.value });
    }

    handleChangePassword = (event) => {
        this.setState({ password: event.target.value });
    }

    handleVerificationCodeChange = (event) => {
        this.setState({ verificationCode: event.target.value });
    }

    handleNewPassword = (event) => {
        this.setState({ newPassword: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        let that = this;
        this.setState({ isLoading: true, errorMsg: false, userMessage: false });

        if (this.state.needsVerificationCode) {

            timeout(unlockPassword(this.state.username, this.state.password, this.state.verificationCode), 5000)
                .then(function (unlocked) {
                    that.setState({ userMessage: 'Your password has been reset.  Please login.', needsVerificationCode: false, errorMsg: false, isLoading: false });
                    return;
                })
                .catch(function (err) {
                    that.setState({ errorMsg: 'Unable to reset your password.  Try again?  Or talk to support (i.e. Jim). Error: ' + err, isLoading: false });
                    return;
                });

        } else if (this.state.needsInitialPasswordReset) {

            timeout(resetPasswordAuthenticated(this.state.cognitoUser, this.state.newPassword), 5000)
                .then(function (unlocked) {
                    that.setState({
                        userMessage: 'Your password has been reset.  Please login.',
                        needsInitialPasswordReset: false,
                        errorMsg: false,
                        isLoading: false,
                        password: '',
                        newPassword: ''
                    });
                    return;
                })
                .catch(function (err) {
                    that.setState({ errorMsg: 'Unable to reset your password.  Try again?  Or talk to support (i.e. Jim). Error: ' + err, isLoading: false });
                    return;
                });

        } else {

            timeout(loginToAws(this.state.username, this.state.password), 5000)
                .then(function (accessKey) {
                    that.props.onLoggedIn(accessKey);
                }).catch(function (err) {
                    if (err.code && err.code === 'PasswordResetRequiredException') {
                        that.setState({ errorMsg: 'Your password need to be reset.  You should have received a verification code via email', needsVerificationCode: true, isLoading: false });
                        return;
                    }
                    if (err instanceof PasswordNeedsResetError) {
                        that.setState({ errorMsg: 'Your password needs to be reset. Please enter a new password', needsInitialPasswordReset: true, isLoading: false, cognitoUser: err.cognitoUser });
                        return;
                    }
                    that.setState({ errorMsg: err.message, isLoading: false });
                });
        }
    }

    renderLoginButton = () => {
        if (this.state.isLoading) {
            return (<input type="submit" value="" className="loading-submit" disabled="true" />);
        } else {
            return (<input type="submit" value="Login" />);
        }
    }

    renderLogginInClass = () => {
        if (this.state.isLoading) {
            return "submit-element is-loading";
        } else {
            return "submit-element";
        }
    }

    renderValidationError = () => {
        if (this.state.errorMsg) {
            return (<div className="validation-error" >
                {this.state.errorMsg}
            </div>
            );
        } else {
            return null;
        }
    }

    renderValidationMessage = () => {
        if (this.state.userMessage) {
            return (<div className="validation-message" >
                {this.state.userMessage}
            </div>
            );
        } else {
            return null;
        }
    }

    renderPassword = () => {
        if (this.state.needsInitialPasswordReset) {
            return null;
        } else {
            return (<label>
                <div className="label">password:</div>
                <input type="password" value={this.state.password} onChange={this.handleChangePassword} />
            </label>);
        }
    }

    renderVerificationCode = () => {
        if (this.state.needsVerificationCode) {
            return (<label>
                <div className="label">code:</div>
                <input type="text" value={this.state.verificationCode} onChange={this.handleVerificationCodeChange} />
            </label>);
        } else {
            return null;
        }
    }

    renderSetNewPassword = () => {
        if (this.state.needsInitialPasswordReset) {
            return (<label>
                <div className="label">new pass:</div>
                <input type="password" value={this.state.newPassword} onChange={this.handleNewPassword} />
            </label>);
        } else {
            return null;
        }
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} className="login">
                {this.renderValidationError()}
                {this.renderValidationMessage()}
                <div className="input-elements">
                    <label>
                        <div className="label">email:</div>
                        <input type="text" value={this.state.username} onChange={this.handleChangeUsername} />
                    </label>
                    {this.renderPassword()}
                    {this.renderVerificationCode()}
                    {this.renderSetNewPassword()}
                </div>
                <div className={this.renderLogginInClass()}>
                    {this.renderLoginButton()}
                </div>
            </form>
        );
    }
}

export default LoginForm;

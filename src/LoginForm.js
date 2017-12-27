import React, { Component } from 'react';
import { loginToAws, PasswordNeedsResetError, unlockPassword } from './Aws.js';
import { timeout } from 'promise-timeout';

class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            verificationCode: 'here',
            isLoading: false,
            errorMsg: false,
            resetPassword: false,
            userMessage: ''
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

    handleSubmit(event) {
        event.preventDefault();
        let that = this;
        this.setState({ isLoading: true, errorMsg: false, userMessage: false });

        if (this.state.resetPassword) {
            timeout(unlockPassword(this.state.username, this.state.password, this.state.verificationCode), 5000)
                .then(function (unlocked) {
                    that.setState({ userMessage: 'Your password has been reset.  Please login.', resetPassword: false, errorMsg: false, isLoading: false });
                    return;
                })
                .catch(function (err) {
                    that.setState({ errorMsg: 'Unable to reset your password.  Try again?  Or talk to support (i.e. Jim). Error: ' + err, isLoading: false });
                    return;
                });
            return;
        }

        timeout(loginToAws(this.state.username, this.state.password), 5000)
            .then(function (accessKey) {
                that.props.onLoggedIn(accessKey);
            }).catch(function (err) {
                if ((err.code && (err.code === 'PasswordResetRequiredException')) ||
                    err instanceof PasswordNeedsResetError) {
                        that.setState({ errorMsg: 'Your password need to be reset.  You should receive a verification code via email', resetPassword: true, isLoading: false });
                    return;
                }
                that.setState({ errorMsg: err.message, isLoading: false });
            })
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

    renderResetPassword = () => {
        if (this.state.resetPassword) {
            return (<label>
                <div className="label">code:</div>
                <input type="text" value={this.state.verificationCode} onChange={this.handleVerificationCodeChange} />
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
                    <label>
                        <div className="label">password:</div>
                        <input type="password" value={this.state.password} onChange={this.handleChangePassword} />
                    </label>
                    {this.renderResetPassword()}
                </div>
                <div className={this.renderLogginInClass()}>
                    {this.renderLoginButton()}
                </div>
            </form>
        );
    }
}

export default LoginForm;

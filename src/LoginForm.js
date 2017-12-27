import React, { Component } from 'react';
import loginToAws from './Aws.js';
import { timeout } from 'promise-timeout';

class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.state = { username: '', password: '', isLoading: false, errorMsg: false };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeUsername = (event) => {
        this.setState({ username: event.target.value });
    }

    handleChangePassword = (event) => {
        this.setState({ password: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        let thisComp = this;

        this.setState({ isLoading: true, errorMsg: false });

        timeout(loginToAws(this.state.username, this.state.password), 5000)
            .then(function (accessKey) {
                thisComp.props.onLoggedIn(accessKey);
            }).catch(function (err) {
                thisComp.setState({ errorMsg: err.message, isLoading: false });
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

    render() {
        return (
            <form onSubmit={this.handleSubmit} className="login">
                {this.renderValidationError()}
                <div className="input-elements">
                    <label>
                        <div className="label">email:</div>
                        <input type="text" value={this.state.username} onChange={this.handleChangeUsername} />
                    </label>
                    <label>
                        <div className="label">password:</div>
                        <input type="password" value={this.state.password} onChange={this.handleChangePassword} />
                    </label>
                </div>
                <div className={this.renderLogginInClass()}>
                    {this.renderLoginButton()}
                </div>
            </form>
        );
    }
}

export default LoginForm;

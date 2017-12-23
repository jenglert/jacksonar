import React, { Component } from 'react';
import loginToAws from './Aws.js';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = { username: '', password: '', isLoading: false };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeUsername = (event) => {
        this.setState({ username: event.target.value });
    }

    handleChangePassword = (event) => {
        this.setState({ password: event.target.value });
    }

    async handleSubmit(event) {
        this.setState({ isLoading: true });

        event.preventDefault();
        await loginToAws(this.state.username, this.state.password);

        this.props.onLoggedIn();
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

    render() {
        return (
            <form onSubmit={this.handleSubmit} className="login">
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

export default Login;

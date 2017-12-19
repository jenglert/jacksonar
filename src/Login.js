import React, { Component } from 'react';
import loginToAws from './Aws.js';
import listBucket from './S3.js';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = { username: '', password: '' };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
    }

    handleChangeUsername(event) {
        this.setState({ username: event.target.value });
    }

    handleChangePassword(event) {
        this.setState({ password: event.target.value });
    }

    async handleSubmit(event) {
        event.preventDefault();
        await loginToAws(this.state.username, this.state.password);

        listBucket("pi-pics");
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} class="login">
                <div class="input-elements">
                    <label>
                        <div class="label">email:</div>
                        <input type="text" value={this.state.username} onChange={this.handleChangeUsername} />
                    </label>
                    <label>
                        <div class="label">password:</div>
                        <input type="password" value={this.state.password} onChange={this.handleChangePassword} />
                    </label>
                </div>
                <div class="submit-element">
                    <input type="submit" value="Login" />
                </div>
            </form>
        );
    }
}

export default Login;

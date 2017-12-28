import React, { Component } from 'react';
import './styles/App.css';
import LoginForm from './LoginForm.js';
import Footer from './Footer.js';
import Images from './Images.js';
import AWS from 'aws-sdk';
import LoginState from './LoginState.js';
import { setAwsCredentials, refreshAccessKey } from './Aws.js';

// When a cookie is present, we cannot be sure it is valid until we refresh the access token
// to validate.
const LOADING_COOKIE = 0;
const LOGGED_IN = 1;
const LOGGED_OUT = 2;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      authState: LOGGED_OUT
    }

    // Might as well set the global var here...
    AWS.config.region = 'us-east-1';
    AWS.config.update({ maxRetries: 2 });

    const cookieAccessKey = LoginState.getAccessKey();
    let that = this;
    if (cookieAccessKey != null) {
      this.state.authState = LOADING_COOKIE;

      setAwsCredentials(cookieAccessKey);
      refreshAccessKey().then(function (ok) {
        console.log("Access key validated: " + ok);
        that.setState({ authState: LOGGED_IN });
      }).catch(function (err) {
        console.log("Access key is not valid. Removing token.  Details: " + err);
        LoginState.removeAccessKey();
        that.setState({ authState: LOGGED_OUT });
      });
    }
  }

  onLoggedIn = (accessKey) => {
    LoginState.saveAccessKey(accessKey);
    this.setState({ authState: LOGGED_IN });
  }

  renderLoginOrContent = () => {
    if (this.state.authState === LOADING_COOKIE) {
      return (<div>Loading your cookie...</div>);
    } else if (this.state.authState === LOGGED_IN ) {
      return <Images />
    } else if (this.state.authState === LOGGED_OUT) {
      return <LoginForm onLoggedIn={this.onLoggedIn} />
    } else {
      return (<div>Something went wrong</div>);
    }
  }

  render() {
    return (
      <div>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">his name is J.R.</h1>
          </header>

          {this.renderLoginOrContent()}
        </div>
        <Footer />
      </div>
    );
  }


}

export default App;

import React, { Component } from 'react';
import './styles/App.css';
import LoginForm from './LoginForm.js';
import Footer from './Footer.js';
import Images from './Images.js';
import AWS from 'aws-sdk';
import LoginState from './LoginState.js';
import { setAwsCredentials } from './Aws.js';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    }

    // Might as well set the global var here...
    AWS.config.region = 'us-east-1';
  }

  onLoggedIn = (accessKey) => {
    this.setState({ loggedIn: true });
    LoginState.saveAccessKey(accessKey);
  }

  renderLoginOrContent = () => {
    const cookieAccessKey = LoginState.getAccessKey();
    if (cookieAccessKey != null) {
      setAwsCredentials(cookieAccessKey);
    }

    if (this.state.loggedIn || cookieAccessKey != null) {
      return <Images />
    } else {
      return <LoginForm onLoggedIn={this.onLoggedIn} />
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

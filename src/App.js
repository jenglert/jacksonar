import React, { Component } from 'react';
import './styles/App.css';
import LoginForm from './LoginForm.js';
import Footer from './Footer.js';
import Images from './Images.js';
import AWS from 'aws-sdk';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    }

    // Might as well set the global var here...
    AWS.config.region = 'us-east-1';
  }

  onLoggedIn = () => {
    this.setState({ loggedIn: true });
  }

  renderLoginOrContent = () => {
    if (this.state.loggedIn) {
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

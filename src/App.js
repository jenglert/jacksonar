import React, { Component } from 'react';
import './styles/App.css';
import Login from './Login.js';
import Footer from './Footer.js';
import Images from './Images.js';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    }
  }

  onLoggedIn = () => {
    this.setState({ ...this.state, loggedIn: true });
  }

  renderLoginOrContent = () => {
    if (this.state.loggedIn) {
      return <Images />
    } else {
      return <Login onLoggedIn={this.onLoggedIn} />
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

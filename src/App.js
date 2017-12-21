import React, { Component } from 'react';
import logo from './logo.svg';
import './styles/App.css';
import Login from './Login.js';
import Footer from './Footer.js';

class App extends Component {
  render() {
    return (
      <div>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">his name is J.R.</h1>
          </header>
          <Login />
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;

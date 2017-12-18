import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './Login.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">his name is J.R.</h1>
        </header>
        <Login />
      </div>
    );
  }
}

export default App;

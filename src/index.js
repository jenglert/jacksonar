import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

const AppWithRouter = withRouter(App);

ReactDOM.render((<Router ><AppWithRouter /></Router>), document.getElementById('root'));
registerServiceWorker();

import React, { Component } from 'react';
import './styles/App.css';
import LoginForm from './LoginForm.js';
import Footer from './Footer.js';
import Images from './Images.js';
import AWS from 'aws-sdk';
import LoginState from './LoginState.js';
import { setAwsCredentials, refreshAccessKey } from './Aws.js';
import { Route, Switch } from 'react-router-dom';
import Redirect from 'react-router-dom/Redirect';
import ImageDetail from './ImageDetail';


const IMAGES_PATH = '/images';
const LOGGED_OUT_PATH = '/login';
const SOMETHING_WENT_WRONG_PATH = '/something-went-wrong';
const IMAGE_DETAIL_PATH = '/image-detail/:filename';

class App extends Component {

  constructor(props) {
    super(props);

    // Might as well set the global var here...
    AWS.config.region = 'us-east-1';
    AWS.config.update({ maxRetries: 2 });

    this.state = {
      isAuthed: false,
    };
  }

  componentDidMount = () => {

    const history = this.props.history;
    const that = this;

    // Handle the login cookies
    const cookieAccessKey = LoginState.getAccessKey();
    if (cookieAccessKey != null) {

      setAwsCredentials(cookieAccessKey);
      refreshAccessKey().then(function (ok) {
        console.log("Access key validated: " + ok);
        that.setState({ isAuthed: true });
        history.push(IMAGES_PATH);
      }).catch(function (err) {
        console.log("Access key is not valid. Removing token.  Details: " + err);
        LoginState.removeAccessKey();
        history.push(LOGGED_OUT_PATH);
      })
    } else {
      // Handle slash routes
      if (this.props.location.pathname === '/') {
        history.push(IMAGES_PATH);
      }
    }
  }

  onLoggedIn = (accessKey) => {
    LoginState.saveAccessKey(accessKey);
    this.setState({ isAuthed: true });
  }

  SomethingWentWrong = () => {
    return (<div>Something went wrong!</div>);
  }

  PrivateRoute = ({ component: Component, ...rest }) => {
    return (<Route {...rest} render={props => {
      if (!this.state.isAuthed) {
        return <Redirect to={{
          pathname: LOGGED_OUT_PATH
        }} />
      } else {
        return <Component {...props} />
      }
    }} />);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">his name is J.R.</h1>
        </header>

        <Route path={LOGGED_OUT_PATH} render={({ history }) => {
          return <LoginForm onLoggedIn={(accessKey) => {
            this.onLoggedIn(accessKey);
            history.push(IMAGES_PATH);
          }} />
        }} />
        <Route path={SOMETHING_WENT_WRONG_PATH} component={this.SomethingWentWrong} />
        <this.PrivateRoute path={IMAGES_PATH} component={Images} />
        <this.PrivateRoute path={IMAGE_DETAIL_PATH} component={ImageDetail} />
        <Route display={() => "No match"} />
        <Footer />
      </div>
    );
  }
}

export default App;

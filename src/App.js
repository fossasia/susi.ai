import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Blog from './components/Blog/Blog.react';
import ChatApp from './components/ChatApp/ChatApp.react';
import Contact from './components/Contact/Contact.react';
import Devices from './components/Devices/Devices.react';
import Logout from './components/Auth/Logout.react';
import NotFound from './components/NotFound/NotFound.react';
import Overview from './components/Overview/Overview.react';
import Settings from './components/ChatApp/Settings/Settings.react';
import Support from './components/Support/Support.react';
import Team from './components/Team/Team.react';
import Terms from './components/Terms/Terms.react';
import Privacy from './components/Privacy/Privacy.react';
import Login from './components/Auth/Login/Login.react';
import SignUp from './components/Auth/SignUp/SignUp.react';
import ForgotPassword from './components/Auth/ForgotPassword/ForgotPassword.react';

const muiTheme = getMuiTheme({
  toggle: {
    thumbOnColor: '#5ab1fc',
    trackOnColor: '#4285f4',
  },
});

class App extends Component {
  static propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    closeVideo: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      video: false,
      openLogin: false,
      openSignUp: false,
      openForgotPassword: false,
    };
  }

  closeVideo = () =>
    this.setState({
      video: false,
    });

  onRequestOpenLogin = () => {
    this.setState({
      openLogin: true,
      openSignUp: false,
      openForgotPassword: false,
    });
  };

  onRequestOpenSignUp = () => {
    this.setState({
      openSignUp: true,
      openLogin: false,
      openForgotPassword: false,
    });
  };

  onRequestOpenForgotPassword = () => {
    this.setState({
      openLogin: false,
      openSignUp: false,
      openForgotPassword: true,
    });
  };

  onRequestClose = () => {
    this.setState({
      openLogin: false,
      openSignUp: false,
      openForgotPassword: false,
    });
  };

  render() {
    const { openLogin, openSignUp, openForgotPassword } = this.state;

    if (location.pathname !== '/') {
      document.body.className = 'white-body';
    }

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Login
            openLogin={openLogin}
            onRequestOpenForgotPassword={this.onRequestOpenForgotPassword}
            onRequestOpenSignUp={this.onRequestOpenSignUp}
            onRequestClose={this.onRequestClose}
          />
          <SignUp
            openSignUp={openSignUp}
            onRequestClose={this.onRequestClose}
            onRequestOpenLogin={this.onRequestOpenLogin}
          />
          <ForgotPassword
            openForgotPassword={openForgotPassword}
            onRequestClose={this.onRequestClose}
          />
          <Switch>
            <Route
              exact
              path="/"
              render={routeProps => (
                <ChatApp
                  {...routeProps}
                  onRequestOpenLogin={this.onRequestOpenLogin}
                />
              )}
            />
            <Route exact path="/overview" component={Overview} />
            <Route exact path="/devices" component={Devices} />
            <Route exact path="/team" component={Team} />
            <Route exact path="/blog" component={Blog} />
            <Route exact path="/contact" component={Contact} />
            <Route exact path="/support" component={Support} />
            <Route exact path="/terms" component={Terms} />
            <Route exact path="/privacy" component={Privacy} />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/settings" component={Settings} />
            <Route exact path="*" component={NotFound} />
          </Switch>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;

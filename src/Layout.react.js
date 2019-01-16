import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
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
import ProtectedRoute from './components/ProtectedRoute';
import StaticAppBar from './components/StaticAppBar/StaticAppBar.react';

const Layout = props => {
  const { onRequestOpenLogin, closeSnackBar, openSnackBar } = props;

  return (
    <div>
      <StaticAppBar
        onRequestOpenLogin={onRequestOpenLogin}
        closeSnackBar={closeSnackBar}
        openSnackBar={openSnackBar}
      />
      <Switch>
        <Route
          exact
          path="/"
          render={routeProps => (
            <ChatApp
              {...routeProps}
              onRequestOpenLogin={onRequestOpenLogin}
              closeSnackBar={closeSnackBar}
              openSnackBar={openSnackBar}
            />
          )}
        />
        <Route
          exact
          path="/overview"
          render={routeProps => <Overview {...routeProps} />}
        />
        <Route
          exact
          path="/devices"
          render={routeProps => <Devices {...routeProps} />}
        />
        <Route
          exact
          path="/team"
          render={routeProps => <Team {...routeProps} />}
        />
        <Route
          exact
          path="/blog"
          render={routeProps => <Blog {...routeProps} />}
        />
        <Route
          exact
          path="/contact"
          render={routeProps => <Contact {...routeProps} />}
        />
        <Route
          exact
          path="/support"
          render={routeProps => <Support {...routeProps} />}
        />
        <Route
          exact
          path="/terms"
          render={routeProps => <Terms {...routeProps} />}
        />
        <Route
          exact
          path="/privacy"
          render={routeProps => <Privacy {...routeProps} />}
        />
        <Route
          exact
          path="/logout"
          render={routeProps => (
            <Logout {...routeProps} openSnackBar={openSnackBar} />
          )}
        />
        <ProtectedRoute exact path="/settings" component={Settings} />
        <Route exact path="/*:path(error-404|)" component={NotFound} />
      </Switch>
    </div>
  );
};

Layout.propTypes = {
  openSnackBar: PropTypes.func,
  closeSnackBar: PropTypes.func,
  onRequestOpenLogin: PropTypes.func,
};

export default Layout;

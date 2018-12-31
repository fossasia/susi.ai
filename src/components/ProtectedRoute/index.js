import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = props => {
  const { accessToken, location, component: Component, ...rest } = props;
  return (
    <Route
      {...rest}
      render={routeProps =>
        accessToken ? (
          <Component {...routeProps} />
        ) : (
          <Redirect
            to={{
              pathname: '/error-404',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

ProtectedRoute.propTypes = {
  history: PropTypes.object,
  component: PropTypes.React,
  location: PropTypes.object,
  accessToken: PropTypes.string,
};

function mapStateToProps(store) {
  const { accessToken } = store.app;
  return {
    accessToken,
  };
}

export default connect(
  mapStateToProps,
  null,
)(ProtectedRoute);

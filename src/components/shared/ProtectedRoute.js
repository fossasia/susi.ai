import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import NotFound from '../NotFound/NotFound.react';

const ProtectedRoute = props => {
  const { accessToken, isAdmin, component: Component, ...restProps } = props;
  return (
    <Route
      {...restProps}
      render={routeProps =>
        accessToken ? (
          <Component {...routeProps} />
        ) : (
          <NotFound renderLogin={!isAdmin} />
        )
      }
    />
  );
};

ProtectedRoute.propTypes = {
  history: PropTypes.object,
  component: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
    PropTypes.string,
  ]),
  location: PropTypes.object,
  accessToken: PropTypes.string,
  isAdmin: PropTypes.bool,
};

function mapStateToProps(store) {
  const { accessToken, isAdmin } = store.app;
  return {
    accessToken,
    isAdmin,
  };
}

export default connect(
  mapStateToProps,
  null,
)(ProtectedRoute);

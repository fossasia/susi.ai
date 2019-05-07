import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import NotFound from '../NotFound/NotFound.react';

const ProtectedRoute = props => {
  const { accessToken, component: Component, ...restProps } = props;
  return (
    <Route
      {...restProps}
      render={routeProps =>
        accessToken ? <Component {...routeProps} /> : <NotFound />
      }
    />
  );
};

ProtectedRoute.propTypes = {
  history: PropTypes.object,
  component: PropTypes.func,
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

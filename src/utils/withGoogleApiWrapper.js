import React from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import CircularLoader from '../components/shared/CircularLoader';

const LoadingContainer = props => <CircularLoader height={27} />;

const withGoogleApiWrapper = WrappedComponent => {
  return GoogleApiWrapper(props => ({
    LoadingContainer,
    apiKey: props.mapKey,
  }))(WrappedComponent);
};

export default withGoogleApiWrapper;

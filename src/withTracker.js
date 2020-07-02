import React, { Component } from 'react';
import GoogleAnalytics from 'react-ga';
import PropTypes from 'prop-types';

const withTracker = (WrappedComponent, options = {}) => {
  const trackPage = (page) => {
    GoogleAnalytics.set({
      page,
      ...options,
    });
    GoogleAnalytics.pageview(page);
  };

  // eslint-disable-next-line
  const HOC = class extends Component {
    componentDidMount() {
      window.scrollTo(0, 0);
      // eslint-disable-next-line
      const page = this.props.location.pathname + this.props.location.search;
      trackPage(page);
    }

    componentDidUpdate(prevProps) {
      const currentPage =
        prevProps.location.pathname + prevProps.location.search;
      const nextPage =
        this.props.location.pathname + this.props.location.search;

      if (currentPage !== nextPage) {
        trackPage(nextPage);
      }
      if (this.props.location.pathname !== prevProps.location.pathname) {
        window.scrollTo(0, 0);
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  HOC.propTypes = {
    location: PropTypes.object,
  };

  return HOC;
};

export default withTracker;

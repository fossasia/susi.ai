import React from 'react';
import Cookies from 'universal-cookie';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import Close from '@material-ui/icons/Close';
import appActions from '../../redux/actions/app';

const cookies = new Cookies();

const styles = {
  closingStyle: {
    position: 'absolute',
    zIndex: 1200,
    fill: '#444',
    width: '26px',
    height: '26px',
    right: '10px',
    top: '10px',
    cursor: 'pointer',
  },
};

const Tour = props => {
  const { actions } = props;
  const handleCloseTour = () => {
    cookies.set('visited', true, { path: '/' });
    actions.setVisited();
  };

  return (
    <React.Fragment>
      <DialogTitle>Welcome to SUSI.AI Web Chat</DialogTitle>
      <iframe
        width="99%"
        height="315"
        src="https://www.youtube.com/embed/9T3iMoAUKYA"
        frameBorder="0"
        scrolling="no"
      />
      <Close style={styles.closingStyle} onClick={() => handleCloseTour()} />
    </React.Fragment>
  );
};

Tour.propTypes = {
  actions: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(appActions, dispatch),
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(Tour);

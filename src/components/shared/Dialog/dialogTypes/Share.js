import React from 'react';
import CloseButton from '../../CloseButton';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import uiActions from '../../../../redux/actions/ui';
import ShareOnSocialMedia from '../../../Settings/ShareOnSocialMedia';

const Share = ({ actions, message }) => {
  const title = message;
  return (
    <React.Fragment>
      <ShareOnSocialMedia title={title} width={100} />
      <CloseButton onClick={actions.closeModal} />
    </React.Fragment>
  );
};

Share.propTypes = {
  actions: PropTypes.object,
  message: PropTypes.string,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch),
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(Share);

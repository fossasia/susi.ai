import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import uiActions from '../../../redux/actions/ui';
import _ShareIcon from '@material-ui/icons/Share';
import styled from 'styled-components';

const ShareIcon = styled(_ShareIcon)`
  height: 0.813rem;
  cursor: pointer;
`;

const ShareButton = ({ message, color, actions }) => {
  const shareMessageSUSI = !message.text ? '' : message.text.trim();
  return (
    <ShareIcon
      color={color}
      onClick={() =>
        actions.openModal({
          modalType: 'share',
          message: `${shareMessageSUSI} #SUSI.AI`,
        })
      }
    />
  );
};

ShareButton.propTypes = {
  message: PropTypes.object,
  color: PropTypes.string,
  actions: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch),
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(ShareButton);

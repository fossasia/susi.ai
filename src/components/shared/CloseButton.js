import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';

const IconStyle = {
  position: 'absolute',
  fill: '#444',
  right: '1px',
  top: '1px',
  cursor: 'pointer',
};

const CloseButton = ({ onClick }) => (
  <IconButton style={IconStyle} onClick={onClick}>
    <CloseIcon />
  </IconButton>
);

CloseButton.propTypes = {
  onClick: PropTypes.func,
};

export default CloseButton;

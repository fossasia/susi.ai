import React from 'react';
import PropTypes from 'prop-types';
import ShareIcon from '@material-ui/icons/Share';

const buttonStyle = {
  height: 13,
  cursor: 'pointer',
};

const ShareButton = ({ message, color }) => {
  const shareMessageSUSI = !message.text ? '' : message.text.trim();
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareMessageSUSI,
  )} ${encodeURIComponent(' #SUSI.AI')}`;
  return (
    <ShareIcon
      style={buttonStyle}
      color={color}
      onClick={() => window.open(twitterShareUrl, '_blank')}
    />
  );
};

ShareButton.propTypes = {
  message: PropTypes.object,
  color: PropTypes.string,
};

export default ShareButton;

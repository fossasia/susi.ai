import FloatingActionButton from 'material-ui/FloatingActionButton';
import { scrollToTopAnimation } from '../../utils/animateScroll';
import React from 'react';

const toTopStyle = {
  right: 80,
  bottom: 80,
  position: 'fixed',
  zIndex: '11',
};

const ToTopButton = () => {
  return (
    <FloatingActionButton
      style={toTopStyle}
      backgroundColor={'#4285f4'}
      onClick={() => {
        scrollToTopAnimation();
      }}
    >
      <span className="fa fa-chevron-up" />
    </FloatingActionButton>
  );
};

export default ToTopButton;

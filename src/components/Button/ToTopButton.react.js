import Fab from '@material-ui/core/Fab';
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
    <Fab
      style={toTopStyle}
      onClick={() => {
        scrollToTopAnimation();
      }}
      color="primary"
    >
      <span className="fa fa-chevron-up" />
    </Fab>
  );
};

export default ToTopButton;

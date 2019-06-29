import _Fab from '@material-ui/core/Fab';
import { scrollToTopAnimation } from '../../utils/animateScroll';
import React from 'react';
import styled from 'styled-components';

const Fab = styled(_Fab)`
  right: 5rem;
  bottom: 5rem;
  position: fixed;
  z-index: 11;

  @media (max-width: 480px) {
    right: 0.5rem;
  }
`;

const ToTopButton = () => {
  return (
    <Fab
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

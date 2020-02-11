import React from 'react';
import Fab from '@material-ui/core/Fab';
import { animateScroll as scroll } from 'react-scroll';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import styled from 'styled-components';
import Fade from '@material-ui/core/Fade';

const ScrollTopFab = styled(Fab)`
  position: fixed;
  top: ${props => props.height - 95 + 'px'};
  right: ${props => (props.width < 1100 ? '70px' : '100px')};
  margin: 15px;
  z-index: 1000;
`;

class ScrollTopButton extends React.Component {
  state = {
    height: window.innerHeight,
    width: window.innerWidth,
    shouldDisplayButton: false,
  };

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    window.addEventListener('scroll', this.updateButtonStatus);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
    window.removeEventListener('scroll', this.updateStatus);
  }

  scrollToTop = () => {
    scroll.scrollToTop();
  };

  updateButtonStatus = () => {
    if (window.pageYOffset > 500) {
      this.setState({
        shouldDisplayButton: true,
      });
    } else {
      this.setState({
        shouldDisplayButton: false,
      });
    }
  };

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  render() {
    const { height, width, shouldDisplayButton } = this.state;
    return (
      <Fade in={shouldDisplayButton}>
        <ScrollTopFab
          color="primary"
          aria-label="scroll top"
          onClick={this.scrollToTop}
          height={height}
          width={width}
        >
          <KeyboardArrowUpIcon />
        </ScrollTopFab>
      </Fade>
    );
  }
}

export default ScrollTopButton;

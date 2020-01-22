import React from 'react';
import _Button from '@material-ui/core/Button';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';
import Translate from '../Translate/Translate.react';
import PropTypes from 'prop-types';

const StyledButton = styled(_Button)`
  width: 10rem;
`;

const Button = props => {
  const { buttonText, isLoading, handleClick, ...otherProps } = props;
  return (
    <StyledButton onClick={handleClick} {...otherProps}>
      {isLoading ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        <Translate text={buttonText} />
      )}
    </StyledButton>
  );
};

Button.propTypes = {
  buttonText: PropTypes.string,
  handleClick: PropTypes.func,
  isLoading: PropTypes.bool,
};

Button.defaultProps = {
  isLoading: false,
};

export default Button;

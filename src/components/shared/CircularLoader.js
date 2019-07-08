import React from 'react';
import styled, { css } from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  ${props =>
    props.height !== 'auto'
      ? css`
          height: ${props => props.height + 'rem'};
          @media (max-width: 512px) {
            height: ${props =>
              props.height > 20
                ? props.height - 15 + 'rem'
                : props.height + 'rem'};
          }
        `
      : css`
          height: 100vh;
        `}
`;

const CircularLoader = ({ height = 'auto', color = 'primary', size = 64 }) => {
  return (
    <Container height={height}>
      <CircularProgress color={color} size={size} />
    </Container>
  );
};

CircularLoader.propTypes = {
  height: PropTypes.number,
  size: PropTypes.number,
  color: PropTypes.string,
};

export default CircularLoader;

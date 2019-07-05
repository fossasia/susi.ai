import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import _Avatar from '@material-ui/core/Avatar';

/* Utils */
import initials from 'initials';

const defaultColors = [
  '#2ecc71', // emerald
  '#3498db', // peter river
  '#8e44ad', // wisteria
  '#e67e22', // carrot
  '#e74c3c', // alizarin
  '#1abc9c', // turquoise
  '#2c3e50', // midnight blue
];

const Avatar = styled(_Avatar)`
  margin-right: 10px;
  background-color: ${props => props.backgroundColor};
  width: ${props => props.size + 'px'};
  height: ${props => props.size + 'px'};
  ${props =>
    props.src ||
    (props.srcSet &&
      css`
        src: ${props => props.src};
        srcset: ${props => props.srcSet};
        color: '#fff';
      `)}
`;

function sumChars(str) {
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return sum;
}

const CircleImage = props => {
  const {
    src,
    srcset,
    name,
    color,
    colors,
    borderRadius = '100%',
    size,
  } = props;

  let backgroundColor = '';
  let innerElement = null;
  if (!src && !srcset) {
    if (color) {
      backgroundColor = color;
    } else {
      // Pick a deterministic color from the list
      const i = sumChars(name) % colors.length;
      backgroundColor = colors[i];
    }
    innerElement = initials(name);
  }

  return (
    <Avatar
      backgroundColor={backgroundColor}
      size={size}
      borderRadius={borderRadius}
      src={src}
      srcSet={srcset}
    >
      {innerElement}
    </Avatar>
  );
};

CircleImage.propTypes = {
  borderRadius: PropTypes.string,
  src: PropTypes.string,
  srcset: PropTypes.string,
  name: PropTypes.string.isRequired,
  color: PropTypes.string,
  colors: PropTypes.array,
  size: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
};

CircleImage.defaultProps = {
  colors: defaultColors,
};

export default CircleImage;

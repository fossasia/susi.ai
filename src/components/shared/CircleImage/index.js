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
  width: ${props => props.size + 'px'};
  height: ${props => props.size + 'px'};
  align-items: center;
  display: flex;
  ${props =>
    props.src ||
    (props.srcSet &&
      css`
        src: ${props => props.src};
        srcset: ${props => props.srcSet};
        color: '#fff';
      `)}
`;

const CircleImage = props => {
  const { src, srcset, name, size } = props;

  let innerElement = null;
  if (!src && !srcset) {
    innerElement = initials(name);
  }

  return (
    <Avatar size={size} src={src} srcSet={srcset}>
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

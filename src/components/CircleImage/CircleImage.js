import React from 'react';
import PropTypes from 'prop-types';

/* Utils */
import initials from 'initials';
import addPx from 'add-px';
import contrast from 'contrast';
import './CircleImage.css';

const defaultColors = [
  '#2ecc71', // emerald
  '#3498db', // peter river
  '#8e44ad', // wisteria
  '#e67e22', // carrot
  '#e74c3c', // alizarin
  '#1abc9c', // turquoise
  '#2c3e50', // midnight blue
];

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
    style,
    borderRadius = '100%',
    className,
  } = props;

  const size = addPx(props.size);

  const styles = {
    imageStyle: {
      display: 'block',
      borderRadius,
    },
    innerStyle: {
      lineHeight: size,
      textAlign: 'center',
      overflow: 'initial',
      marginRight: 10,
      borderRadius,
    },
  };

  let { imageStyle, innerStyle } = styles;
  const nameInitials = initials(name);
  let innerElement,
    classes = [className, 'CircleImage'];

  if (size) {
    imageStyle.width = innerStyle.width = innerStyle.maxWidth = size;
    imageStyle.height = innerStyle.height = innerStyle.maxHeight = size;
  }

  if (src || srcset) {
    innerElement = (
      <img
        className="CircleImage--img"
        style={imageStyle}
        src={src}
        srcSet={srcset}
        alt={name}
      />
    );
  } else {
    let backgroundColor = '';

    if (color) {
      backgroundColor = color;
    } else {
      // Pick a deterministic color from the list
      const i = sumChars(name) % colors.length;
      backgroundColor = colors[i];
    }

    innerStyle.backgroundColor = backgroundColor;
    classes.push(`CircleImage--${contrast(innerStyle.backgroundColor)}`);
    innerElement = nameInitials;
  }

  return (
    <div aria-label={name} className={classes.join(' ')} style={style}>
      <div className="CircleImage--inner" style={innerStyle}>
        {innerElement}
      </div>
    </div>
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

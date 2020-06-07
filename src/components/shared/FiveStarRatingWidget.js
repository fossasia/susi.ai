import React from 'react';
import Ratings from 'react-ratings-declarative';
import PropTypes from 'prop-types';

const FiveStarRatingWidget = (props) => {
  const { rating, ...otherProps } = props;
  return (
    <Ratings rating={rating} {...otherProps}>
      <Ratings.Widget />
      <Ratings.Widget />
      <Ratings.Widget />
      <Ratings.Widget />
      <Ratings.Widget />
    </Ratings>
  );
};

FiveStarRatingWidget.propTypes = {
  widgetRatedColors: PropTypes.string,
  widgetDimensions: PropTypes.string,
  widgetSpacings: PropTypes.string,
  rating: PropTypes.number,
};

FiveStarRatingWidget.defaultProps = {
  widgetRatedColors: '#ffbb28',
  widgetDimensions: '20px',
  widgetSpacings: '0px',
};

export default FiveStarRatingWidget;

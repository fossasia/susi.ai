import React from 'react';
import PropTypes from 'prop-types';
import Ratings from 'react-ratings-declarative';
import styles from '../BrowseSkill/SkillStyle';

const SkillRating = props => {
  return (
    <div
      style={styles.singleRating}
      onClick={() => props.handleRatingRefine(props.rating)}
    >
      <Ratings
        rating={props.rating}
        widgetRatedColors="#ffbb28"
        widgetDimensions="20px"
        widgetSpacings="0px"
      >
        <Ratings.Widget />
        <Ratings.Widget />
        <Ratings.Widget />
        <Ratings.Widget />
        <Ratings.Widget />
      </Ratings>
      <div
        style={styles.ratingLabel}
        className={props.ratingRefine === props.rating ? 'bold' : ''}
      >
        & Up
      </div>
    </div>
  );
};

SkillRating.propTypes = {
  handleRatingRefine: PropTypes.func,
  rating: PropTypes.number,
  ratingRefine: PropTypes.number,
};

export default SkillRating;

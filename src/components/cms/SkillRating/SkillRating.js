import React from 'react';
import PropTypes from 'prop-types';
import Ratings from 'react-ratings-declarative';
import styled from 'styled-components';

const RatingLabel = styled.div`
  font-size: 14px;
  margin-left: 4px;
  font-weight: ${props => (props.bold ? 'bold' : 'normal')};
`;

const SingleRating = styled.div`
  display: flex;
  cursor: pointer;
`;

const SkillRating = props => {
  return (
    <SingleRating onClick={() => props.handleRatingRefine(props.rating)}>
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
      <RatingLabel bold={props.ratingRefine === props.rating}>& Up</RatingLabel>
    </SingleRating>
  );
};

SkillRating.propTypes = {
  handleRatingRefine: PropTypes.func,
  rating: PropTypes.number,
  ratingRefine: PropTypes.number,
};

export default SkillRating;

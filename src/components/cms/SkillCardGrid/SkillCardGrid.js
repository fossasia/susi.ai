/* eslint-disable max-len */
import React, { Component } from 'react';
import Ratings from 'react-ratings-declarative';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SkillRatingPopover from '../SkillRating/SkillRatingPopover.js';
import NavigationArrowDropDown from '@material-ui/icons/ArrowDropDown';
import CircleImage from '../../CircleImage/CircleImage';
import { urls } from '../../../utils';
import styled from 'styled-components';

import { ImageContainer, StaffPickImage } from '../SkillsStyle';

import {
  TitleContainer,
  Card,
  Image,
  Example,
  TotalRating,
  ReactTooltip,
} from '../SkillCardStyle';

const Author = styled.div`
  text-align: left;
  margin-bottom: 4px;
  font-size: 0.75rem;
  color: #555555;
`;

const GridList = styled.div`
  flex-wrap: wrap;
  flex-direction: row;
  text-align: center;
`;

class SkillCardGrid extends Component {
  loadSkillCards = () => {
    let cards = [];
    Object.keys(this.props.skills).forEach(el => {
      let skill = this.props.skills[el];
      const dataId = `index-${el}`;
      const skillPathname = `/skills/${skill.group}/${skill.skillTag}/${skill.language}`;
      const skillFeedbackPathname = `${skillPathname}/feedbacks`;
      let skillName,
        examples,
        image,
        staffPick = false;
      let averageRating = 0,
        totalRating = 0,
        authorName = 'Author';
      let stars = {
        oneStar: 0,
        twoStar: 0,
        threeStar: 0,
        fourStar: 0,
        fiveStar: 0,
        avgStar: 0,
        totalStar: 0,
      };
      if (skill.skillName) {
        skillName = skill.skillName;
        skillName = skillName.charAt(0).toUpperCase() + skillName.slice(1);
      } else {
        skillName = 'Name not available';
      }
      if (skill.image) {
        image = `${urls.API_URL}/cms/getImage.png?model=${skill.model}&language=${skill.language}&group=${skill.group}&image=${skill.image}`;
      } else {
        image = '';
      }
      if (
        skill.examples &&
        skill.examples.length > 0 &&
        skill.examples[0] !==
          '<The question that should be shown in public skill displays>'
      ) {
        examples = skill.examples[0];
      } else {
        examples = 'Test this example of skill';
      }
      if (skill.skillRating) {
        averageRating = parseFloat(skill.skillRating.stars.avgStar);
        totalRating = parseInt(skill.skillRating.stars.totalStar, 10);
        stars = skill.skillRating.stars;
      }
      if (skill.staffPick) {
        staffPick = true;
      }
      if (skill.author && skill.author !== '<author_name>') {
        authorName = skill.author;
      }
      cards.push(
        <Card grid={true} key={el}>
          <Link
            key={el}
            to={{
              pathname: skillPathname,
            }}
          >
            <ImageContainer key={el}>
              {image ? (
                <Image alt={skillName} src={image} />
              ) : (
                <CircleImage name={el} size="48" />
              )}
              {examples ? <Example>&quot;{examples}&quot;</Example> : null}
            </ImageContainer>
            <TitleContainer>
              <span>{skillName}</span>
              {staffPick && <StaffPickImage />}
            </TitleContainer>
          </Link>
          <Author>
            <p>{authorName}</p>
          </Author>
          <div style={{ positive: 'relative', float: 'left' }}>
            <div data-tip="custom" data-for={dataId}>
              <Link
                key={el}
                to={{
                  pathname: skillFeedbackPathname,
                }}
              >
                <Ratings
                  style={{ display: 'flex' }}
                  rating={averageRating || 0}
                  widgetRatedColors="#ffbb28"
                  widgetDimensions="20px"
                  widgetSpacings="0px"
                >
                  <Ratings.Widget />
                  <Ratings.Widget />
                  <Ratings.Widget />
                  <ReactTooltip
                    id={dataId}
                    type={'light'}
                    place="bottom"
                    effect="solid"
                    delayHide={200}
                    border="true"
                  >
                    <Link to={{ pathname: skillFeedbackPathname }}>
                      <SkillRatingPopover stars={stars} />
                    </Link>
                  </ReactTooltip>
                  <Ratings.Widget />
                  <Ratings.Widget />
                </Ratings>
                <NavigationArrowDropDown
                  style={{
                    fill: '#595959',
                    marginBottom: '-7px',
                    cursor: 'pointer',
                  }}
                />
                <TotalRating>{totalRating || 0}</TotalRating>
              </Link>
            </div>
          </div>
        </Card>,
      );
    });
    return cards;
  };

  render() {
    return (
      <div
        style={{
          marginTop: '20px',
          marginBottom: '40px',
          textAlign: 'center',
          fontSize: '0.1px',
          width: '100%',
        }}
      >
        <GridList>{this.loadSkillCards()}</GridList>
      </div>
    );
  }
}

SkillCardGrid.propTypes = {
  skills: PropTypes.array,
};

function mapStateToProps(store) {
  return {
    skills: store.skills.listSkills,
  };
}

export default connect(
  mapStateToProps,
  null,
)(SkillCardGrid);

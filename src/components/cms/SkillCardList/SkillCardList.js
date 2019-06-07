/* eslint-disable max-len */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Ratings from 'react-ratings-declarative';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import CircleImage from '../../CircleImage/CircleImage';
import SkillRatingPopover from '../SkillRating/SkillRatingPopover.js';
import NavigationArrowDropDown from '@material-ui/icons/ArrowDropDown';
import styles from './SkillCardStyle';
import StaffPick from '../../../images/staff_pick.png';
import { urls, testExample } from '../../../utils';
import ReactTooltip from 'react-tooltip';
import '../SkillRating/ReviewPopoverStyle.css';

function createListCard(
  el,
  skillName,
  authorName,
  description,
  image,
  skill,
  examples,
  totalRating,
  averageRating,
  staffPick,
  stars,
) {
  const dataId = `index-${el}`;
  const skillPathname = `/skills/${skill.group}/${skill.skillTag}/${skill.language}`;
  const skillFeedbackPathname = `${skillPathname}/feedbacks`;
  const mobileView = window.innerWidth < 430;
  if (mobileView) {
    return (
      <div style={styles.skillCard} key={el}>
        <div style={styles.imageContainerMobile}>
          {image ? (
            <div style={styles.imageMobile}>
              <img alt={skillName} src={image} style={styles.imageMobile} />
            </div>
          ) : (
            <CircleImage name={skillName} size="96" />
          )}
        </div>
        <div style={styles.content}>
          <div style={styles.header}>
            <div style={styles.title}>
              <Link
                key={el}
                to={{
                  pathname: skillPathname,
                }}
              >
                <span>{skillName}</span>
              </Link>
            </div>
            <div style={styles.authorName}>
              <span>{authorName}</span>
            </div>
            <div style={{ lineHeight: 1.35, fontSize: 14 }}>
              <span>Skills for SUSI</span>
            </div>
            <div style={styles.rating}>
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
                  <Ratings.Widget />
                  <Ratings.Widget />
                </Ratings>
                <span style={styles.totalRating} title="Total ratings">
                  {totalRating || 0}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={styles.skillCard} key={el}>
      <div style={styles.imageContainer}>
        {image ? (
          <div style={styles.image}>
            <Link
              key={el}
              to={{
                pathname: skillPathname,
              }}
            >
              <img alt={skillName} src={image} style={styles.image} />
            </Link>
          </div>
        ) : (
          <CircleImage name={skillName} size="160" />
        )}
      </div>
      <div style={styles.content}>
        <div style={styles.header}>
          <div style={styles.title}>
            <Link
              key={el}
              to={{
                pathname: skillPathname,
              }}
            >
              <span>{skillName}</span>
            </Link>
            {staffPick && (
              <div style={styles.staffPick}>
                <img
                  alt="Staff Pick Badge"
                  src={StaffPick}
                  className="staffPickIcon"
                />
              </div>
            )}
          </div>
          <div style={styles.authorName}>
            <span>{authorName}</span>
          </div>
        </div>
        <div style={styles.details}>
          <div style={styles.exampleSection}>
            {examples.map((eg, index) => {
              return (
                <div
                  key={index}
                  style={styles.example}
                  onClick={event => testExample(event, eg)}
                >
                  &quot;{eg}&quot;
                </div>
              );
            })}
          </div>
          <div style={styles.textData}>
            <div style={styles.row}>
              <div style={styles.rating}>
                <div data-tip="custom" data-for={dataId}>
                  <Link
                    key={el}
                    to={{
                      pathname: `/${skill.group}/${skill.skillTag}/${skill.language}/feedbacks`,
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
                        className="customeTheme"
                        id={dataId}
                        type={'light'}
                        place="bottom"
                        effect="solid"
                        delayHide={250}
                        border={true}
                      >
                        <SkillRatingPopover stars={stars} />
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
                    <span style={styles.totalRating} title="Total ratings">
                      {totalRating || 0}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            <div style={styles.row}>
              <div style={styles.descriptionTitle}>Description</div>
              <div style={styles.description}>{description}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

class SkillCardList extends Component {
  componentDidMount() {
    this.loadSkillCards();
  }

  loadSkillCards = () => {
    let cards = [];
    Object.keys(this.props.skills).forEach(el => {
      let skill = this.props.skills[el];
      let skillName = 'Name not available',
        examples = [],
        image = '',
        description = 'No description available',
        authorName = 'Author',
        averageRating = 0,
        totalRating = 0,
        staffPick = false,
        stars = {
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
      }
      if (skill.image) {
        image = `${urls.API_URL}/cms/getImage.png?model=${skill.model}&language=${skill.language}&group=${skill.group}&image=${skill.image}`;
      }
      if (skill.examples) {
        examples = skill.examples;
        examples = examples.slice(0, 2); // Select max 2 examples
      }
      if (skill.descriptions) {
        description = skill.descriptions;
      }
      if (skill.author) {
        authorName = skill.author;
      }
      if (skill.skillRating) {
        averageRating = parseFloat(skill.skillRating.stars.avgStar);
        totalRating = parseInt(skill.skillRating.stars.totalStar, 10);
        stars = skill.skillRating.stars;
      }

      if (skill.staffPick) {
        staffPick = true;
      }
      cards.push(
        createListCard(
          el,
          skillName,
          authorName,
          description,
          image,
          skill,
          examples,
          totalRating,
          averageRating,
          staffPick,
          stars,
        ),
      );
    });
    return cards;
  };

  render() {
    return <div style={styles.gridList}>{this.loadSkillCards()}</div>;
  }
}

SkillCardList.propTypes = {
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
)(SkillCardList);

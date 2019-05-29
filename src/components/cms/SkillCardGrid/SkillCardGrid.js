import React, { Component } from 'react';
import Ratings from 'react-ratings-declarative';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import SkillRatingPopover from '../SkillRating/SkillRatingPopover.js';
import NavigationArrowDropDown from '@material-ui/icons/ArrowDropDown';
import CircleImage from '../../CircleImage/CircleImage';
import StaffPick from '../../../images/staff_pick.png';
import '../SkillRating/ReviewPopoverStyle.css';
import styles from '../BrowseSkill/SkillStyle';
import { urls } from '../../../utils';
class SkillCardGrid extends Component {
  loadSkillCards = () => {
    let cards = [];
    Object.keys(this.props.skills).forEach(el => {
      let skill = this.props.skills[el];
      const dataId = `index-${el}`;
      const skillPathname = `/${skill.group}/${skill.skillTag}/${
        skill.language
      }`;
      const skillFeedbackPathname = `${skillPathname}/feedbacks`;
      let skillName,
        examples,
        image,
        staffPick = false;
      let averageRating = 0,
        totalRating = 0,
        authorName = '';
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
        image = `${urls.API_URL}/cms/getImage.png?model=${
          skill.model
        }&language=${skill.language}&group=${skill.group}&image=${skill.image}`;
      } else {
        image = '';
      }
      if (skill.examples) {
        examples = skill.examples[0];
      } else {
        examples = null;
      }
      if (skill.skillRating) {
        averageRating = parseFloat(skill.skillRating.stars.avgStar);
        totalRating = parseInt(skill.skillRating.stars.totalStar, 10);
        stars = skill.skillRating.stars;
      }
      if (skill.staffPick) {
        staffPick = true;
      }
      if (skill.author) {
        authorName = skill.author;
      }
      cards.push(
        <Card style={styles.skillCard} key={el}>
          <Link
            key={el}
            to={{
              pathname: skillPathname,
            }}
          >
            <div style={styles.imageContainer} key={el}>
              {image ? (
                <div style={styles.image}>
                  <img alt={skillName} src={image} style={styles.image} />
                </div>
              ) : (
                <CircleImage name={el} size="48" />
              )}
              {examples ? (
                <div style={styles.example}>&quot;{examples}&quot;</div>
              ) : null}
            </div>
            <div style={styles.name}>
              <span>{skillName}</span>
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
          </Link>
          <div style={styles.author}>
            <p>{authorName}</p>
          </div>
          <div style={styles.rating}>
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
                    className="customeTheme"
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
                <span style={styles.totalRating} title="Total ratings">
                  {totalRating || 0}
                </span>
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
        <div>
          <div style={styles.gridList}>{this.loadSkillCards()}</div>
        </div>
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

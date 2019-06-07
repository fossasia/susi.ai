/* eslint-disable max-len */
import React, { Component } from 'react';
import Ratings from 'react-ratings-declarative';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import PropTypes from 'prop-types';
import CircleImage from '../../CircleImage/CircleImage';
import { scrollAnimation } from '../../../utils';
import Fab from '@material-ui/core/Fab';
import NavigationChevronLeft from '@material-ui/icons/ChevronLeft';
import NavigationChevronRight from '@material-ui/icons/ChevronRight';
import StaffPick from '../../../images/staff_pick.png';
import { urls } from '../../../utils';
import './SkillCardScrollList.min.css';
import styles from './ScrollStyle';

class SkillCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      scrollCards: 4,
      leftBtnDisplay: 'none',
      rightBtnDisplay: 'inline',
    };
  }

  componentDidMount = () => {
    this.loadSkillCards();
    this.updateWindowDimensions();
  };

  updateWindowDimensions = () => {
    let scrollCards = 1;
    switch (true) {
      case window.innerWidth >= 1400:
        scrollCards = 4;
        break;
      case window.innerWidth >= 1120:
        scrollCards = 3;
        break;
      case window.innerWidth >= 840:
        scrollCards = 2;
        break;
      default:
        scrollCards = 1;
        this.setState({ rightBtnDisplay: 'inline' });
    }

    this.setState({
      scrollCards: scrollCards,
    });
  };

  changeBtnDisplay = (scrollValue, maxScrollValue) => {
    if (maxScrollValue === 0) {
      this.setState({ rightBtnDisplay: 'none', leftBtnDisplay: 'none' });
    } else {
      scrollValue >= maxScrollValue
        ? this.setState({ rightBtnDisplay: 'none' })
        : this.setState({ rightBtnDisplay: 'inline' });
      scrollValue <= 0
        ? this.setState({ leftBtnDisplay: 'none' })
        : this.setState({ leftBtnDisplay: 'inline' });
    }
  };

  scrollLeft = () => {
    let parentEle = document.getElementById(this.props.scrollSkills);
    let maxScrollValue = parentEle.scrollWidth - parentEle.clientWidth;
    let scrollValue = parentEle.scrollLeft - 280 * this.state.scrollCards;
    scrollAnimation(parentEle, scrollValue, 100, 'horizontal');
    this.changeBtnDisplay(scrollValue, maxScrollValue);
  };

  scrollRight = () => {
    let parentEle = document.getElementById(this.props.scrollSkills);
    let scrollValue = parentEle.scrollLeft + 280 * this.state.scrollCards;
    let maxScrollValue = parentEle.scrollWidth - parentEle.clientWidth;
    scrollAnimation(parentEle, scrollValue, 100, 'horizontal');
    this.changeBtnDisplay(scrollValue, maxScrollValue);
  };

  loadSkillCards = () => {
    let cards = [];
    Object.keys(this.props.metricSkills[this.props.scrollSkills]).forEach(
      el => {
        let skill = this.props.metricSkills[this.props.scrollSkills][el];
        let skillName,
          examples,
          image,
          staffPick = false;
        let averageRating = 0,
          totalRating = 0;
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
        if (skill.examples) {
          examples = skill.examples;
          examples = examples[0];
        } else {
          examples = null;
        }
        if (skill.skillRating) {
          averageRating = parseFloat(skill.skillRating.stars.avgStar);
          totalRating = parseInt(skill.skillRating.stars.totalStar, 10);
        }

        if (skill.staffPick) {
          staffPick = true;
        }

        cards.push(
          <Card style={styles.skillCard} key={el}>
            <Link
              key={el}
              to={{
                pathname:
                  '/skills/' +
                  skill.group +
                  '/' +
                  skill.skillTag +
                  '/' +
                  skill.language,
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
            </Link>
            <div style={styles.name}>
              <Link
                to={{
                  pathname:
                    '/skills/' +
                    skill.group +
                    '/' +
                    skill.skillTag +
                    '/' +
                    skill.language,
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
            <div style={styles.rating}>
              <Link
                key={el}
                to={{
                  pathname:
                    '/skills/' +
                    skill.group +
                    '/' +
                    skill.skillTag +
                    '/' +
                    skill.language +
                    '/feedbacks',
                }}
              >
                <Ratings
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
          </Card>,
        );
      },
    );
    if (cards.length <= this.state.scrollCards) {
      this.setState({ rightBtnDisplay: 'none' });
    }
    this.setState({
      cards,
    });
  };

  render() {
    let {
      leftFab: leftFabStyle,
      rightFab: rightFabStyle,
      gridList: gridlist,
    } = styles;

    return (
      <div
        style={{
          marginTop: '10px',
          marginBottom: '10px',
          textAlign: 'justify',
          fontSize: '0.1px',
          width: '100%',
        }}
      >
        <div
          id={this.props.scrollSkills}
          className="scrolling-wrapper"
          style={gridlist}
        >
          <Fab
            size="small"
            className="leftFab"
            color="primary"
            style={{
              ...leftFabStyle,
              display: this.state.leftBtnDisplay,
            }}
            onClick={this.scrollLeft}
          >
            <NavigationChevronLeft />
          </Fab>
          {this.state.cards}
          <Fab
            size="small"
            color="primary"
            style={{
              ...rightFabStyle,
              display: this.state.rightBtnDisplay,
            }}
            onClick={this.scrollRight}
          >
            <NavigationChevronRight />
          </Fab>
        </div>
      </div>
    );
  }
}

SkillCard.propTypes = {
  metricSkills: PropTypes.object,
  scrollSkills: PropTypes.string.isRequired,
};

function mapStateToProps(store) {
  return {
    metricSkills: store.skills.metricSkills,
  };
}

export default connect(
  mapStateToProps,
  null,
)(SkillCard);

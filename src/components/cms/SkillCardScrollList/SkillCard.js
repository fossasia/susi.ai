/* eslint-disable max-len */
import React, { Component } from 'react';
import Ratings from 'react-ratings-declarative';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import CircleImage from '../../CircleImage/CircleImage';
import { scrollAnimation } from '../../../utils';
import Fab from '@material-ui/core/Fab';
import NavigationChevronLeft from '@material-ui/icons/ChevronLeft';
import NavigationChevronRight from '@material-ui/icons/ChevronRight';
import { urls } from '../../../utils';
import styled from 'styled-components';
import { ImageContainer, StaffPickImage } from '../SkillsStyle';
import {
  Card,
  Image,
  TitleContainer,
  Example,
  RatingContainer,
  TotalRating,
} from '../SkillCardStyle';

const ScrollWrapper = styled.div`
  margin: 0.625rem;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const LeftFab = styled(Fab)`
  position: absolute;
  left: 16rem;
  margin-top: 4.6rem;
  z-index: 1;
  display: ${props => props.display};
  @media (max-width: 430px) {
    left: 8px !important;
  }
`;

const RightFab = styled(Fab)`
  position: absolute;
  right: 0;
  margin-top: 4.6rem;
  margin-right: 0.625rem;
  z-index: 1;
  display: ${props => props.display};
`;

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
        if (
          skill.examples &&
          skill.examples.length > 0 &&
          skill.examples[0] !==
            '<The question that should be shown in public skill displays>'
        ) {
          examples = skill.examples;
          examples = examples[0];
        } else {
          examples = 'Test this example of skill';
        }
        if (skill.skillRating) {
          averageRating = parseFloat(skill.skillRating.stars.avgStar);
          totalRating = parseInt(skill.skillRating.stars.totalStar, 10);
        }

        if (skill.staffPick) {
          staffPick = true;
        }

        cards.push(
          <Card key={el}>
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
              <ImageContainer key={el}>
                {image ? (
                  <Image alt={skillName} src={image} />
                ) : (
                  <CircleImage name={el} size="48" />
                )}
                {examples ? <Example>&quot;{examples}&quot;</Example> : null}
              </ImageContainer>
            </Link>
            <TitleContainer>
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
              {staffPick && <StaffPickImage />}
            </TitleContainer>
            <RatingContainer>
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
                <TotalRating>{totalRating || 0}</TotalRating>
              </Link>
            </RatingContainer>
          </Card>,
        );
      },
    );
    if (cards.length <= this.state.scrollCards) {
      this.setState({ rightBtnDisplay: 'none', leftBtnDisplay: 'none' });
    }
    this.setState({
      cards,
    });
  };

  render() {
    const { leftBtnDisplay, rightBtnDisplay, cards } = this.state;
    const { scrollSkills } = this.props;
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
        <ScrollWrapper id={scrollSkills}>
          <LeftFab
            size="small"
            color="primary"
            onClick={this.scrollLeft}
            display={leftBtnDisplay}
          >
            <NavigationChevronLeft style={{ margin: '8.4px auto' }} />
          </LeftFab>
          {cards}
          <RightFab
            size="small"
            color="primary"
            display={rightBtnDisplay}
            onClick={this.scrollRight}
          >
            <NavigationChevronRight style={{ margin: '8.4px auto' }} />
          </RightFab>
        </ScrollWrapper>
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

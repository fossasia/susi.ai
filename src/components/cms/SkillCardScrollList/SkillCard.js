/* eslint-disable max-len */
import React, { Component } from 'react';
import Ratings from 'react-ratings-declarative';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import CircleImage from '../../shared/CircleImage';
import { scrollAnimation } from '../../../utils';
import Fab from '@material-ui/core/Fab';
import NavigationChevronLeft from '@material-ui/icons/ChevronLeft';
import NavigationChevronRight from '@material-ui/icons/ChevronRight';
import getImageSrc from '../../../utils/getImageSrc';
import styled from 'styled-components';
import SkillExampleBubble from '../../shared/SkillExampleBubble';
import { ImageContainer, StaffPickImage } from '../SkillsStyle';
import Tooltip from '../../shared/ToolTip';

import {
  Card,
  Image,
  TitleContainer,
  RatingContainer,
  TotalRating,
} from '../SkillCardStyle';

const ScrollWrapper = styled.div`
  margin: 0.625rem;
  overflow-x: scroll;
  overflow-y: hidden;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  scrollbar-width: none;
  scroll-behavior: smooth;
  overflow-style: none;
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
  display: ${(props) => props.display};
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
  display: ${(props) => props.display};
`;

const Container = styled.div`
  margintop: 10px;
  marginbottom: 10px;
  textalign: justify;
  fontsize: 0.1px;
  width: 100%;
`;

class SkillCard extends Component {
  state = {
    cards: [],
    scrollCards: 4,
    leftBtnDisplay: 'none',
    rightBtnDisplay: 'inline',
  };

  componentDidMount = () => {
    window.addEventListener('resize', () => {
      this.updateWindowDimensions();
      this.updateBtnsDisplay();
    });
    this.updateWindowDimensions();
  };

  updateWindowDimensions = () => {
    let scrollCards = 1;
    /*          X coordinate of end of a skillCard placed at nth position in a row is calculated
                using formula `window.innerWidth * 0.15 + 19 + n * 280`
                Formula is explained pictorially with the diagram below:

                =================================================================================================
                ||                      SUSI.AI (HOME PAGE) URL - https://susi.ai/                             ||
                =================================================================================================
                ||      SIDEBAR (15% width)       |  M   |               RIGHT CONTAINER                       ||
                ||                                |  A   |--------                                             ||
                ||                                |  R   | 280   | <-- SkillCard (margin is included in 280px) ||                                           ||
                ||  css ->  `width : 15%`         |  G   | PX    |                                             ||
                ||  converts to                   |  I   |--------                                             ||
                ||  `window.innerWidth * 0.15`    |  N   |-------------------------------                      ||
                ||   in javascript                |      | 280   |  280 |  280  |  nth  |                      ||
                ||                                |  19  |  PX   |   PX |  PX   |  card |                      ||
                ||                                |  px  |------------------------------|                      ||
                =================================================================================================
 X coordinate = ||<--  window.innerWidth * 0.15-->|<19px>|<---        280 * n        --->                      ||
                =================================================================================================
                When window.innerWidth is more than x coordinate of right end of card at nth position.
                Maximum scrollCards that can be viewed on that viewport is set to n
      */
    // Correct positioning of Right arrow for SkillCards upto MAX_CARDS_SUPPORTED is supported with this for loop.
    const MAX_CARDS_SUPPORTED = 20;
    for (let i = MAX_CARDS_SUPPORTED; i > 1; i--) {
      if (window.innerWidth >= window.innerWidth * 0.15 + 19 + i * 280) {
        scrollCards = i;
        break;
      }
    }

    this.setState(
      {
        scrollCards: scrollCards,
      },
      () => {
        this.loadSkillCards();
      },
    );
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
      (el) => {
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
          image = getImageSrc({
            relativePath: `model=${skill.model}&language=${skill.language}&group=${skill.group}&image=${skill.image}`,
          });
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
            <ImageContainer key={el}>
              <Link
                key={el}
                to={{
                  pathname:
                    '/' +
                    skill.group +
                    '/' +
                    skill.skillTag +
                    '/' +
                    skill.language,
                }}
              >
                {image ? (
                  <Image alt={skillName} src={image} />
                ) : (
                  <CircleImage name={el} size="48" />
                )}
              </Link>
              {examples ? (
                <SkillExampleBubble
                  data={examples}
                  history={this.props.history}
                  margin="1.5% 0.85% 1.5% 4%"
                />
              ) : null}
            </ImageContainer>
            <TitleContainer>
              <Link
                to={{
                  pathname:
                    '/' +
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
                <Tooltip title="Staff Pick">
                  <StaffPickImage />
                </Tooltip>
              )}
            </TitleContainer>
            <RatingContainer>
              <Link
                key={el}
                to={{
                  pathname:
                    '/' +
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
                <Tooltip title="Total Rating">
                  <TotalRating>{totalRating || 0}</TotalRating>
                </Tooltip>
              </Link>
            </RatingContainer>
          </Card>,
        );
      },
    );
    this.setState(
      {
        cards,
      },
      () => {
        this.updateBtnsDisplay();
      },
    );
  };

  updateBtnsDisplay() {
    if (this.state.cards.length <= this.state.scrollCards) {
      this.setState({ rightBtnDisplay: 'none', leftBtnDisplay: 'none' });
    } else if (this.state.cards.length > this.state.scrollCards) {
      this.setState({ rightBtnDisplay: 'inline' });
    }
  }

  render() {
    const { leftBtnDisplay, rightBtnDisplay, cards } = this.state;
    const { scrollSkills, isMobile = false } = this.props;
    return (
      <Container>
        <ScrollWrapper id={scrollSkills}>
          {!isMobile && (
            <LeftFab
              size="small"
              color="primary"
              onClick={this.scrollLeft}
              display={leftBtnDisplay}
            >
              <NavigationChevronLeft style={{ margin: '8.4px auto' }} />
            </LeftFab>
          )}
          {cards}
          {!isMobile && (
            <RightFab
              size="small"
              color="primary"
              display={rightBtnDisplay}
              onClick={this.scrollRight}
            >
              <NavigationChevronRight style={{ margin: '8.4px auto' }} />
            </RightFab>
          )}
        </ScrollWrapper>
      </Container>
    );
  }
}

SkillCard.propTypes = {
  metricSkills: PropTypes.object,
  scrollSkills: PropTypes.string.isRequired,
  history: PropTypes.object,
  isMobile: PropTypes.bool,
};

function mapStateToProps(store) {
  return {
    metricSkills: store.skills.metricSkills,
  };
}

export default connect(mapStateToProps, null)(SkillCard);

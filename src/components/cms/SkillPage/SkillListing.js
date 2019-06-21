/* eslint-disable max-len */
// Packages
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ISO6391 from 'iso-639-1';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Components
import skillActions from '../../../redux/actions/skill';
import uiActions from '../../../redux/actions/ui';
import SkillUsageCard from '../SkillUsageCard/SkillUsageCard';
import SkillRatingCard from '../SkillRating/SkillRatingCard';
import SkillFeedbackCard from '../SkillFeedbackCard/SkillFeedbackCard';
import { Paper as _Paper } from '../../shared/Container';
import { Title } from '../../shared/Typography';
import Fab from '@material-ui/core/Fab';
import CircularProgress from '@material-ui/core/CircularProgress';
import Ratings from 'react-ratings-declarative';
import { reportSkill } from '../../../apis';

// Static Assets
import CircleImage from '../../CircleImage/CircleImage';
import EditBtn from '@material-ui/icons/Edit';
import VersionBtn from '@material-ui/icons/History';
import DeleteBtn from '@material-ui/icons/Delete';
import NavigateDown from '@material-ui/icons/ExpandMore';
import NavigateUp from '@material-ui/icons/ExpandLess';
import ReactTooltip from 'react-tooltip';
import { urls, parseDate } from '../../../utils';
import styled from 'styled-components';

import './SkillListing.css';

const HomeDiv = styled.div`
  font-size: 0.875rem;
`;

const AuthorSpan = styled.span`
  cursor: pointer;
  texttransform: capitalize;
`;

const Paper = styled(_Paper)`
  width: 100%;
`;

const ExampleComment = styled.div`
  cursor: pointer;
  font-style: italic;
  font-size: 14px;
  padding: 14px 18px;
  border-radius: 8px;
  border: 1px solid #eaeded;
  background-color: #f4f6f6;
  margin: 1.5% 0.85% 1.5% 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 192;
  position: relative;

  :before {
    content: ' ';
    position: absolute;
    bottom: -14px;
    right: 10%;
    border-width: 0 0 13px 26px;
    border-style: solid;
    display: block;
    border-color: transparent #eaeded;
    width: 0;
  }

  :after {
    content: ' ';
    position: absolute;
    bottom: -12px;
    right: 10%;
    border-width: 0 0 12px 25px;
    border-style: solid;
    border-color: #f4f6f6 transparent transparent #f4f6f6;
  }
`;

class SkillListing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      skillFeedback: [],
      feedbackMessage: '',
      skillExampleCount: 4,
      seeMoreSkillExamples: true,
    };

    this.groupValue = this.props.location.pathname.split('/')[2];
    this.skillTag = this.props.location.pathname.split('/')[3];
    this.languageValue = this.props.location.pathname.split('/')[4];
    this.skillData = {
      model: 'general',
      group: this.groupValue,
      language: this.languageValue,
      skill: this.skillTag,
    };
    this.skillName = this.skillTag
      ? this.skillTag
          .split('_')
          .map(data => {
            const s = data.charAt(0).toUpperCase() + data.substring(1);
            return s;
          })
          .join(' ')
      : '';
  }

  componentDidMount() {
    document.title = `SUSI.AI - ${this.skillName} Skills`;
    this.fetchSkillData();
  }

  fetchSkillData = () => {
    const { actions, accessToken } = this.props;
    actions.getSkillMetaData(this.skillData);
    if (accessToken) {
      actions.getUserRating(this.skillData);
    }
    actions.getDateWiseSkillUsage(this.skillData);
    actions.getCountryWiseSkillUsage(this.skillData);
    actions.getDeviceWiseSkillUsage(this.skillData);
    actions.getRatingsOverTime(this.skillData);
    actions.getSkillFeedbacks(this.skillData);
  };

  openAuthorSkills = () => {
    this.props.actions.openModal({ modalType: 'authorSkills' });
  };

  handleDeleteDialog = () => {
    this.props.actions.openModal({
      modalType: 'deleteSkill',
      handleConfirm: this.deleteSkill,
      handleClose: this.props.actions.closeModal,
    });
  };

  handleReportSkillDialog = () => {
    this.props.actions.openModal({
      modalType: 'reportSkill',
      handleConfirm: this.handleReportSubmit,
      handleClose: this.props.actions.closeModal,
    });
  };

  deleteSkill = () => {
    const { actions, history } = this.props;
    actions.setSkillLoading().then(response => {
      actions
        .deleteSkill(this.skillData)
        .then(payload => {
          // this.handleDeleteToggle();
          history.push('/');
        })
        .catch(error => {
          console.log(error);
          actions.openSnackBar({
            snackMessage: 'Failed to delete the skill.',
          });
        });
    });
  };

  handleReportSubmit = () => {
    const { actions } = this.props;
    const { feedbackMessage } = this.state;
    reportSkill({ ...this.skillData, feedback: feedbackMessage })
      .then(payload => {
        actions.closeModal();
        actions.openSnackBar({
          snackBarMessage: 'Skill has been reported successfully.',
          snackBarDuration: 3000,
        });
      })
      .catch(error => {
        actions.closeModal();
        actions.openSnackBar({
          snackBarMessage: 'Failed to report the skill.',
          snackBarDuration: 3000,
        });
      });
  };

  toggleSkillExamples = () => {
    this.setState(prevState => ({
      seeMoreSkillExamples: !prevState.seeMoreSkillExamples,
      skillExampleCount:
        prevState.skillExampleCount === 4
          ? prevState.examples && prevState.examples.length
          : 4,
    }));
  };

  render() {
    const { skillExampleCount } = this.state;

    const {
      image,
      author,
      descriptions: _descriptions,
      skillName: _skillName,
      supportedLanguages,
      lastModifiedTime,
      developerPrivacyPolicy,
      termsOfUse,
      dynamicContent,
      examples,
      skillRatings,
    } = this.props.metaData;

    const { loadingSkill, isAdmin, accessToken } = this.props;

    const imgUrl = !image
      ? '/favicon-512x512.jpg'
      : `${urls.API_URL}/cms/getImage.png?model=general&language=${this.languageValue}&group=${this.groupValue}&image=${image}`;

    const descriptions =
      _descriptions === null || _descriptions === '<description>'
        ? 'No Description Provided'
        : _descriptions;

    const skillName = _skillName === null ? 'No Name Given' : _skillName;

    let { seeMoreSkillExamples } = this.state;
    const editLink = `/skills/${this.groupValue}/${this.skillTag}/edit/${this.languageValue}`;
    const versionsLink = `/skills/${this.groupValue}/${this.skillTag}/versions/${this.languageValue}`;

    let renderElement = null;
    if (examples.length > 4) {
      seeMoreSkillExamples = seeMoreSkillExamples ? (
        <div className="skill-read-more-container">
          <p style={{ fontSize: '0.75rem' }}>See more examples</p>
          <NavigateDown
            style={{ fill: '#555656', width: '0.75rem' }}
            className="skill-example-more-icon"
          />
        </div>
      ) : (
        <div className="skill-read-more-container">
          <p style={{ fontSize: '0.75rem' }}>Less</p>
          <NavigateUp
            style={{ fill: '#555656', width: '0.75rem' }}
            className="skill-example-more-icon"
          />
        </div>
      );
    }
    if (loadingSkill === true) {
      renderElement = (
        <div>
          <h1 className="skill_loading_container">
            <div className="center">
              <CircularProgress size={62} color="primary" />
              <h4>Loading</h4>
            </div>
          </h1>
        </div>
      );
    } else {
      renderElement = (
        <div>
          <HomeDiv className="skill_listing_container">
            <div className="avatar">
              {!image ? (
                <CircleImage name={skillName.toUpperCase()} size="250" />
              ) : (
                <img className="avatar-img" alt="Thumbnail" src={imgUrl} />
              )}
            </div>
            <div className="skillHeaderContainer">
              <div>
                <h1 className="name">{this.skillName}</h1>
                <h4>
                  by{' '}
                  <AuthorSpan onClick={this.openAuthorSkills}>
                    {author}
                  </AuthorSpan>
                </h4>
                <a className="singleRating" href="#rating">
                  <Ratings
                    rating={skillRatings.avgStar}
                    widgetRatedColors="#ffbb28"
                    widgetDimensions="1.25rem"
                    widgetSpacings="0rem"
                  >
                    <Ratings.Widget />
                    <Ratings.Widget />
                    <Ratings.Widget />
                    <Ratings.Widget />
                    <Ratings.Widget />
                  </Ratings>
                  <div className="ratingLabel">{skillRatings.totalStar}</div>
                </a>
              </div>
              <div className="linkButtons">
                {isAdmin === true && (
                  <div className="skillDeleteBtn">
                    <Fab
                      onClick={this.handleDeleteDialog}
                      data-tip="Delete Skill"
                      style={{ backgroundColor: '#f44336' }}
                    >
                      <DeleteBtn />
                    </Fab>
                    <ReactTooltip effect="solid" place="bottom" />
                  </div>
                )}
                <div>
                  <Link
                    to={{
                      pathname: editLink,
                    }}
                  >
                    <Fab data-tip="Edit Skill" color="primary">
                      <EditBtn />
                    </Fab>
                    <ReactTooltip effect="solid" place="bottom" />
                  </Link>
                </div>
                <div>
                  <Link
                    to={{
                      pathname: versionsLink,
                    }}
                  >
                    <div className="skillVersionBtn">
                      <Fab data-tip="Skill Versions" color="primary">
                        <VersionBtn />
                      </Fab>
                      <ReactTooltip effect="solid" place="bottom" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <div className="avatar-meta margin-b-md">
              <div className="example-container">
                {examples &&
                  examples[Object.keys(examples)[0]] &&
                  examples.slice(0, skillExampleCount).map((data, index) => {
                    return (
                      <ExampleComment
                        key={index}
                        className="example-comment"
                        onClick={event =>
                          this.props.history.push({
                            pathname: '/chat',
                            search: `?testExample=${data}`,
                          })
                        }
                      >
                        <q>{data}</q>
                      </ExampleComment>
                    );
                  })}
              </div>
              <div
                className="skill-example-see-more"
                onClick={this.toggleSkillExamples}
              >
                {seeMoreSkillExamples}
              </div>
            </div>
            <Paper>
              <Title>Description</Title>
              <p className="card-content">{descriptions}</p>
              {dynamicContent && (
                <div className="card-content">
                  <p>
                    This skill contains dynamic content that is updated in real
                    time based on inputs from the user.
                  </p>
                </div>
              )}

              {termsOfUse && termsOfUse !== '<link>' && (
                <div className="card-content">
                  <a
                    href={termsOfUse}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms & Conditions
                  </a>
                </div>
              )}

              {developerPrivacyPolicy && developerPrivacyPolicy !== '<link>' && (
                <div className="card-content">
                  <a
                    href={developerPrivacyPolicy}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Developer Privacy Policy
                  </a>
                </div>
              )}
            </Paper>
            <Paper>
              <Title>Skill Details</Title>
              <div className="card-content">
                <table>
                  <tbody>
                    <tr>
                      <td>Category: </td>
                      <td>
                        <Link to={`/skills/category/${this.groupValue}`}>
                          {this.groupValue}
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <td>Language: </td>
                      <td>
                        <Link to={`/skills/language/${this.languageValue}`}>
                          {ISO6391.getNativeName(this.languageValue)}
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <td>Updated on: </td>
                      <td>{` ${parseDate(lastModifiedTime)}`}</td>
                    </tr>
                    <tr>
                      <td>Languages supported:</td>
                      <td>
                        {supportedLanguages.map((data, index) => {
                          const delimiter =
                            supportedLanguages.length === index + 1
                              ? null
                              : ', ';
                          return (
                            <Link
                              key={index}
                              onClick={this.forceUpdate}
                              to={`/skills/${this.groupValue}/${data.name}/${data.language}`}
                            >
                              {ISO6391.getNativeName(data.language)}
                              {delimiter}
                            </Link>
                          );
                        })}
                      </td>
                    </tr>
                    {accessToken && (
                      <tr>
                        <td>Report: </td>
                        <td>
                          <div
                            style={{ color: '#108ee9', cursor: 'pointer' }}
                            onClick={this.handleReportSkillDialog}
                          >
                            Flag as inappropriate
                          </div>
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td>Content Rating: </td>
                      <td>4+ age</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Paper>
            <SkillRatingCard />
            <SkillFeedbackCard />
            <SkillUsageCard />
          </HomeDiv>
        </div>
      );
    }

    return (
      <div
        style={{
          display: 'flex',
          height: '100%',
          flexDirection: 'column',
        }}
      >
        <div style={{ flex: '1 0 auto' }}>{renderElement}</div>
      </div>
    );
  }
}

SkillListing.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  actions: PropTypes.object,
  metaData: PropTypes.object,
  loadingSkill: PropTypes.bool,
  openSnack: PropTypes.bool,
  snackMessage: PropTypes.string,
  accessToken: PropTypes.string,
  isAdmin: PropTypes.bool,
};

function mapStateToProps(store) {
  return {
    ...store.skill,
    isAdmin: store.app.isAdmin,
    accessToken: store.app.accessToken,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...skillActions, ...uiActions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SkillListing);

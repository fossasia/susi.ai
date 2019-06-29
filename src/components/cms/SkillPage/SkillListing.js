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
import Ratings from 'react-ratings-declarative';
import { reportSkill } from '../../../apis';
import { CenterReaderContainer } from '../../shared/Container';

// Static Assets
import CircleImage from '../../shared/CircleImage';
import EditBtn from '@material-ui/icons/Edit';
import VersionBtn from '@material-ui/icons/History';
import DeleteBtn from '@material-ui/icons/Delete';
import _NavigateDown from '@material-ui/icons/ExpandMore';
import _NavigateUp from '@material-ui/icons/ExpandLess';
import ReactTooltip from 'react-tooltip';
import { urls, parseDate } from '../../../utils';
import styled, { css } from 'styled-components';
import CircularLoader from '../../shared/CircularLoader';

const SingleRating = styled.div`
  display: flex;
  cursor: pointer;
  width: fit-content;
`;

const Container = styled(CenterReaderContainer)`
  font-size: 0.875rem;
  margin-top: 5rem;
`;

const AuthorSpan = styled.span`
  cursor: pointer;
  texttransform: capitalize;
`;

const Paper = styled(_Paper)`
  width: 100%;
`;

const ArrowExampleIconStyle = css`
  width: 9px;
  position: relative;
  bottom: 3px;
  fill: #555656;
  width: 0.75rem;
`;

const NavigateUp = styled(_NavigateUp)`
  ${ArrowExampleIconStyle};
`;

const NavigateDown = styled(_NavigateDown)`
  ${ArrowExampleIconStyle};
`;

const ExampleWrapper = styled.div`
  width: 55%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
`;

const ExampleContainer = styled.div`
  min-height: 150px;
  margin-bottom: 1rem;
  @media (max-width: 768px) {
    display: flex;
    min-height: 0px;
  }
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

const MoreExamplesContainer = styled.div`
  text-align: center;
  margin-top: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
`;

const SkillImage = styled.img.attrs({
  alt: 'Thumbnail',
})`
  height: 200px;
  width: auto;
  @media (max-width: 768px) {
    display: inline;
  }
`;

const SkillHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const RatingLabel = styled.div`
  font-size: 14px;
  margin-left: 4px;
  font-weight: bold;
`;

const AvatarContainer = styled.div`
  padding-right: 40px;
  font-size: 48px;
  float: left;
  @media (max-width: 768px) {
    float: none;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;

  > div {
    margin: 5px;
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
        <MoreExamplesContainer>
          <p style={{ fontSize: '0.75rem' }}>See more examples</p>
          <NavigateDown />
        </MoreExamplesContainer>
      ) : (
        <MoreExamplesContainer>
          <p style={{ fontSize: '0.75rem' }}>Less</p>
          <NavigateUp />
        </MoreExamplesContainer>
      );
    }
    if (loadingSkill === true) {
      renderElement = <CircularLoader />;
    } else {
      renderElement = (
        <Container>
          <AvatarContainer>
            {!image ? (
              <CircleImage name={skillName.toUpperCase()} size="250" />
            ) : (
              <SkillImage alt="Thumbnail" src={imgUrl} />
            )}
          </AvatarContainer>
          <SkillHeaderContainer>
            <div>
              <h1 className="name">{this.skillName}</h1>
              <h4>
                by{' '}
                <AuthorSpan onClick={this.openAuthorSkills}>
                  {author}
                </AuthorSpan>
              </h4>
              <SingleRating>
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
                <RatingLabel>{skillRatings.totalStar}</RatingLabel>
              </SingleRating>
            </div>
            <ButtonContainer>
              {isAdmin === true && (
                <div>
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
                  <div>
                    <Fab data-tip="Skill Versions" color="primary">
                      <VersionBtn />
                    </Fab>
                    <ReactTooltip effect="solid" place="bottom" />
                  </div>
                </Link>
              </div>
            </ButtonContainer>
          </SkillHeaderContainer>
          <ExampleContainer>
            <ExampleWrapper>
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
            </ExampleWrapper>
            <div
              className="skill-example-see-more"
              onClick={this.toggleSkillExamples}
            >
              {seeMoreSkillExamples}
            </div>
          </ExampleContainer>
          <Paper>
            <Title>Description</Title>
            <p>{descriptions}</p>
            {dynamicContent && (
              <p>
                This skill contains dynamic content that is updated in real time
                based on inputs from the user.
              </p>
            )}

            {termsOfUse && termsOfUse !== '<link>' && (
              <a href={termsOfUse} target="_blank" rel="noopener noreferrer">
                Terms & Conditions
              </a>
            )}

            {developerPrivacyPolicy && developerPrivacyPolicy !== '<link>' && (
              <a
                href={developerPrivacyPolicy}
                target="_blank"
                rel="noopener noreferrer"
              >
                Developer Privacy Policy
              </a>
            )}
          </Paper>
          <Paper>
            <Title>Skill Details</Title>
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
                        supportedLanguages.length === index + 1 ? null : ', ';
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
          </Paper>
          <SkillRatingCard />
          <SkillFeedbackCard />
          <SkillUsageCard />
        </Container>
      );
    }

    return <div>{renderElement}</div>;
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

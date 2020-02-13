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
import { StaffPickBadge } from '../../shared/Badges';

// Static Assets
import CircleImage from '../../shared/CircleImage';
import EditBtn from '@material-ui/icons/Edit';
import VersionBtn from '@material-ui/icons/History';
import DeleteBtn from '@material-ui/icons/Delete';
import ReactTooltip from 'react-tooltip';
import { parseDate } from '../../../utils';
import getImageSrc from '../../../utils/getImageSrc';
import styled from 'styled-components';
import CircularLoader from '../../shared/CircularLoader';
import SkillExampleBubble from '../../shared/SkillExampleBubble';

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
  state = {
    skillFeedback: [],
    feedbackMessage: '',
  };

  groupValue = this.props.location.pathname.split('/')[1];
  skillTag = this.props.location.pathname.split('/')[2];
  languageValue = this.props.location.pathname.split('/')[3];
  skillData = {
    model: 'general',
    group: this.groupValue,
    language: this.languageValue,
    skill: this.skillTag,
  };
  skillName = this.skillTag
    ? this.skillTag
        .split('_')
        .map(data => {
          const s = data.charAt(0).toUpperCase() + data.substring(1);
          return s;
        })
        .join(' ')
    : '';

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

  deleteSkill = async () => {
    const { actions, history } = this.props;
    const { model, group, language, skill } = this.skillData;
    try {
      await actions.deleteSkill({
        model,
        group,
        language,
        skill,
      });
      actions.openModal({
        modalType: 'confirm',
        title: 'Success',
        handleConfirm: () => {
          actions.closeModal();
          history.push('/');
        },
        content: (
          <p>
            You successfully deleted <b>{skill}</b>!
          </p>
        ),
      });
    } catch (error) {
      console.log(error);
      actions.openModal({
        title: 'Failed',
        handleConfirm: actions.closeModal,
        skillName: skill,
        content: (
          <p>
            Error! <b>{skill}</b> could not be deleted!
          </p>
        ),
      });
    }
  };

  handleDeleteDialog = () => {
    this.props.actions.openModal({
      modalType: 'deleteSkill',
      handleConfirm: this.deleteSkill,
      handleClose: this.props.actions.closeModal,
      name: this.skillData.skill,
    });
  };

  handleReportSkillDialog = () => {
    this.props.actions.openModal({
      modalType: 'reportSkill',
      handleConfirm: this.handleReportSubmit,
      handleClose: this.props.actions.closeModal,
    });
  };

  handleReportSubmit = async () => {
    const { actions } = this.props;
    const { feedbackMessage } = this.state;
    try {
      await reportSkill({
        ...this.skillData,
        feedback: feedbackMessage,
      });
      actions.closeModal();
      actions.openSnackBar({
        snackBarMessage: 'Skill has been reported successfully.',
        snackBarDuration: 3000,
      });
    } catch (error) {
      actions.closeModal();
      actions.openSnackBar({
        snackBarMessage: 'Failed to report the skill.',
        snackBarDuration: 3000,
      });
    }
  };

  render() {
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
      staffPick,
    } = this.props.metaData;

    const { loadingSkill, isAdmin, accessToken, history } = this.props;

    const imgUrl = !image
      ? '/favicon-512x512.jpg'
      : getImageSrc({
          relativePath: `model=general&language=${this.languageValue}&group=${this.groupValue}&image=${image}`,
        });
    const descriptions =
      _descriptions === null || _descriptions === '<description>'
        ? 'No Description Provided'
        : _descriptions;

    const skillName = _skillName === null ? 'No Name Given' : _skillName;

    const editLink = `/${this.groupValue}/${this.skillTag}/edit/${this.languageValue}`;
    const versionsLink = `/${this.groupValue}/${this.skillTag}/versions/${this.languageValue}`;

    let renderElement = null;

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
              {staffPick && <StaffPickBadge />}
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
                    style={{ backgroundColor: '#f44336', color: 'white' }}
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
                examples.map((data, index) => {
                  return (
                    <SkillExampleBubble
                      key={index}
                      data={data}
                      history={history}
                      margin={'1.5% 2.85% 1.5% 0'}
                    />
                  );
                })}
            </ExampleWrapper>
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
                    <Link to={`/category/${this.groupValue}`}>
                      {this.groupValue}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td>Language: </td>
                  <td>
                    <Link to={`/language/${this.languageValue}`}>
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
                    {supportedLanguages &&
                      Array.isArray(supportedLanguages) &&
                      supportedLanguages.length > 0 &&
                      supportedLanguages.map((data, index) => {
                        const delimiter =
                          supportedLanguages.length === index + 1 ? null : ', ';
                        return (
                          <Link
                            key={index}
                            onClick={this.forceUpdate}
                            to={`/${this.groupValue}/${data.name}/${data.language}`}
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
  staffPick: PropTypes.bool,
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

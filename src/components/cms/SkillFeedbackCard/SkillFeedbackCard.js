// Packages
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import skillActions from '../../../redux/actions/skill';
import uiActions from '../../../redux/actions/ui';
import styled from 'styled-components';
import isMobileView from '../../../utils/isMobileView';
// Components
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import CircleImage from '../../shared/CircleImage';
import Button from '../../shared/Button';
import { RATING_TO_HINT_MAP } from '../../../constants/ratingHints';
import FiveStarRatingWidget from '../../shared/FiveStarRatingWidget';
import FormControl from '@material-ui/core/FormControl';
import OutlinedTextField from '../../shared/OutlinedTextField';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '../../shared/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Emoji from 'react-emoji-render';
import { parseDate, formatDate } from '../../../utils';
import { Title, DefaultMessage, SubTitle } from '../../shared/Typography';
import { Paper as _Paper } from '../../shared/Container';
import getSkillNameFromSkillTag from '../../../utils/getSkillNameFromSkillTag';

// Icons
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Delete from '@material-ui/icons/Delete';
import EditBtn from '@material-ui/icons/BorderColor';

const Paper = styled(_Paper)`
  width: 100%;
`;

const Timestamp = styled.div`
  color: #aaa;
  font-size: 12px;
`;

class SkillFeedbackCard extends Component {
  state = {
    anchorEl: null,
    newFeedbackValue: '',
    loading: false,
    rating: 0,
  };

  handleMenuOpen = event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleMenuClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  handleFeedbackChange = event => {
    this.setState({ newFeedbackValue: event.target.value });
  };

  handleEditOpen = previousFeedback => {
    this.handleMenuClose();
    this.setState({ newFeedbackValue: previousFeedback }, () => {
      this.props.actions.openModal({
        modalType: 'editFeedback',
        handleConfirm: this.postFeedback,
        handleClose: this.props.actions.closeModal,
        feedback: this.state.newFeedbackValue,
        rating: this.props.userRating,
        handleEditFeedback: this.editFeedback,
        handleEditRating: this.editRating,
      });
    });
  };

  editFeedback = () => {
    let feedbackText = document.getElementById('edit-feedback').value;
    this.setState({ newFeedbackValue: feedbackText });
  };

  editRating = rating => {
    this.setState({ rating });
  };

  setSkillRating = async ({ message }) => {
    const { rating } = this.state;
    const { group, language, skillTag: skill, actions } = this.props;

    const skillData = {
      model: 'general',
      group,
      language,
      skill,
      stars: rating,
    };
    try {
      await actions.setUserRating({ userRating: rating });
      if (message === 'rate') {
        actions.openSnackBar({
          snackBarMessage: 'The skill was reviewed successfully!',
          snackBarDuration: 4000,
        });
      }
      try {
        await actions.getSkillRating(skillData);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  postFeedback = async () => {
    const { newFeedbackValue } = this.state;

    if (newFeedbackValue !== '') {
      const { group, language, skillTag: skill, actions } = this.props;
      const { loading } = this.state;

      const skillData = {
        model: 'general',
        group,
        language,
        skill,
        feedback: newFeedbackValue,
      };

      if (newFeedbackValue && newFeedbackValue.trim().length > 0) {
        if (!loading) {
          this.setState({ loading: true });
        }
        try {
          await actions.setSkillFeedback(skillData);
          actions.closeModal();
          await actions.getSkillFeedbacks(skillData);
        } catch (error) {
          console.log(error);
        }
        this.setState({ loading: false });
      }
    }
    await this.setSkillRating({ message: 'rate' });
  };

  handleFeedbackDelete = () => {
    const { actions } = this.props;
    this.handleMenuClose();
    actions.openModal({
      modalType: 'deleteFeedback',
      handleConfirm: this.deleteFeedback,
      handleClose: actions.closeModal,
    });
  };

  deleteFeedback = async () => {
    const { group, language, skillTag: skill, actions } = this.props;
    this.setState({ newFeedbackValue: '' });
    this.setState({ rating: 0 }, () => {
      this.setSkillRating({ message: 'delete' });
    });

    const skillData = {
      model: 'general',
      group,
      language,
      skill,
    };
    try {
      await actions.deleteSkillFeedback(skillData);
      actions.closeModal();
      actions.getSkillFeedbacks(skillData);
    } catch (error) {
      console.log(error);
    }
  };

  // eslint-disable-next-line complexity
  render() {
    const {
      skillFeedbacks,
      skillTag,
      language,
      email,
      accessToken,
      avatarImgThumbnail,
      userRatingTimestamp,
      userRating,
    } = this.props;
    const { anchorEl, newFeedbackValue, loading, rating } = this.state;
    const open = Boolean(anchorEl);
    const mobileView = isMobileView();
    let userName = '';
    let userAvatarLink = '';
    let userEmail = '';
    let name = this.props.userName === '' ? email : this.props.userName;
    let userProps = { src: avatarImgThumbnail, name };
    let userFeedback = '';

    let feedbackCards = null;
    if (skillFeedbacks) {
      feedbackCards = []
        .concat(skillFeedbacks)
        .sort((a, b) => {
          let dateA = new Date(a.timestamp);
          let dateB = new Date(b.timestamp);
          return dateB - dateA;
        })
        .map((data, index) => {
          userEmail = data.email;
          userAvatarLink = data.avatar;
          userName = data.userName;
          const name = userName === '' ? userEmail : userName;
          const avatarProps = {
            src: userAvatarLink,
            name,
          };
          if (accessToken && email && userEmail === email) {
            userFeedback = data.feedback;
            return null;
          }
          // eslint-disable-next-line
          else {
            return (
              <ListItem key={index} button>
                <CircleImage {...avatarProps} size="40" />
                <div>
                  <div>
                    {userName !== ''
                      ? userName
                      : `${userEmail.slice(0, userEmail.indexOf('@') + 1)}...`}
                  </div>
                  <Timestamp>{formatDate(parseDate(data.timestamp))}</Timestamp>
                  {data.rating > 0 ? (
                    <FiveStarRatingWidget rating={data.rating} />
                  ) : null}
                  <div>
                    <Emoji text={data.feedback} />
                  </div>
                </div>
              </ListItem>
            );
          }
        });
    }
    let userFeedbackCard = userRating > 0 && (
      <div>
        <ListItem key={1} button>
          <CircleImage {...userProps} size="40" />
          <div style={{ width: '90%' }}>
            <div>{name}</div>
            <Timestamp>
              {userRatingTimestamp &&
                formatDate(parseDate(userRatingTimestamp))}
            </Timestamp>
            <FiveStarRatingWidget rating={userRating} />
            <div>
              <Emoji text={userFeedback} />
            </div>
          </div>
          <div>
            <IconButton
              aria-owns={open ? 'options' : undefined}
              aria-haspopup="true"
              onClick={this.handleMenuOpen}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="options"
              anchorEl={anchorEl}
              open={open}
              onClose={this.handleMenuClose}
            >
              <MenuItem
                onClick={() => {
                  this.handleEditOpen(userFeedback);
                }}
              >
                <ListItemIcon>
                  <EditBtn />
                </ListItemIcon>
                <ListItemText> Edit</ListItemText>
              </MenuItem>
              <MenuItem onClick={this.handleFeedbackDelete}>
                <ListItemIcon>
                  <Delete />
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
              </MenuItem>
            </Menu>
          </div>
        </ListItem>
        <Divider />
      </div>
    );

    if (feedbackCards && userFeedbackCard) {
      feedbackCards.splice(4);
    } else if (feedbackCards) {
      feedbackCards.splice(5);
    }

    return (
      <Paper>
        <Title>Feedback and Rating</Title>
        {accessToken && !userRating && (
          <div>
            <SubTitle size="1rem">
              {' '}
              Rate your experience and give feedback with{' '}
              {getSkillNameFromSkillTag(skillTag)} on SUSI.AI{' '}
            </SubTitle>
            <div
              style={{
                textAlign: 'center',
                margin: '1.5rem',
              }}
            >
              <FiveStarRatingWidget
                rating={rating}
                widgetHoverColors="#ffbb28"
                widgetDimensions={mobileView ? '30px' : '50px'}
                widgetSpacings="5px"
                changeRating={Rating => {
                  this.setState({ rating: Rating });
                }}
              />
            </div>
            <div style={{ textAlign: 'center', fontSize: '1rem' }}>
              {RATING_TO_HINT_MAP[rating]}
            </div>
            <div style={{ margin: '1rem' }}>
              <FormControl fullWidth={true}>
                <OutlinedTextField
                  margin="dense"
                  value={newFeedbackValue}
                  label="Skill Feedback(optional)"
                  placeholder="Skill Feedback"
                  defaultValue=""
                  multiline={true}
                  fullWidth={true}
                  onChange={this.handleFeedbackChange}
                  aria-describedby="post-feedback-helper-text"
                />
              </FormControl>
              <Button
                label="Post"
                color="primary"
                variant="contained"
                style={{ marginTop: 10 }}
                handleClick={this.postFeedback}
                disabled={!rating || loading}
                isLoading={loading}
                buttonText="Post"
              />
            </div>
          </div>
        )}
        <List style={{ padding: '8px 0px 0px 0px' }}>
          {userFeedbackCard}
          {feedbackCards}
          {!userFeedbackCard && !feedbackCards && (
            <DefaultMessage>No feedback present for this skill!</DefaultMessage>
          )}
          {skillFeedbacks.length >= 5 ? (
            <Link to={`${language}/feedbacks`} style={{ display: 'block' }}>
              <ListItem button>
                <ListItemText style={{ textAlign: 'center' }}>
                  Show all reviews
                </ListItemText>
              </ListItem>
            </Link>
          ) : null}
        </List>
      </Paper>
    );
  }
}

SkillFeedbackCard.propTypes = {
  skillTag: PropTypes.string,
  skillFeedbacks: PropTypes.array,
  language: PropTypes.string,
  group: PropTypes.string,
  feedback: PropTypes.string,
  actions: PropTypes.object,
  accessToken: PropTypes.string,
  email: PropTypes.string,
  userRating: PropTypes.number,
  userName: PropTypes.string,
  avatarImgThumbnail: PropTypes.string,
  userRatingTimestamp: PropTypes.string,
};

function mapStateToProps(store) {
  return {
    language: store.skill.metaData.language,
    group: store.skill.metaData.group,
    skillTag: store.skill.metaData.skillTag,
    feedback: store.skill.feedback,
    skillFeedbacks: store.skill.skillFeedbacks,
    email: store.app.email,
    accessToken: store.app.accessToken,
    userRating: store.skill.userRating,
    userRatingTimestamp: store.skill.userRatingTimestamp,
    userName: store.settings.userName,
    avatarImgThumbnail: store.app.avatarImgThumbnail,
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
)(SkillFeedbackCard);

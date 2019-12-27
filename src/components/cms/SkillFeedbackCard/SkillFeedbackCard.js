// Packages
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import skillActions from '../../../redux/actions/skill';
import uiActions from '../../../redux/actions/ui';
import styled from 'styled-components';
// Components
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import CircleImage from '../../shared/CircleImage';
import Button from '../../shared/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
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
import CircularProgress from '@material-ui/core/CircularProgress';

const Paper = styled(_Paper)`
  width: 100%;
`;

const Timestamp = styled.div`
  color: #aaa;
  font-size: 12px;
`;

class SkillFeedbackCard extends Component {
  state = {
    errorText: '',
    anchorEl: null,
    newFeedbackValue: '',
    loading: false,
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
        errorText: this.state.errorText,
        feedback: this.state.newFeedbackValue,
        handleEditFeedback: this.editFeedback,
      });
    });
  };

  editFeedback = () => {
    let feedbackText = document.getElementById('edit-feedback').value;
    this.setState({ newFeedbackValue: feedbackText });
  };

  postFeedback = async () => {
    const { group, language, skillTag: skill, actions } = this.props;
    const { newFeedbackValue, loading } = this.state;

    const skillData = {
      model: 'general',
      group,
      language,
      skill,
      feedback: newFeedbackValue,
    };

    if (newFeedbackValue !== undefined && newFeedbackValue.trim()) {
      if (!loading) {
        this.setState({ loading: true });
      }
      try {
        await actions.setSkillFeedback(skillData);
        actions.closeModal();
        actions.getSkillFeedbacks(skillData);
      } catch (error) {
        console.log(error);
      }
      this.setState({ loading: false });
    } else {
      this.setState({ errorText: 'Feedback cannot be empty' });
    }
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

  render() {
    const {
      skillFeedbacks,
      skillTag,
      language,
      email,
      accessToken,
    } = this.props;
    const { errorText, anchorEl, newFeedbackValue, loading } = this.state;
    const open = Boolean(anchorEl);

    let userName = '';
    let userAvatarLink = '';
    let userEmail = '';
    let userFeedbackCard = null;
    let feedbackCards = null;
    if (skillFeedbacks) {
      feedbackCards = skillFeedbacks.map((data, index) => {
        userEmail = data.email;
        userAvatarLink = data.avatar;
        userName = data.userName;
        const name = userName === '' ? userEmail : userName;
        const avatarProps = {
          src: userAvatarLink,
          name,
        };
        if (accessToken && email && userEmail === email) {
          userFeedbackCard = (
            <div key={index}>
              <ListItem key={index} button>
                <CircleImage {...avatarProps} size="40" />
                <div style={{ width: '90%' }}>
                  <div>{name}</div>
                  <Timestamp>{formatDate(parseDate(data.timestamp))}</Timestamp>
                  <div>
                    <Emoji text={data.feedback} />
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
                        this.handleEditOpen(data.feedback);
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
                <div>
                  <Emoji text={data.feedback} />
                </div>
              </div>
            </ListItem>
          );
        }
      });
    }

    if (feedbackCards && userFeedbackCard) {
      feedbackCards.splice(4);
    } else if (feedbackCards) {
      feedbackCards.splice(5);
    }

    return (
      <Paper>
        <Title>Feedback</Title>
        {accessToken && !userFeedbackCard && (
          <div>
            <SubTitle size="1rem">
              {' '}
              Write your invaluable feedback with{' '}
              {getSkillNameFromSkillTag(skillTag)} on SUSI.AI{' '}
            </SubTitle>
            <div>
              <div style={{ margin: '1rem' }}>
                <FormControl fullWidth={true}>
                  <OutlinedTextField
                    margin="dense"
                    value={newFeedbackValue}
                    label="Skill Feedback"
                    placeholder="Skill Feedback"
                    defaultValue=""
                    multiline={true}
                    fullWidth={true}
                    onChange={this.handleFeedbackChange}
                    aria-describedby="post-feedback-helper-text"
                  />
                  <FormHelperText id="post-feedback-helper-text" error>
                    {errorText}
                  </FormHelperText>
                </FormControl>
                <Button
                  label="Post"
                  color="primary"
                  variant="contained"
                  style={{ marginTop: 10 }}
                  onClick={this.postFeedback}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="white" />
                  ) : (
                    'Post'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
        <List style={{ padding: '8px 0px 0px 0px' }}>
          {userFeedbackCard}
          {feedbackCards}
          {!userFeedbackCard && !feedbackCards && (
            <DefaultMessage>No feedback present for this skill!</DefaultMessage>
          )}
          {(userFeedbackCard && skillFeedbacks.length >= 4) ||
          skillFeedbacks.length >= 5 ? (
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

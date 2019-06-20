// Packages
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import skillActions from '../../../redux/actions/skill';
import styled from 'styled-components';
// Components
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import CircleImage from '../../CircleImage/CircleImage';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Emoji from 'react-emoji-render';
import { parseDate, formatDate } from '../../../utils';
import { Title, DefaultMessage, SubTitle } from '../../shared/Typography';
import { Paper as _Paper } from '../../shared/Container';

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
  constructor(props) {
    super(props);

    this.state = {
      openEditDialog: false,
      openDeleteDialog: false,
      errorText: '',
      anchorEl: null,
    };
  }

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

  handleEditOpen = () => {
    this.setState({
      openEditDialog: true,
      anchorEl: null,
    });
  };

  handleDeleteOpen = () => {
    this.setState({
      openDeleteDialog: true,
      anchorEl: null,
    });
  };

  handleEditClose = () => {
    this.setState({
      openEditDialog: false,
      errorText: '',
    });
  };

  handleDeleteClose = () => {
    this.setState({
      openDeleteDialog: false,
    });
  };

  editFeedback = () => {
    let feedbackText = document.getElementById('edit-feedback').value;
    this.setState({ feedbackValue: feedbackText });
  };

  setFeedback = event => {
    this.setState({ feedbackValue: event.target.value });
  };

  postFeedback = () => {
    const { group, language, skillTag: skill, actions } = this.props;
    const { feedbackValue } = this.state;
    const skillData = {
      model: 'general',
      group,
      language,
      skill,
      feedback: feedbackValue,
    };
    if (feedbackValue !== undefined && feedbackValue.trim()) {
      actions
        .setSkillFeedback(skillData)
        .then(payload => {
          actions.getSkillFeedbacks(skillData);
        })
        .catch(error => {
          console.log(error);
        });
      this.handleEditClose();
    } else {
      this.setState({ errorText: 'Feedback cannot be empty' });
    }
  };

  deleteFeedback = () => {
    const { group, language, skillTag: skill, actions } = this.props;
    const skillData = {
      model: 'general',
      group,
      language,
      skill,
    };
    actions
      .deleteSkillFeedback(skillData)
      .then(payload => actions.getSkillFeedbacks(skillData))
      .catch(error => console.log(error));
    this.handleDeleteClose();
  };

  render() {
    const {
      skillFeedbacks,
      skillTag,
      language,
      email,
      accessToken,
    } = this.props;
    const {
      errorText,
      openEditDialog,
      openDeleteDialog,
      anchorEl,
    } = this.state;
    const open = Boolean(anchorEl);
    const editActions = [
      <Button key={0} color="primary" onClick={this.handleEditClose}>
        Cancel
      </Button>,
      <Button key={1} color="primary" onClick={this.postFeedback}>
        Edit
      </Button>,
    ];

    const deleteActions = [
      <Button
        key={0}
        style={{ marginRight: '10px' }}
        color="primary"
        onClick={this.handleDeleteClose}
      >
        Cancel
      </Button>,
      <Button
        key={1}
        variant="contained"
        color="secondary"
        onClick={this.deleteFeedback}
      >
        Delete
      </Button>,
    ];

    let userFeedback = null;
    let userName = '';
    let userAvatarLink = '';
    let userEmail = '';
    let userFeedbackCard = null;
    let feedbackCards;
    if (skillFeedbacks) {
      feedbackCards = skillFeedbacks.map((data, index) => {
        userEmail = data.email;
        userFeedback = data.feedback;
        userAvatarLink = data.avatar;
        userName = data.userName;
        const avatarProps = {
          src: userAvatarLink,
          name: userName === '' ? userEmail : userName,
        };
        if (accessToken && email && userEmail === email) {
          userFeedbackCard = (
            <div key={index}>
              <ListItem key={index} button>
                <CircleImage {...avatarProps} size="40" />
                <div style={{ width: '90%' }}>
                  <div>{userName === '' ? userEmail : userName}</div>
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
                    <MenuItem onClick={this.handleEditOpen}>
                      <ListItemIcon>
                        <EditBtn />
                      </ListItemIcon>
                      <ListItemText> Edit</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={this.handleDeleteOpen}>
                      <ListItemIcon>
                        <Delete />
                      </ListItemIcon>
                      <ListItemText>Delete</ListItemText>
                    </MenuItem>
                  </Menu>
                </div>
              </ListItem>
              <Divider inset={true} />
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

    if (feedbackCards) {
      if (userFeedbackCard) {
        feedbackCards.splice(4);
      } else {
        feedbackCards.splice(5);
      }
    }

    return (
      <Paper>
        <Title>Feedback</Title>
        {accessToken && !userFeedbackCard ? (
          <div>
            <SubTitle size="1rem">
              {' '}
              Write your invaluable feedback with {skillTag} on SUSI.AI{' '}
            </SubTitle>
            <div>
              <div style={{ padding: '1rem', margin: '1rem' }}>
                <FormControl fullWidth={true}>
                  <Input
                    id="post-feedback"
                    placeholder="Skill Feedback"
                    defaultValue=""
                    multiLine={true}
                    fullWidth={true}
                    onChange={this.setFeedback}
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
                  style={{ margin: 10 }}
                  onClick={this.postFeedback}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        ) : null}
        {feedbackCards &&
          (feedbackCards.length > 0 ? (
            <List style={{ padding: '8px 0px 0px 0px' }}>
              {userFeedbackCard}
              {feedbackCards}
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
          ) : (
            <DefaultMessage>No feedback present for this skill!</DefaultMessage>
          ))}
        <Dialog
          open={openEditDialog}
          onClose={this.handleEditClose}
          maxWidth={'sm'}
          fullWidth={true}
        >
          <DialogTitle>Edit Feedback</DialogTitle>
          <DialogContent>
            <FormControl fullWidth={true}>
              <Input
                id="edit-feedback"
                placeholder="Skill Feedback"
                defaultValue={userFeedback}
                multiLine={true}
                fullWidth={true}
                onChange={this.editFeedback}
                aria-describedby="edit-feedback-helper-text"
              />
              <FormHelperText id="edit-feedback-helper-text" error>
                {errorText}
              </FormHelperText>
            </FormControl>
          </DialogContent>
          <DialogActions>{editActions}</DialogActions>
        </Dialog>
        <Dialog
          open={openDeleteDialog}
          onClose={this.handleEditClose}
          maxWidth={'sm'}
          fullWidth={true}
        >
          <DialogContent>
            <DialogContentText>
              Are you sure, you want to delete your feedback?
            </DialogContentText>
          </DialogContent>
          <DialogActions>{deleteActions}</DialogActions>
        </Dialog>
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
    actions: bindActionCreators(skillActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SkillFeedbackCard);

/* eslint-disable max-len */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import skillActions from '../../../redux/actions/skill';
import uiActions from '../../../redux/actions/ui';
import PropTypes from 'prop-types';

import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import CircleImage from '../../CircleImage/CircleImage';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import CircularProgress from '@material-ui/core/CircularProgress';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Delete from '@material-ui/icons/Delete';
import EditBtn from '@material-ui/icons/BorderColor';
import NavigationChevronRight from '@material-ui/icons/ChevronRight';
import Emoji from 'react-emoji-render';
import styled from 'styled-components';

import './SkillFeedbackPage.css';
import { urls, parseDate, formatDate } from '../../../utils';
import { Paper } from '../../shared/Container';
import { SubTitle } from '../../shared/Typography';

const Div = styled.div`
  margin-top: 3.125rem;
  width: 100%;
  font-size: 0.875rem;
`;

const Timestamp = styled.div`
  color: #aaa;
  font-size: 12px;
`;

const LEFT_PAGE = 'LEFT';
const RIGHT_PAGE = 'RIGHT';
const pageLimit = 6;

const range = (from, to, step = 1) => {
  let i = from;
  const rangeArr = [];

  while (i <= to) {
    rangeArr.push(i);
    i += step;
  }

  return rangeArr;
};

class SkillFeedbackPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorText: '',
      loading: true,
      currentPage: 1,
      currentRecords: [],
      anchorEl: null,
    };
    this.totalPages = 1;
    this.pageNeighbours =
      typeof this.pageNeighbours === 'number'
        ? Math.max(0, Math.min(this.pageNeighbours, 2))
        : 0;
    const { pathname } = this.props.location;
    this.groupValue = pathname.split('/')[2];
    this.skillTag = pathname.split('/')[3];
    this.languageValue = pathname.split('/')[4];
    this.skillName = this.skillTag
      ? this.skillTag
          .split('_')
          .map(data => {
            const s = data.charAt(0).toUpperCase() + data.substring(1);
            return s;
          })
          .join(' ')
      : '';

    this.skillData = {
      model: 'general',
      group: this.groupValue,
      language: this.languageValue,
      skill: this.skillTag,
    };
  }

  fetchPageNumbers = () => {
    const { skillFeedbacks } = this.props;
    const { currentPage } = this.state;
    const totalPages = Math.ceil(skillFeedbacks.length / pageLimit);
    const pageNeighbours = this.pageNeighbours;
    /**
     * totalNumbers: the total page numbers to show on the control
     * totalBlocks: totalNumbers + 2 to cover for the left(<) and right(>) controls
     */
    const totalNumbers = this.pageNeighbours * 2 + 3;
    const totalBlocks = totalNumbers + 2;
    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - pageNeighbours);
      const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);
      let pages = range(startPage, endPage);

      /**
       * hasLeftSpill: has hidden pages to the left
       * hasRightSpill: has hidden pages to the right
       * spillOffset: number of hidden pages either to the left or to the right
       */
      const hasLeftSpill = startPage > 2;
      const hasRightSpill = totalPages - endPage > 1;
      const spillOffset = totalNumbers - (pages.length + 1);
      switch (true) {
        // handle: (1) < {5 6} [7] {8 9} (10)
        case hasLeftSpill && !hasRightSpill: {
          const extraPages = range(startPage - spillOffset, startPage - 1);
          pages = [LEFT_PAGE, ...extraPages, ...pages];
          break;
        }
        // handle: (1) {2 3} [4] {5 6} > (10)
        case !hasLeftSpill && hasRightSpill: {
          const extraPages = range(endPage + 1, endPage + spillOffset);
          pages = [...pages, ...extraPages, RIGHT_PAGE];
          break;
        }
        // handle: (1) < {4 5} [6] {7 8} > (10)
        case hasLeftSpill && hasRightSpill:
        default: {
          pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
          break;
        }
      }
      return [1, ...pages, totalPages];
    }
    return range(1, totalPages);
  };

  componentDidMount() {
    const { actions } = this.props;
    actions.getSkillMetaData(this.skillData);
    actions
      .getSkillFeedbacks(this.skillData)
      .then(response => this.setState({ loading: false }));
    this.gotoPage(1);
  }

  onPageChanged = data => {
    const { currentPage } = this.state;
    const { skillFeedbacks } = this.props;
    const offset = (currentPage - 1) * pageLimit;
    const currentRecords = skillFeedbacks.slice(offset, offset + pageLimit);
    this.setState({ currentPage, currentRecords });
  };

  gotoPage = page => {
    const { skillFeedbacks } = this.props;
    const currentPage = Math.max(0, page);
    const paginationData = {
      currentPage,
      totalPages: Math.ceil(skillFeedbacks.length / pageLimit),
      pageLimit,
      totalRecords: skillFeedbacks,
    };
    this.setState({ currentPage }, () => this.onPageChanged(paginationData));
    if (this.feedbackRef) {
      this.feedbackRef.scrollIntoView({ behaviour: 'smooth' });
    }
  };

  handleClick = page => evt => {
    evt.preventDefault();
    this.gotoPage(page);
  };

  handleMoveLeft = evt => {
    const { currentPage } = this.state;
    evt.preventDefault();
    if (currentPage !== 1) {
      this.gotoPage(currentPage - 1);
    }
  };

  handleMoveRight = evt => {
    const { currentPage } = this.state;
    const { skillFeedbacks } = this.props;
    evt.preventDefault();
    if (currentPage !== Math.ceil(skillFeedbacks.length / pageLimit)) {
      this.gotoPage(currentPage + 1);
    }
  };

  handleDeleteModal = () => {
    this.props.actions.openModal({
      modalType: 'deleteFeedback',
      handleConfirm: this.deleteFeedback,
      handleClose: this.props.actions.closeModal,
    });
  };

  handleEditModal = () => {
    this.props.actions.openModal({
      modalType: 'editFeedback',
      handleConfirm: this.postFeedback,
      handleClose: this.props.actions.closeModal,
      errorText: this.state.errorText,
      feedback: this.state.feedbackValue,
      handleEditFeedback: this.editFeedback,
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
    if (feedbackValue) {
      actions
        .setSkillFeedback(skillData)
        .then(payload => {
          actions.getSkillFeedbacks(skillData);
        })
        .catch(error => {
          console.log(error);
        });
      // this.handleEditClose();
    } else {
      this.setState({ errorText: 'Feedback cannot be empty' });
    }
  };

  deleteFeedback = () => {
    const { actions } = this.props;
    actions
      .deleteSkillFeedback(this.skillData)
      .then(payload => actions.getSkillFeedbacks(this.skillData))
      .catch(error => console.log(error));
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

  openAuthorSkills = () => {
    this.props.actions.openModal({ modalType: 'authorSkills' });
  };

  render() {
    const { currentPage, errorText, loading, anchorEl } = this.state;
    const {
      image,
      author,
      skillName: _skillName,
      skillFeedbacks,
      email,
      accessToken,
    } = this.props;

    const open = Boolean(anchorEl);
    const imgUrl = !image
      ? '/favicon-512x512.jpg'
      : `${urls.API_URL}/cms/getImage.png?model=general&language=${this.languageValue}&group=${this.groupValue}&image=${image}`;

    const skillName = _skillName === null ? 'No Name Given' : _skillName;

    const pages = this.fetchPageNumbers();

    let feedbackCards = [];
    let userFeedbackCard;
    let userFeedback;
    let userName = '';
    let userAvatarLink = '';
    let userEmail = '';

    if (skillFeedbacks) {
      userFeedback =
        skillFeedbacks[skillFeedbacks.findIndex(x => x.email === email)];
      if (userFeedback && currentPage === 1) {
        userEmail = userFeedback.email;
        userAvatarLink = userFeedback.avatar;
        userName = userFeedback.userName;
        const avatarProps = {
          src: userAvatarLink,
          name: userName === '' ? userEmail : userName,
        };
        userFeedbackCard = (
          <div>
            <ListItem button>
              <CircleImage {...avatarProps} size="40" />
              <div style={{ width: '90%' }}>
                <div>{userName === '' ? userEmail : userName}</div>
                <Timestamp>
                  {formatDate(parseDate(userFeedback.timestamp))}
                </Timestamp>
                <div>
                  <Emoji text={userFeedback.feedback} />
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
                  <MenuItem onClick={this.handleEditModal}>
                    <ListItemIcon>
                      <EditBtn />
                    </ListItemIcon>
                    <ListItemText> Edit</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={this.handleDeleteModal}>
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
      }
    }
    if (skillFeedbacks) {
      feedbackCards = skillFeedbacks
        .slice((currentPage - 1) * pageLimit, currentPage * pageLimit)
        .map((data, index) => {
          userEmail = data.email;
          userAvatarLink = data.avatar;
          userName = data.userName;
          const avatarProps = {
            src: userAvatarLink,
            name: userName === '' ? userEmail : userName,
          };
          if (userEmail !== email) {
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
          return null;
        });
    }
    let feedbackCardsElement = null;
    feedbackCardsElement = (
      <div>
        {accessToken && !userFeedback ? (
          <div>
            <SubTitle size="1rem">
              {`Write your invaluable feedback with
            ${this.skillName} on SUSI.AI`}
            </SubTitle>
            <div>
              <Timestamp>
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
              </Timestamp>
            </div>
          </div>
        ) : null}
        <div ref={el => (this.feedbackRef = el)}>
          {userFeedbackCard}
          {feedbackCards}
        </div>
      </div>
    );
    let renderElement = null;
    if (!loading) {
      renderElement = (
        <div>
          <Div className="skill_listing_container">
            <Paper>
              <p style={{ marginLeft: 10 }}>
                <Link
                  to={`/skills/${this.groupValue}/${this.skillTag}/${this.languageValue}`}
                  style={{ color: '#000000' }}
                >
                  {this.skillName}
                </Link>
                <NavigationChevronRight style={{ paddingTop: 10 }} />
                Feedback
              </p>
              <div className="feedback-skill-detail">
                <div className="feedback-avatar">
                  <Link
                    to={`/skills/${this.groupValue}/${this.skillTag}/${this.languageValue}`}
                  >
                    {image == null ? (
                      <CircleImage
                        name={this.skillName.toUpperCase()}
                        size="60"
                      />
                    ) : (
                      <img
                        className="feedback-avatar-img"
                        alt="Thumbnail"
                        src={imgUrl}
                      />
                    )}
                  </Link>
                </div>
                <div className="feedback-skill-name-author">
                  <h1 className="feedback-name">
                    <Link
                      to={`/skills/${this.groupValue}/${this.skillTag}/${this.languageValue}`}
                    >
                      {skillName}
                    </Link>
                  </h1>
                  <div>
                    by{' '}
                    <span
                      className="feedback-author"
                      onClick={this.openAuthorSkills}
                    >
                      {author}
                    </span>
                  </div>
                </div>
              </div>
              <h1 className="title">Feedback</h1>
              {feedbackCardsElement}
              {skillFeedbacks &&
                (skillFeedbacks.length > 0 ? (
                  <div className="pagination-container">
                    <ul className="pagination">
                      <div
                        className={`navigation-pagination${
                          currentPage === 1 ? '-disabled' : ''
                        } `}
                      >
                        <div
                          onClick={this.handleMoveLeft}
                          className={`navigation-pagination-text${
                            currentPage === 1 ? '-disabled' : ''
                          }`}
                        >
                          ← Previous
                        </div>
                      </div>
                      {pages.map((page, index) => {
                        if (page === LEFT_PAGE) {
                          return (
                            <li key={index} className="page-item navigation">
                              <span className="page-link">...</span>
                            </li>
                          );
                        }
                        if (page === RIGHT_PAGE) {
                          return (
                            <li key={index} className="page-item navigation">
                              <span className="page-link">...</span>
                            </li>
                          );
                        }
                        return (
                          <li
                            key={index}
                            className={`page-item${
                              currentPage === page ? ' active' : ''
                            }`}
                          >
                            <div
                              className="page-link"
                              onClick={this.handleClick(page)}
                            >
                              {page}
                            </div>
                          </li>
                        );
                      })}
                      <div
                        className={`navigation-pagination${
                          currentPage ===
                          Math.ceil(skillFeedbacks.length / pageLimit)
                            ? '-disabled'
                            : ''
                        }`}
                      >
                        <div
                          onClick={this.handleMoveRight}
                          className={`navigation-pagination-text${
                            currentPage ===
                            Math.ceil(skillFeedbacks.length / pageLimit)
                              ? '-disabled'
                              : ''
                          }`}
                        >
                          Next →
                        </div>
                      </div>
                    </ul>
                  </div>
                ) : (
                  <div className="feedback-default-message">
                    No feedback present for this skill!
                  </div>
                ))}
              <div className="feedback-footer-skill">
                <Link
                  to={`/skills/${this.groupValue}/${this.skillTag}/${this.languageValue}`}
                  style={{ color: '#417DDE' }}
                >
                  <b>
                    {`‹ See all details for ${this.skillTag &&
                      this.skillTag
                        .split(' ')
                        .map(data => {
                          let s =
                            data.charAt(0).toUpperCase() + data.substring(1);
                          return s;
                        })
                        .join(' ')}`}
                  </b>
                </Link>
              </div>
            </Paper>
          </Div>
        </div>
      );
    } else {
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
    }
    return <div>{renderElement}</div>;
  }
}

SkillFeedbackPage.propTypes = {
  skillTag: PropTypes.string,
  skillFeedbacks: PropTypes.array,
  language: PropTypes.string,
  group: PropTypes.string,
  feedback: PropTypes.string,
  actions: PropTypes.object,
  location: PropTypes.object,
  author: PropTypes.object,
  image: PropTypes.string,
  skillName: PropTypes.string,
  email: PropTypes.string,
  accessToken: PropTypes.string,
};

function mapStateToProps(store) {
  return {
    language: store.skill.metaData.language,
    group: store.skill.metaData.group,
    skillTag: store.skill.metaData.skillTag,
    feedback: store.skill.feedback,
    skillFeedbacks: store.skill.skillFeedbacks,
    author: store.skill.metaData.author,
    image: store.skill.metaData.image,
    skillName: store.skill.metaData.skillName,
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
)(SkillFeedbackPage);

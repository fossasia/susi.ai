import React, { Component } from 'react';
import { connect } from 'react-redux';
import CodeView from './SkillViews/CodeView';
import ConversationView from './SkillViews/ConversationView';
import TreeView from './SkillViews/TreeView';
import Preview from '../BotBuilder/Preview/Preview';
import { urls, colors } from '../../../utils';
import searchURLPath from '../../../utils/searchURLPath';
import getQueryStringValue from '../../../utils/getQueryStringValue';
import createActions from '../../../redux/actions/create';
import uiActions from '../../../redux/actions/ui';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from 'react-router-dom';
import ISO6391 from 'iso-639-1';
import ReactTooltip from 'react-tooltip';
import { Grid, Col, Row } from 'react-flexbox-grid';
import PropTypes from 'prop-types';

import {
  fetchAllGroupOptions,
  fetchAllLanguageOptions,
  fetchSkillMetaData,
  deleteSkill,
  modifySkill,
  createSkill,
} from '../../../apis/index.js';

import './SkillCreator.css';
import './Animation.min.css';

// Material-UI Components
import Button from '@material-ui/core/Button';
import _Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import styled from 'styled-components';

// Material-UI Icons
import Info from '@material-ui/icons/Info';
import Code from '@material-ui/icons/Code';
import QA from '@material-ui/icons/QuestionAnswer';
import Timeline from '@material-ui/icons/Timeline';
import Add from '@material-ui/icons/Add';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';

// Ant Design Components
import { notification, Icon } from 'antd';
import 'antd/dist/antd.css';
import { bindActionCreators } from 'redux';
let languages = [];

const Paper = styled(_Paper)`
  width: 100%;
  margin-top: 1.25rem;
  padding: 1.25rem 1.875rem 1.875rem;
`;

const DropDownDiv = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const LoggedInErrorPara = styled.p`
  text-align: center;
  text-transform: uppercase;
  font-weight: bold;
  margin-bottom: 6.25rem;
  font-size: 3.125rem;
  margin-top: 18.75rem;
`;

const Heading = styled.div`
  color: rgba(0, 0, 0, 0.65);
  font-size: 1.688rem;
  font-weight: 500;
  padding-left: 1.875rem;
  padding-top: 0.625rem;
`;

const UploadCircularButton = styled.label`
  border-radius: 50%;
  height: 3.75rem;
  width: 3.75rem;
  background-color: #eee;
  text-align: center;
  float: left;
  cursor: pointer;
`;

const HomeDiv = styled.div`
  width: 100%;
  padding: 2.5rem 0.625rem 0;
`;

const TitlePara = styled.p`
  text-align: center;
  font-weight: bold;
  margin-bottom: 1.25rem;
  font-size: 1.25rem;
  margin-top: 0.938rem;
`;

const SubTitlePara = styled.p`
  text-align: center;
  font-weight: bold;
  margin-bottom: 1.25rem;
  font-size: 1rem;
  margin-top: 0.938rem;
`;

const DescriptionPara = styled.p`
  text-align: center;
  font-size: 0.938rem;
  margin-top: 1.25rem;
`;

const EditPaper = styled(_Paper)`
  width: 100%;
  padding: 0.625rem;
  margin: 1.875rem 0 0;
`;

const B = styled.b`
  font-size: 0.875rem;
`;

const CenterDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const InfoIcon = styled(Info)`
  position: relative;
  float: right;
  height: 1.25rem;
  width: 1.25rem;
  cursor: pointer;
  color: #9e9e9e;
  display: 'inline-bock';
`;

const ChevronLeftIcon = styled(ChevronLeft)`
  position: absolute;
  left: 0.25rem;
  top: 0.25rem;
  width: 2.188rem;
  height: 2.188rem;
  color: white;
  cursor: pointer;
  display: inherit;
`;

const ChevronRightIcon = styled(ChevronRight)`
  position: relative;
  left: -1.875rem;
  top: -1.25rem;
  width: 2.188rem;
  height: 2.188rem;
  color: #9e9e9e;
  cursor: pointer;
  display: inherit;
`;

class SkillCreator extends Component {
  constructor(props) {
    super(props);

    this.isBotBuilder = window.location.pathname.split('/')[2] === 'botbuilder';

    let commonState = {
      groups: [],
      loadViews: false,
      editable: true,
    };

    if (
      searchURLPath('name') &&
      searchURLPath('group') &&
      searchURLPath('language')
    ) {
      this.expertValue = getQueryStringValue('name');
      this.groupValue = getQueryStringValue('group');
      this.languageValue = getQueryStringValue('language');
    }

    if (
      this.props.location &&
      this.props.location.pathname.split('/')[4] === 'edit'
    ) {
      const { pathname } = this.props.location;
      this.mode = 'edit';
      this.groupValue = pathname.split('/')[2];
      this.languageValue = pathname.split('/')[5];
      this.expertValue = pathname.split('/')[3];
      this.commitId = pathname.split('/')[6];

      let commitMessage = `Updated Skill ${this.expertValue}`;
      if (this.props.hasOwnProperty('revertingCommit')) {
        commitMessage = 'Reverting to commit - ' + this.props.revertingCommit;
      } else if (this.commitId) {
        commitMessage = `Reverting to commit - ${this.commitId}`;
      }
      this.state = {
        ...commonState,
        loading: false,
        showImage: true,
        commitMessage,
        codeChanged: false,
        groupSelect: false,
        languageSelect: false,
        expertSelect: false,
        date: '',
        author: '',
        oldImageUrl: '',
        imageNameChanged: false,
        showAdmin: false,
        slideState: 1, // 1 means in middle, 2 means preview collapsed
        colSkill: this.props.hasOwnProperty('revertingCommit') ? 12 : 8,
        colPreview: this.props.hasOwnProperty('revertingCommit') ? 0 : 4,
        prevButton: 0, // 0 means disappear, 1 means appear
      };
    } else {
      this.mode = 'create';
      this.state = {
        ...commonState,
        showImage: false,
        loading: false,
        commitMessage: '',
        groupSelect: true,
        expertSelect: true,
        slideState: 1, // 1 means in middle, 2 means preview collapsed
        colSkill: 8,
        colPreview: 4,
        prevButton: 0, // 0 means disappear, 1 means appear
      };
    }
  }

  loadlanguages() {
    if (languages.length === 0) {
      fetchAllLanguageOptions()
        .then(payload => {
          const data = payload.languagesArray;
          this.setState({ languages: data });
          languages = data.map(language => {
            if (ISO6391.getNativeName(language)) {
              return (
                <MenuItem value={language} key={language}>
                  {ISO6391.getNativeName(language)}
                </MenuItem>
              );
            }
            return (
              <MenuItem value={language} key={language}>
                Universal
              </MenuItem>
            );
          });
        })
        .catch(error => {
          console.log('Error while fetching languages', error);
        });
    }
  }

  componentWillUnmount() {
    if (!this.isBotBuilder) {
      const { actions } = this.props;
      actions.resetCreateStore();
    }
  }

  componentDidMount = () => {
    // Check if admin is logged in or not
    const { isAdmin, actions } = this.props;
    if (isAdmin) {
      this.setState({
        showAdmin: true,
      });
    }

    if (this.isBotBuilder) {
      this.setState({
        slideState: 0,
        colSkill: 12,
        colPreview: 0,
        prevButton: 0,
      });
    }

    this.loadgroups();

    if (
      this.mode === 'edit' ||
      (searchURLPath('name') &&
        searchURLPath('group') &&
        searchURLPath('language'))
    ) {
      let payload = {
        skill: this.expertValue,
        group: this.groupValue,
        language: this.languageValue,
        model: 'general',
      };
      this.loadlanguages();

      fetchSkillMetaData(payload)
        .then(payload => {
          this.setState({
            editable: payload.skillMetadata.editable,
            loadViews: true,
          });
        })
        .catch(error => {
          console.log('Error while fetching skill metadata', error);
        });

      actions.setSkillData({
        name: this.expertValue,
        category: this.groupValue,
        language: this.languageValue,
      });

      if (this.mode === 'edit') {
        document.title = 'SUSI.AI - Edit Skill';
        if (this.commitId) {
          actions
            .getSkillByCommitId({
              ...payload,
              commitID: this.commitId,
            })
            .then(payload => {
              this.setState({
                author: payload.author,
                date: payload.commitDate,
                loadViews: true,
              });
              const match = payload.file.match(/^::image\s(.*)$/m);
              if (match != null) {
                this.setState({ codeChanged: true });
              }
            });
        }
        // Edit already existing Skill
        actions
          .getSkillCode(payload)
          .then(payload => {
            const {
              payload: { text: code },
            } = payload;
            const match = code.match(/^::image\s(.*)$/m);
            if (match !== null) {
              this.setState({
                codeChanged: true,
                loadViews: true,
              });
            }
          })
          .catch(error => {
            console.log('Error while fetching skill', error);
          });
      } else if (
        searchURLPath('name') &&
        searchURLPath('group') &&
        searchURLPath('language')
      ) {
        this.setState({ showImage: true });
        payload = { ...payload, private: 1 };
        actions
          .getBotBuilderCode(payload)
          .then(payload => {
            const {
              payload: { text: code },
            } = payload;
            const match = code.match(/^::image\s(.*)$/m);
            if (match !== null) {
              this.setState({
                codeChanged: true,
                loadViews: true,
              });
            }
          })
          .catch(error => {
            console.log('Error while fetching skill', error);
          });
      }
    } else {
      document.title = 'SUSI.AI - Create Skill';
      this.setState({ loadViews: true });
      this.prefillCode();
    }
  };

  handlePreviewToggle = () => {
    let { slideState } = this.state;
    if (slideState === 2) {
      this.setState({
        slideState: 1,
        colSkill: 8,
        colPreview: 4,
        prevButton: 0,
      });
    } else if (slideState === 1) {
      this.setState({
        slideState: 2,
        colSkill: 12,
        colPreview: 0,
        prevButton: 1,
      });
    }
  };

  prefillCode = () => {
    const { userName, email, actions } = this.props;
    let { code } = this.props;
    if (userName) {
      code = code.replace(/^::author\s(.*)$/m, '::author ' + userName);
      actions.setSkillData({ code });
    }

    if (email) {
      actions.getAuthorUrl({ email });
    }
  };

  loadgroups() {
    if (this.state.groups.length === 0) {
      fetchAllGroupOptions()
        .then(payload => {
          if (payload.groups) {
            const data = payload.groups;
            data.sort();
            let groups = [];
            for (let i = 0; i < data.length; i++) {
              groups.push(
                <MenuItem value={data[i]} key={data[i]}>
                  {`${data[i]}`}
                </MenuItem>,
              );
            }
            this.setState({ groups });
          }
        })
        .catch(error => {
          console.log('Error while fetching groups', error);
        });
    }
  }

  handleExpertChange = event => {
    const { actions } = this.props;
    let { code } = this.props;
    const { value: name } = event.target;
    code = code.replace(/^::name\s(.*)$/m, `::name ${name}`);
    let commitMessage = 'Created Skill ' + name;
    this.setState({
      commitMessage,
    });
    actions.setSkillData({ name, code });
  };

  handleGroupChange = (event, index, value) => {
    const { actions } = this.props;
    let { code } = this.props;
    code = code.replace(
      /^::category\s(.*)$/m,
      `::category ${event.target.value}`,
    );
    this.setState({
      groupSelect: false,
      languageSelect: false,
    });
    actions.setSkillData({ category: event.target.value, code });
    if (languages.length === 0) {
      fetchAllLanguageOptions()
        .then(payload => {
          const data = payload.languagesArray;
          this.setState({ languages: data });
          for (let i = 0; i < data.length; i++) {
            if (ISO6391.getNativeName(data[i])) {
              languages.push(
                <MenuItem value={data[i]} key={data[i]}>
                  {ISO6391.getNativeName(data[i])}
                </MenuItem>,
              );
            } else {
              languages.push(
                <MenuItem value={data[i]} key={data[i]}>
                  Universal
                </MenuItem>,
              );
            }
            if (data[i] === 'en') {
              this.handleLanguageChange(null, 0, 'en');
              this.setState({ languageSelect: false, expertSelect: false });
            }
          }
          languages.sort(function(a, b) {
            if (a.props.primaryText < b.props.primaryText) {
              return -1;
            }
            if (a.props.primaryText > b.props.primaryText) {
              return 1;
            }
            return 0;
          });
        })
        .catch(error => {
          console.log('Error while fetching languages', error);
        });
    }
  };

  handleLanguageChange = (event, index, value) => {
    const { actions } = this.props;
    let { code } = this.props;
    code = code.replace(
      /^::language\s(.*)$/m,
      `::language ${event.target.value}`,
    );
    this.setState({
      expertSelect: false,
    });
    actions.setSkillData({ language: event.target.value, code });
  };

  handleExpertChange = event => {
    const { actions } = this.props;
    let { code } = this.props;
    const { value: name } = event.target;
    code = code.replace(/^::name\s(.*)$/m, `::name ${name}`);
    let commitMessage = 'Created Skill ' + name;
    this.setState({
      commitMessage,
    });
    actions.setSkillData({ name, code });
  };

  handleDeleteModal = () => {
    this.props.actions.openModal({
      modalType: 'deleteSkillWithInput',
      handleConfirm: this.deleteSkill,
      handleClose: this.props.actions.closeModal,
    });
  };

  saveClick = () => {
    const {
      email,
      accessToken,
      category,
      language,
      name,
      file,
      imageUrl,
    } = this.props;
    let { code } = this.props;
    code = '::author_email ' + email + '\n' + code;
    if (this.isBotBuilder) {
      code = '::protected Yes\n' + code;
    } else {
      code = '::protected No\n' + code;
    }

    if (this.state.commitMessage === null) {
      notification.open({
        message: 'Please add a commit message',
        icon: <Icon type="close-circle" style={{ color: '#f44336' }} />,
      });

      return 0;
    }

    if (!accessToken) {
      notification.open({
        message: 'Not logged In',
        description: 'Please login and then try to create/edit a skill',
        icon: <Icon type="close-circle" style={{ color: '#f44336' }} />,
      });
      return 0;
    }
    if (category === null || language === '' || name === '') {
      notification.open({
        message: 'Error Processing your Request',
        description: 'Please select a group, language and a skill',
        icon: <Icon type="close-circle" style={{ color: '#f44336' }} />,
      });
      return 0;
    }
    if (!new RegExp(/.+\.\w+/g).test(imageUrl)) {
      notification.open({
        message: 'Error Processing your Request',
        description: 'Image must be in format of images/imageName.jpg',
        icon: <Icon type="close-circle" style={{ color: '#f44336' }} />,
      });
      return 0;
    }
    if (this.mode === 'create' && file === null) {
      notification.open({
        message: 'Error Processing your Request',
        description: 'Image Not Given',
        icon: <Icon type="close-circle" style={{ color: '#f44336' }} />,
      });
      return 0;
    }

    if (this.mode === 'edit' && name === '') {
      notification.open({
        message: 'Error Processing your Request',
        description: 'Skill name cannot be empty',
        icon: <Icon type="close-circle" style={{ color: '#f44336' }} />,
      });
      return 0;
    }

    this.setState({
      loading: true,
    });

    if (
      this.mode === 'edit' &&
      this.groupValue === category &&
      this.expertValue === name &&
      this.languageValue === language &&
      !this.state.codeChanged &&
      !this.state.imageNameChanged
    ) {
      notification.open({
        message: 'Please make some changes to save the Skill',
        icon: <Icon type="close-circle" style={{ color: '#f44336' }} />,
      });
      this.setState({
        loading: false,
      });
      return 0;
    }
    let form = new FormData();
    if (this.mode === 'create') {
      form.append('model', 'general');
      form.append('group', category);
      form.append('language', language);
      form.append('skill', name.trim().replace(/\s/g, '_'));
      form.append('image', file);
      form.append('content', code);
      form.append('image_name', imageUrl.replace('images/', ''));
      form.append('access_token', accessToken);
      if (this.isBotBuilder) {
        form.append('private', '1');
      }
      createSkill(form)
        .then(payload => {
          if (payload.accepted === true) {
            if (this.mode === 'create') {
              notification.open({
                message: 'Accepted',
                description: 'Your Skill has been uploaded to the server',
                icon: <Icon type="check-circle" style={{ color: '#00C853' }} />,
              });
            }
            if (!this.props.hasOwnProperty('revertingCommit')) {
              this.props.history.push({
                pathname:
                  '/skills/' +
                  category +
                  '/' +
                  name.trim().replace(/\s/g, '_') +
                  '/' +
                  language,
              });
            }
          } else {
            this.setState({
              loading: false,
            });
            notification.open({
              message: 'Error Processing your Request',
              description: String(payload.message),
              icon: <Icon type="close-circle" style={{ color: '#f44336' }} />,
            });
          }
        })
        .catch(error => {
          this.setState({
            loading: false,
          });
          notification.open({
            message: 'Error Processing your Request',
            description: String(error),
            icon: <Icon type="close-circle" style={{ color: '#f44336' }} />,
          });
        });
    } else {
      let file;
      form.append('OldModel', 'general');
      form.append('OldGroup', this.groupValue);
      form.append('OldLanguage', this.languageValue);
      form.append('OldSkill', this.expertValue);
      form.append('NewModel', 'general');
      form.append('NewGroup', category);
      form.append('NewLanguage', language);
      form.append('NewSkill', name);
      form.append('changelog', this.state.commitMessage);
      form.append('content', code);
      form.append('imageChanged', this.state.imageNameChanged);
      form.append(
        'old_image_name',
        this.state.oldImageUrl.replace('images/', ''),
      );
      form.append('new_image_name', imageUrl.replace('images/', ''));
      form.append('image_name_changed', this.state.imageNameChanged);
      form.append('access_token', accessToken);

      if (this.state.imageNameChanged) {
        // append file to image
        form.append('image', file);
      }

      modifySkill(form)
        .then(payload => {
          if (payload.accepted === true) {
            notification.open({
              message: 'Accepted',
              description: 'Skill has been updated at the server.',
              icon: <Icon type="check-circle" style={{ color: '#00C853' }} />,
            });
            if (!this.props.hasOwnProperty('revertingCommit')) {
              this.props.history.push({
                pathname:
                  '/skills/' +
                  category +
                  '/' +
                  name.trim().replace(/\s/g, '_') +
                  '/' +
                  language,
              });
            }
          } else {
            this.setState({
              loading: false,
            });
            notification.open({
              message: 'Error Processing your Request',
              description: String(payload.message),
              icon: <Icon type="close-circle" style={{ color: '#f44336' }} />,
            });
          }
        })
        .catch(error => {
          this.setState({
            loading: false,
          });
          notification.open({
            message: 'Error Processing your Request',
            description: String(error),
            icon: <Icon type="close-circle" style={{ color: '#f44336' }} />,
          });
        });
    }

    // Uncomment to check the form values
    // console.log(category);
    // console.log(language);
    // console.log(name.trim().replace(/\s/g, '_'));
    // console.log(file);
    // console.log(code);
    // console.log(imageUrl.replace('images/', ''));
  };

  _onChange = event => {
    const { actions } = this.props;
    let { code } = this.props;
    // Assuming only image
    let payload = {};
    let file = this.file.files[0];
    const image = window.URL.createObjectURL(file);
    // console.log(file) // Would see a path?
    if (event.target.files && event.target.files[0]) {
      this.setState({
        showImage: true,
      });
    }
    let imageUrl = file.name;
    const pattern = /^::image\s(.*)$/m;
    code = code.replace(pattern, `::image images/${imageUrl}`);
    payload = { ...payload, file, imageUrl, code, image };
    actions.setSkillData(payload);
  };

  handleCommitMessageChange = event => {
    this.setState({
      commitMessage: event.target.value,
    });
  };

  deleteSkill = () => {
    deleteSkill()
      .then(payload => {
        if (payload.accepted === true) {
          notification.open({
            message: 'Deleted',
            description: 'This Skill has been deleted',
            icon: <Icon type="check-circle" style={{ color: '#00C853' }} />,
          });
          this.setState({
            loading: false,
          });
          this.props.history.push({
            pathname: '/',
            state: {},
          });
        } else {
          notification.open({
            message: 'Failed',
            description: payload.message,
            icon: (
              <Icon
                type="check-circle"
                style={{ color: colors.warningColor }}
              />
            ),
          });
          this.props.history.push({
            pathname: '/',
            state: {},
          });
        }
      })
      .catch(error => {
        console.log('Error while deleting skill', error);
      });
  };

  handleLabel = () => {
    if (this.mode === 'edit') {
      return 'Update';
    }
    return 'Save';
  };

  render() {
    const {
      accessToken,
      actions,
      view,
      category,
      language,
      name,
      image,
    } = this.props;
    const { showImage, loadViews } = this.state;
    let showTopBar = true;
    if (this.props.hasOwnProperty('showTopBar')) {
      showTopBar = this.props.showTopBar;
    }
    if (this.mode === 'create' && !accessToken) {
      if (this.mode === 'create') {
        return (
          <div>
            <div>
              <LoggedInErrorPara>
                Please login to create a skill.
              </LoggedInErrorPara>
            </div>
          </div>
        );
      }
    }

    return (
      <div style={{ marginTop: '3rem' }}>
        <div
          style={{
            padding: this.isBotBuilder ? '0rem' : '0rem 1.875rem 1.875rem',
            width: '100%',
          }}
        >
          <Grid fluid>
            <Row>
              <Col
                md={this.state.colSkill}
                style={{
                  display: this.state.colSkill === 0 ? 'none' : 'block',
                }}
              >
                {this.mode === 'edit' &&
                  accessToken &&
                  !this.props.revertingCommit &&
                  this.commitId &&
                  showTopBar && (
                    <EditPaper zDepth={1}>
                      <div>
                        {
                          'You are currently editing an older version of the Skill: '
                        }
                        <B>{this.expertValue}</B>
                        <br />
                        <span>
                          Author: <B>{this.state.author}</B>
                        </span>
                        <br />
                        <span>
                          commitID: <b>{this.commitId}</b>
                        </span>
                        <br />
                        <span>
                          Revision as of <b>{this.state.date}</b>
                        </span>
                      </div>
                    </EditPaper>
                  )}
                {!accessToken && (
                  <div>
                    <HomeDiv>
                      <TitlePara>
                        YOU DO NOT HAVE PERMISSION TO EDIT THIS PAGE, SINCE YOU
                        ARE NOT LOGGED IN.
                      </TitlePara>
                      <DescriptionPara>
                        The code is shown below in a read only mode.
                      </DescriptionPara>
                    </HomeDiv>
                  </div>
                )}
                {accessToken &&
                  this.mode === 'edit' &&
                  !this.state.editable &&
                  !this.state.showAdmin && (
                    <HomeDiv>
                      <TitlePara>
                        THIS SKILL IS NOT EDITABLE. IT IS CURRENTLY LOCKED BY
                        ADMINS. YOU CAN STILL SEE THE CODE OF THE SKILL.
                      </TitlePara>
                      <SubTitlePara>
                        There can be various reasons for non-editable skills.{' '}
                        <br />
                        For example if the skill is a standard skill, if there
                        was vandalism happening in the skill or if there is a
                        dispute about the skill.
                      </SubTitlePara>
                      <DescriptionPara>
                        The code is shown below in a read only mode.
                      </DescriptionPara>
                    </HomeDiv>
                  )}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    paddingTop: this.isBotBuilder ? '0rem' : '1.75rem',
                  }}
                >
                  {this.isBotBuilder ? (
                    <h1 style={{ lineHeight: '3.125rem' }}>
                      1. Add a new skill to your bot
                    </h1>
                  ) : (
                    this.mode === 'create' && (
                      <Heading>Create a SUSI Skill</Heading>
                    )
                  )}
                  <div
                    style={{
                      marginLeft: 'auto',
                      marginRight: this.isBotBuilder ? '0rem' : '1.875rem',
                    }}
                  >
                    <IconButton
                      className="iconbutton"
                      onClick={() => actions.setView({ view: 'code' })}
                    >
                      <Code color={view === 'code' ? 'primary' : 'inherit'} />
                    </IconButton>
                    <IconButton
                      className="iconbutton"
                      onClick={() => actions.setView({ view: 'conversation' })}
                    >
                      <QA
                        color={view === 'conversation' ? 'primary' : 'inherit'}
                      />
                    </IconButton>
                    <IconButton
                      className="iconbutton"
                      onClick={() => actions.setView({ view: 'tree' })}
                    >
                      <Timeline
                        color={view === 'tree' ? 'primary' : 'inherit'}
                      />
                    </IconButton>
                  </div>
                </div>
                <ReactTooltip
                  effect="solid"
                  place="bottom"
                  className="tooltipSkill"
                  delayHide={500}
                  html={true}
                />
                {accessToken && this.state.editable && (
                  <Paper>
                    <InfoIcon
                      data-tip={`Learn more about <a href=${urls.GITHUB_URL +
                        '/blob/master/docs/Skill_Tutorial.md'} rel="noopener noreferrer" target="_blank" >SUSI Skill Language</a>`}
                    />
                    <CenterDiv>
                      <DropDownDiv>
                        <div>
                          <span
                            style={{
                              fontSize: 15,
                              paddingTop: '2.688rem',
                              paddingLeft: '.625rem',
                            }}
                          >
                            Category:&nbsp;
                          </span>
                          <Select
                            value={category}
                            onChange={this.handleGroupChange}
                            autoWidth={true}
                            style={{
                              position: 'relative',
                              width: '15.625rem',
                            }}
                          >
                            {this.state.groups}
                          </Select>
                        </div>
                        <div>
                          <span
                            style={{
                              fontSize: 15,
                              paddingTop: '.5rem',
                              marginLeft: '.625rem',
                            }}
                          >
                            Language:&nbsp;
                          </span>
                          <Select
                            disabled={this.state.languageSelect}
                            value={language}
                            onChange={this.handleLanguageChange}
                            autoWidth={true}
                            style={{
                              position: 'relative',
                              width: '15.625rem',
                            }}
                          >
                            {languages}
                          </Select>
                        </div>
                        <TextField
                          disabled={this.state.expertSelect}
                          label={this.isBotBuilder ? 'Bot Name' : 'Skill Name'}
                          placeholder={
                            this.isBotBuilder ? 'Bot Name' : 'Skill Name'
                          }
                          margin="normal"
                          value={name}
                          style={{
                            marginLeft: 10,
                            marginRight: 10,
                            width: 'auto',
                          }}
                          onChange={this.handleExpertChange}
                        />
                        <div
                          style={{
                            width: 'auto',
                            paddingTop: 20,
                          }}
                        >
                          {showImage && (
                            <img
                              alt="preview"
                              id="target"
                              style={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                marginRight: 20,
                                border: 0,
                              }}
                              src={image}
                            />
                          )}
                          <form style={{ display: 'inline-block' }}>
                            <UploadCircularButton title="Upload bot image">
                              <input
                                accept="image/*"
                                type="file"
                                ref={c => {
                                  this.file = c;
                                }}
                                name="user[image]"
                                multiple={false}
                                onChange={this._onChange}
                              />
                              <Add
                                style={{
                                  height: '1.875rem',
                                  marginTop: '.938rem',
                                  color: '#4285F5',
                                }}
                              />
                            </UploadCircularButton>
                          </form>
                        </div>
                      </DropDownDiv>
                    </CenterDiv>
                  </Paper>
                )}
                {!loadViews ? (
                  <div className="center" style={{ padding: 10 }}>
                    <CircularProgress size={62} />
                    <h4>Loading</h4>
                  </div>
                ) : null}
                {view === 'code' && loadViews ? (
                  <CodeView editable={accessToken && this.state.editable} />
                ) : null}
                {view === 'conversation' && loadViews ? (
                  <ConversationView />
                ) : null}
                {view === 'tree' && loadViews ? (
                  <TreeView botbuilder={false} />
                ) : null}
                {!this.isBotBuilder && accessToken && this.state.editable && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 10,
                    }}
                  >
                    <Paper
                      style={{
                        width: '100%',
                        padding: 10,
                        display: 'flex',
                        alignItems: 'center',
                        textAlign: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <TextField
                        label="Commit message"
                        placeholder="Enter Commit Message"
                        margin="normal"
                        value={this.state.commitMessage}
                        style={{ width: '100%' }}
                        onChange={this.handleCommitMessageChange}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ marginLeft: 10 }}
                        onClick={this.saveClick}
                      >
                        {this.state.loading ? (
                          <CircularProgress color="#ffffff" size={32} />
                        ) : (
                          this.handleLabel()
                        )}
                      </Button>
                      <Link
                        to={
                          this.mode === 'create'
                            ? '/skills'
                            : {
                                pathname:
                                  '/skills/' +
                                  category +
                                  '/' +
                                  name +
                                  '/' +
                                  language,
                              }
                        }
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ marginLeft: 10 }}
                        >
                          Cancel
                        </Button>
                      </Link>
                    </Paper>
                    {this.state.prevButton === 1 ? (
                      <div
                        className="preview-button"
                        style={{ top: '4.25rem' }}
                      >
                        <span title="See Preview">
                          <ChevronLeftIcon onClick={this.handlePreviewToggle} />
                        </span>
                      </div>
                    ) : null}
                  </div>
                )}
                {this.mode === 'edit' && this.state.showAdmin && (
                  <Paper
                    style={{
                      width: '100%',
                      border: '.063rem solid red',
                      marginTop: 20,
                      padding: '1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ margineft: '0rem' }}>
                      <strong>
                        <p>Delete this Skill</p>
                      </strong>
                      {'Once you delete a skill, only admins can' +
                        'undo this action before 30 days of deletion. Please be certain.'}
                    </div>
                    <Button
                      variant="contained"
                      color="secondary"
                      style={{ marginLeft: 10 }}
                      onClick={this.handleDeleteModal}
                    >
                      Delete
                    </Button>
                  </Paper>
                )}
              </Col>
              {this.isBotBuilder ? null : (
                <Col
                  className="skillcreator-col"
                  id="skillcreator-col"
                  xs={12}
                  md={this.state.colPreview}
                  style={{
                    display: this.state.colPreview === 0 ? 'none' : 'block',
                  }}
                >
                  <Paper
                    style={{
                      height: '99.9%',
                      marginTop: '1.25rem',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <span title="collapse preview">
                        <ChevronRightIcon onClick={this.handlePreviewToggle} />
                      </span>
                      <h2 style={{ margin: 'auto' }}>Preview</h2>
                    </div>
                    <div
                      style={{
                        position: 'relative',
                        overflow: 'hidden',
                        marginTop: '1.25rem',
                      }}
                    >
                      <Preview botBuilder={false} />
                    </div>
                  </Paper>
                </Col>
              )}
            </Row>
          </Grid>
        </div>
      </div>
    );
  }
}

SkillCreator.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  showTopBar: PropTypes.bool,
  revertingCommit: PropTypes.string,
  botBuilder: PropTypes.object,
  accessToken: PropTypes.string,
  email: PropTypes.string,
  userName: PropTypes.string,
  isAdmin: PropTypes.bool,
  actions: PropTypes.object,
  code: PropTypes.string,
  view: PropTypes.string,
  imageUrl: PropTypes.string,
  name: PropTypes.string,
  language: PropTypes.string,
  category: PropTypes.string,
  image: PropTypes.string,
  file: PropTypes.object,
};

function mapStateToProps(store) {
  return {
    userName: store.settings.userName,
    accessToken: store.app.accessToken,
    isAdmin: store.app.isAdmin,
    email: store.app.email,
    skill: store.create.skill,
    view: store.create.view,
    category: store.create.skill.category,
    language: store.create.skill.language,
    name: store.create.skill.name,
    imageUrl: store.create.skill.imageUrl,
    image: store.create.skill.image,
    code: store.create.skill.code,
    file: store.create.skill.file,
  };
}

function mapDispatchToActions(dispatch) {
  return {
    actions: bindActionCreators({ ...uiActions, ...createActions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToActions,
)(SkillCreator);

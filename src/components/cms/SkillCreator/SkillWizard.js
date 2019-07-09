import React, { Component } from 'react';
import { connect } from 'react-redux';
import CodeView from './SkillViews/CodeView';
import ConversationView from './SkillViews/ConversationView';
import TreeView from './SkillViews/TreeView';
import Preview from '../BotBuilder/Preview/Preview';
import { urls } from '../../../utils';
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
import { bindActionCreators } from 'redux';

import {
  fetchAllGroupOptions,
  fetchAllLanguageOptions,
  fetchSkillMetaData,
  deleteSkill,
  modifySkill,
  createSkill,
} from '../../../apis';

import CircularLoader from '../../shared/CircularLoader';

import './Animation.min.css';

// Material-UI Components
import _Button from '@material-ui/core/Button';
import _Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import _IconButton from '@material-ui/core/IconButton';
import styled from 'styled-components';

// Material-UI Icons
import Info from '@material-ui/icons/Info';
import Code from '@material-ui/icons/Code';
import QA from '@material-ui/icons/QuestionAnswer';
import Timeline from '@material-ui/icons/Timeline';
import Add from '@material-ui/icons/Add';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import avatars from '../../../utils/avatars';

const Home = styled.div`
  margin-top: 3rem;
`;

const Paper = styled(_Paper)`
  width: 100%;
  margin-top: 1.25rem;
  padding: 1.25rem 1.875rem 1.875rem;
  @media (max-width: 514px) {
    padding: 0px;
    margin-bottom: 2rem;
  }
`;

const IconButton = styled(_IconButton)`
  @media (max-width: 451px) {
    padding-left: 3px;
    padding-right: 3px;
  }
`;

const SelectDropDown = styled(Select)`
  position: relative;
  width: 15.625rem;
  @media (max-width: 500px) {
    width: 100%;
    padding-top: 0.5rem;
  }
`;

const Container = styled.div`
  width: 100%;
  @media (max-width: 1200px) {
    padding: 0px;
  }
`;

const DropDownDiv = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  @media (max-width: 813px) {
    width: 100%;
    padding: 0.7rem;
  }
`;

const SkillDetail = styled.div`
  @media (max-width: 813px) {
    display: flex;
    width: 100%;
    margin-top: 1rem;
  }
`;

const NameField = styled(TextField)`
  margin: 16px 10px;
  width: auto;

  @media (max-width: 500px) {
    margin: 10px;
    width: 100%;
  }
`;

const CommitField = styled(TextField)`
  width: 100%;

  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`;

const Heading = styled.h1`
  line-height: 3.125rem;

  @media (max-width: 480px) {
    line-height: 2.5rem;
  }
`;

const DetailText = styled.span`
  font-size: 15;
  padding-left: 0.625rem;
  padding-top: 0.5rem;

  @media (max-width: 414px) {
    padding-left: 0px;
  }
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

const SavePaper = styled(_Paper)`
  width: 100%;
  padding: 10px;
  align-items: center;
  text-align: center;
  justify-content: center;
  display: flex;
  @media (max-width: 500px) {
    display: block;
    text-align: right;
  }
`;

const B = styled.b`
  font-size: 0.875rem;
`;

const CenterDiv = styled.div`
  display: flex;
  justify-content: left;
  width: 100%;
`;

const InfoIcon = styled(Info)`
  position: relative;
  float: right;
  height: 1.25rem;
  width: 1.25rem;
  cursor: pointer;
  color: #9e9e9e;
  display: inline-bock;
  position: absolute;
  right: 5px;
  top: 5px;
`;

const ChevronLeftIcon = styled(ChevronLeft)`
  position: absolute;
  left: 0.25rem;
  top: 0.25rem;
  width: 2.188rem;
  height: 2.188rem;
  color: #ffffff;
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
  @media (max-width: 514px) {
    top: 0px;
    left: 0px;
  }
`;

const Input = styled.input`
  display: none;
`;

const SkillCreatorCol = styled(Col)`
  position: fixed;
  margin-left: 65%;
  height: 88%;
  margin-top: 10px;
  padding-right: 30px;
  width: 100%;

  @media (max-width: 1200px) {
    position: inherit;
    margin-left: 0px;
    margin-bottom: 40px;
    padding-right: 10px;
  }
`;

const ViewsDiv = styled.div`
  margin-left: auto;
`;

const SkillInfoDiv = styled.div`
  display: flex;
  text-align: center;
`;

const SkillEditPaper = styled(Paper)`
  position: relative;
`;

const Form = styled.form`
  display: inline-block;
`;

const DeleteSkillPaper = styled(Paper)`
  width: 100%;
  border: 0.063rem solid red;
  margin-top: 20px;
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
`;

const Button = styled(_Button)`
  margin-left: 10px;
`;

const AddIcon = styled(Add)`
  height: 1.875rem;
  margin-top: 0.938rem;
  color: #4285f5;
`;

const Img = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 20px;
  bottom: 1.5rem;
  position: relative;
`;

const ImageDiv = styled.div`
  width: auto;
  padding-top: 20px;

  @media (max-width: 500px) {
    margin-left: 10px;
  }
`;

const SkillCommitDiv = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const H2 = styled.h2`
  margin: 0px auto;
`;

const PreviewPaper = styled(Paper)`
  margin-top: 1.25rem;
  position: relative;
  width: 90%;

  @media (max-width: 1200px) {
    width: 100%;
  }
`;

const PreviewContainer = styled.div`
  position: relative;
  overflow: hidden;
  margin-top: 1.25rem;
`;

const PreviewHeadingDiv = styled.div`
  display: flex;
`;

const ReactToolTip = styled(ReactTooltip)`
  pointer-events: auto;

  &:hover {
    visibility: visible;
    opacity: 1;
  }
`;

const PreviewButton = styled.div`
  height: 45px;
  width: 42px;
  position: fixed;
  z-index: 1;
  top: 75px;
  right: 0;
  background-color: rgb(158, 158, 158);
  overflow-x: hidden;
  padding-top: 20px;
`;

const DropDownWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

class SkillWizard extends Component {
  constructor(props) {
    super(props);

    this.isBotBuilder = window.location.pathname.split('/')[1] === 'botbuilder';

    let commonState = {
      groups: [],
      languages: [],
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
      this.props.location.pathname.split('/')[3] === 'edit'
    ) {
      const { pathname } = this.props.location;
      this.mode = 'edit';
      this.groupValue = pathname.split('/')[1];
      this.languageValue = pathname.split('/')[4];
      this.expertValue = pathname.split('/')[3];
      this.commitId = pathname.split('/')[5];

      let commitMessage = `Updated Skill ${this.expertValue}`;
      if (this.props.hasOwnProperty('revertingCommit')) {
        commitMessage = 'Reverting to commit - ' + this.props.revertingCommit;
      } else if (this.commitId) {
        commitMessage = `Reverting to commit - ${this.commitId}`;
      }
      this.state = {
        ...commonState,
        loading: false,
        commitMessage,
        codeChanged: false,
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
        showImage: avatars.slice()[1].url !== this.props.image,
        loading: false,
        commitMessage: '',
        slideState: 1, // 1 means in middle, 2 means preview collapsed
        colSkill: 8,
        colPreview: 4,
        prevButton: 0, // 0 means disappear, 1 means appear
      };
    }
  }

  loadLanguages() {
    if (this.state.languages.length === 0) {
      fetchAllLanguageOptions()
        .then(payload => {
          const data = payload.languagesArray;
          let languages = data.map(language => {
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
          languages.sort(function(a, b) {
            if (a.props.primaryText < b.props.primaryText) {
              return -1;
            }
            if (a.props.primaryText > b.props.primaryText) {
              return 1;
            }
            return 0;
          });
          this.setState({ languages });
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
    this.loadLanguages();
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
    actions.setSkillData({ category: event.target.value, code });
  };

  handleLanguageChange = (event, index, value) => {
    const { actions } = this.props;
    let { code } = this.props;
    code = code.replace(
      /^::language\s(.*)$/m,
      `::language ${event.target.value}`,
    );
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

  // eslint-disable-next-line complexity
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
    if (this.mode !== 'edit') {
      code = '::author_email ' + email + '\n' + code;
      if (this.isBotBuilder) {
        code = '::protected Yes\n' + code;
      } else {
        code = '::protected No\n' + code;
      }
    }

    if (this.state.commitMessage === null) {
      this.props.actions.openSnackBar({
        snackBarMessage: 'Please add a commit message',
        snackBarPosition: { vertical: 'top', horizontal: 'right' },
        variant: 'warning',
      });
      return 0;
    }

    if (!accessToken) {
      this.props.actions.openSnackBar({
        snackBarMessage: 'Please login and then try to create/edit a skill',
        snackBarPosition: { vertical: 'top', horizontal: 'right' },
        variant: 'warning',
      });
      return 0;
    }
    if (category === null || language === '' || name === '') {
      this.props.actions.openSnackBar({
        snackBarMessage: 'Please select a group, language and a skill',
        snackBarPosition: { vertical: 'top', horizontal: 'right' },
        variant: 'warning',
      });
      return 0;
    }
    if (!new RegExp(/.+\.\w+/g).test(imageUrl)) {
      this.props.actions.openSnackBar({
        snackBarMessage: 'Image must be in format of images/imageName.jpg',
        snackBarPosition: { vertical: 'top', horizontal: 'right' },
        variant: 'warning',
      });
      return 0;
    }
    if (this.mode === 'create' && file === null) {
      this.props.actions.openSnackBar({
        snackBarMessage: 'Image Not Given',
        snackBarPosition: { vertical: 'top', horizontal: 'right' },
        variant: 'warning',
      });
      return 0;
    }

    if (this.mode === 'edit' && name === '') {
      this.props.actions.openSnackBar({
        snackBarMessage: 'Skill name cannot be empty',
        snackBarPosition: { vertical: 'top', horizontal: 'right' },
        variant: 'warning',
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
      this.props.actions.openSnackBar({
        snackBarMessage: 'Please make some changes to save the Skill',
        snackBarPosition: { vertical: 'top', horizontal: 'right' },
        variant: 'warning',
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
              this.props.actions.openSnackBar({
                snackBarMessage: 'Your Skill has been uploaded to the server',
                snackBarPosition: { vertical: 'top', horizontal: 'right' },
                variant: 'success',
              });
            }
            if (!this.props.hasOwnProperty('revertingCommit')) {
              this.props.history.push({
                pathname:
                  '/' +
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
            this.props.actions.openSnackBar({
              snackBarMessage: String(payload.message),
              snackBarPosition: { vertical: 'top', horizontal: 'right' },
              variant: 'error',
            });
          }
        })
        .catch(error => {
          this.setState({
            loading: false,
          });
          this.props.actions.openSnackBar({
            snackBarMessage: String(error),
            snackBarPosition: { vertical: 'top', horizontal: 'right' },
            variant: 'error',
          });
        });
    } else {
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
            this.props.actions.openSnackBar({
              snackBarMessage: 'Skill has been updated at the server',
              snackBarPosition: { vertical: 'top', horizontal: 'right' },
              variant: 'success',
            });
            if (!this.props.hasOwnProperty('revertingCommit')) {
              this.props.history.push({
                pathname:
                  '/' +
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
            this.props.actions.openSnackBar({
              snackBarMessage: String(payload.message),
              snackBarPosition: { vertical: 'top', horizontal: 'right' },
              variant: 'error',
            });
          }
        })
        .catch(error => {
          this.setState({
            loading: false,
          });
          this.props.actions.openSnackBar({
            snackBarMessage: String(error),
            snackBarPosition: { vertical: 'top', horizontal: 'right' },
            variant: 'error',
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
    if (this.props.imageUrl !== `images/${imageUrl}`) {
      this.setState({
        imageNameChanged: true,
      });
    }
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
          this.props.actions.openSnackBar({
            snackBarMessage: 'This Skill has been deleted',
            snackBarPosition: { vertical: 'top', horizontal: 'right' },
            variant: 'success',
          });
          this.setState({
            loading: false,
          });
          this.props.history.push({
            pathname: '/',
            state: {},
          });
        } else {
          this.props.actions.openSnackBar({
            snackBarMessage: payload.message,
            snackBarPosition: { vertical: 'top', horizontal: 'right' },
            variant: 'warning',
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

  // eslint-disable-next-line complexity
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

    return (
      <Home>
        <Container
          style={
            this.isBotBuilder ? null : { padding: '0rem 1.875rem 1.875rem' }
          }
        >
          <Grid fluid style={this.isBotBuilder ? { padding: '0px' } : null}>
            <Row>
              <Col
                md={12}
                xl={this.state.colSkill}
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
                <SkillInfoDiv
                  style={{
                    paddingTop: this.isBotBuilder ? '0rem' : '1.75rem',
                  }}
                >
                  {this.isBotBuilder ? (
                    <Heading>1. Add a new skill to your bot</Heading>
                  ) : (
                    this.mode === 'create' && (
                      <Heading>Create a SUSI Skill</Heading>
                    )
                  )}
                  <ViewsDiv>
                    <IconButton
                      onClick={() => actions.setView({ view: 'code' })}
                    >
                      <Code color={view === 'code' ? 'primary' : 'inherit'} />
                    </IconButton>
                    <IconButton
                      onClick={() => actions.setView({ view: 'conversation' })}
                    >
                      <QA
                        color={view === 'conversation' ? 'primary' : 'inherit'}
                      />
                    </IconButton>
                    <IconButton
                      onClick={() => actions.setView({ view: 'tree' })}
                    >
                      <Timeline
                        color={view === 'tree' ? 'primary' : 'inherit'}
                      />
                    </IconButton>
                  </ViewsDiv>
                </SkillInfoDiv>
                <ReactToolTip
                  effect="solid"
                  place="bottom"
                  delayHide={500}
                  html={true}
                />
                {accessToken && this.state.editable && (
                  <SkillEditPaper>
                    <InfoIcon
                      data-tip={`Learn more about <a href=${urls.GITHUB_URL +
                        '/blob/master/docs/Skill_Tutorial.md'} rel="noopener noreferrer" target="_blank" >SUSI Skill Language</a>`}
                    />
                    <CenterDiv>
                      <DropDownDiv>
                        <DropDownWrap>
                          <SkillDetail>
                            <DetailText>Category:&nbsp;</DetailText>
                            <SelectDropDown
                              value={category}
                              onChange={this.handleGroupChange}
                              autoWidth={true}
                            >
                              {this.state.groups}
                            </SelectDropDown>
                          </SkillDetail>
                          <SkillDetail>
                            <DetailText>Language:&nbsp;</DetailText>
                            <SelectDropDown
                              value={language}
                              onChange={this.handleLanguageChange}
                              autoWidth={true}
                            >
                              {this.state.languages}
                            </SelectDropDown>
                          </SkillDetail>
                        </DropDownWrap>
                        <NameField
                          label={this.isBotBuilder ? 'Bot Name' : 'Skill Name'}
                          placeholder={
                            this.isBotBuilder ? 'Bot Name' : 'Skill Name'
                          }
                          margin="normal"
                          value={name}
                          onChange={this.handleExpertChange}
                        />
                        <ImageDiv>
                          {showImage && (
                            <Img alt="preview" id="target" src={image} />
                          )}
                          <Form>
                            <UploadCircularButton title="Upload bot image">
                              <Input
                                accept="image/*"
                                type="file"
                                ref={c => {
                                  this.file = c;
                                }}
                                name="user[image]"
                                multiple={false}
                                onChange={this._onChange}
                              />
                              <AddIcon />
                            </UploadCircularButton>
                          </Form>
                        </ImageDiv>
                      </DropDownDiv>
                    </CenterDiv>
                  </SkillEditPaper>
                )}
                {!loadViews ? <CircularLoader height={10} /> : null}
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
                  <SkillCommitDiv>
                    <SavePaper>
                      <CommitField
                        label="Commit message"
                        placeholder="Enter Commit Message"
                        margin="normal"
                        value={this.state.commitMessage}
                        onChange={this.handleCommitMessageChange}
                      />
                      <Button
                        variant="contained"
                        color="primary"
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
                            ? '/'
                            : {
                                pathname:
                                  '/' + category + '/' + name + '/' + language,
                              }
                        }
                      >
                        <Button variant="contained" color="primary">
                          Cancel
                        </Button>
                      </Link>
                    </SavePaper>
                  </SkillCommitDiv>
                )}
                {this.state.prevButton === 1 ? (
                  <PreviewButton>
                    <span title="See Preview">
                      <ChevronLeftIcon onClick={this.handlePreviewToggle} />
                    </span>
                  </PreviewButton>
                ) : null}
                {this.mode === 'edit' && this.state.showAdmin && (
                  <DeleteSkillPaper>
                    <div>
                      <strong>
                        <p>Delete this Skill</p>
                      </strong>
                      {'Once you delete a skill, only admins can' +
                        'undo this action before 30 days of deletion. Please be certain.'}
                    </div>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={this.handleDeleteModal}
                    >
                      Delete
                    </Button>
                  </DeleteSkillPaper>
                )}
              </Col>
              {this.isBotBuilder ? null : (
                <SkillCreatorCol
                  md={12}
                  xl={this.state.colPreview}
                  style={{
                    display: this.state.colPreview === 0 ? 'none' : 'block',
                  }}
                >
                  <PreviewPaper>
                    <PreviewHeadingDiv>
                      <span title="collapse preview">
                        <ChevronRightIcon onClick={this.handlePreviewToggle} />
                      </span>
                      <H2>Preview</H2>
                    </PreviewHeadingDiv>
                    <PreviewContainer>
                      <Preview botBuilder={false} />
                    </PreviewContainer>
                  </PreviewPaper>
                </SkillCreatorCol>
              )}
            </Row>
          </Grid>
        </Container>
      </Home>
    );
  }
}

SkillWizard.propTypes = {
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
)(SkillWizard);

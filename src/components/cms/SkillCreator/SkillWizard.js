import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import CodeView from './SkillViews/CodeView';
import ConversationView from './SkillViews/ConversationView';
import TreeView from './SkillViews/TreeView';
import Preview from '../BotBuilder/Preview/Preview';
import Button from '../../shared/Button';
import searchURLPath from '../../../utils/searchURLPath';
import getQueryStringValue from '../../../utils/getQueryStringValue';
import createActions from '../../../redux/actions/create';
import uiActions from '../../../redux/actions/ui';
import CircularProgress from '@material-ui/core/CircularProgress';
import Switch from '@material-ui/core/Switch';
import QuestionIcon from '@material-ui/icons/ContactSupport';
import Popover from '@material-ui/core/Popover';
import { Link } from 'react-router-dom';
import ISO6391 from 'iso-639-1';
import ReactTooltip from 'react-tooltip';
import { Grid, Col, Row } from 'react-flexbox-grid';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import _Check from '@material-ui/icons/Check';
import {
  StyledPaper,
  Heading,
  HeadingContainer,
  Container as PaperContainer,
} from '../BotBuilder/styles';

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
import _Paper from '@material-ui/core/Paper';
import OutlinedTextField from '../../shared/OutlinedTextField';
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

const IconButton = styled(_IconButton)`
  @media (max-width: 451px) {
    padding-left: 3px;
    padding-right: 3px;
  }
`;

const DeleteButton = styled(Button)`
  background: #f44336;
  color: white;
  height: 3rem;

  :hover {
    background: #f44336ee;
  }
`;

const OutlinedSelectField = styled(OutlinedTextField)`
  position: relative;
  width: 100%;
  margin-top: 0px;
  margin-bottom: 0px;
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
  width: 100%;
  @media (max-width: 813px) {
    width: 100%;
    padding: 0.7rem;
  }
`;

const SkillDetail = styled.div`
  display: block;
  align-items: center;
  margin-right: 1rem;
  width: calc(25% - 1rem);
  box-sizing: border-box;

  @media (max-width: 813px) {
    width: 15.625rem;
    margin-top: 1rem;
  }
  @media (min-width: 2000px) {
    margin-right: 3rem;
  }
`;

const OutlinedInput = styled(OutlinedTextField)`
  width: 100%;
  margin-top: 0px;
  margin-bottom: 0px;
  @media (max-width: 500px) {
    width: 100%;
  }
`;

const CommitField = styled(OutlinedTextField)`
  width: 100%;
  margin-right: 1rem;
`;

const UploadCircularButton = styled.label`
  border-radius: 50%;
  height: 56px;
  width: 56px;
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
  padding: 1rem;
  align-items: center;
  text-align: center;
  justify-content: center;
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
  height: 2rem;
  width: 2rem;
  cursor: pointer;
  color: rgb(66, 133, 244);
  display: inline-bock;
  right: 0px;
  top: 0px;
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

const Input = styled.input`
  display: none;
`;

const PreviewCol = styled(Col)`
  height: 88%;
  position: sticky;
  margin-left: 0;
  top: 0px;
  @media (max-width: 1200px) {
    position: inherit;
    margin-left: 0px;
    margin-bottom: 40px;
  }
`;

const ViewsDiv = styled.div`
  margin-left: auto;
  display: flex;
`;

const Form = styled.form`
  display: inline-block;
`;

const DeleteSkillSection = styled(PaperContainer)`
  border: 0.063rem solid red;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AddIcon = styled(Add)`
  height: 1.875rem;
  margin-top: 0.938rem;
  color: #4285f5;
`;

const Img = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  margin-right: 20px;
  position: relative;
`;

const ImageDiv = styled.div`
  width: auto;

  @media (max-width: 813px) {
    padding-top: 1rem;
  }
`;

const SkillCommitDiv = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  margin: 0 2rem;

  @media (max-width: 480px) {
    margin: 0 1rem;
  }
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
  top: 70px;
  right: 0;
  background-color: #9e9e9e;
  overflow-x: hidden;
  padding-top: 20px;
`;

const DropDownWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 1.25rem;
`;

const Check = styled(_Check)`
  display: block;
  position: absolute;
  top: -9px;
  right: 0px;
  font-size: 23px;
  color: #4285f5;
`;

const IconWrap = styled.span`
  display: inline-block;
  position: relative;
`;

const Text = styled.div`
  padding: 1rem;
  width: 300px;
  background-color: #f4f4f4;
`;

const DetailText = styled.span`
  font-size: 15px;
  padding-left: 0.625rem;
  margin-right: 0.5rem;
  @media (max-width: 414px) {
    padding-left: 0px;
  }
`;

const FlexWrapper = styled.div`
  display: flex;
  @media (max-width: 480px) {
    display: block;
  }
`;

class SkillWizard extends Component {
  constructor(props) {
    super(props);

    this.isBotBuilder = window.location.pathname.split('/')[1] === 'botWizard';

    let commonState = {
      groups: [],
      languages: [],
      loadViews: false,
      editable: true,
      anchorEl: null,
      publicSkill: true,
    };

    if (
      searchURLPath('name') &&
      searchURLPath('group') &&
      searchURLPath('language')
    ) {
      this.skillTag = getQueryStringValue('name');
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
      this.skillTag = pathname.split('/')[2];
      this.commitId = pathname.split('/')[5];

      let commitMessage = `Updated Skill ${this.skillTag}`;
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
        slideState: 1, // 1 means in middle, 2 means preview collapsed
        colSkill: this.props.hasOwnProperty('revertingCommit') ? 12 : 8,
        colPreview: this.props.hasOwnProperty('revertingCommit') ? 0 : 4,
        prevButton: 0, // 0 means disappear, 1 means appear
      };
    } else {
      this.mode = 'create';
      this.state = {
        ...commonState,
        loading: false,
        commitMessage: '',
        slideState: 1, // 1 means in middle, 2 means preview collapsed
        colSkill: 8,
        colPreview: 4,
        prevButton: 0, // 0 means disappear, 1 means appear
      };
    }

    this.skillData = {
      model: 'general',
      group: this.groupValue,
      language: this.languageValue,
      skill: this.skillTag,
    };
  }

  async loadLanguages() {
    if (this.state.languages.length === 0) {
      try {
        let payload = await fetchAllLanguageOptions();
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
      } catch (error) {
        console.log('Error while fetching languages', error);
      }
    }
  }

  componentWillUnmount() {
    if (!this.isBotBuilder) {
      const { actions } = this.props;
      actions.resetCreateStore();
    }
  }

  componentDidMount = async () => {
    // Check if admin is logged in or not
    const { actions } = this.props;
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
        skill: this.skillTag,
        group: this.groupValue,
        language: this.languageValue,
        model: 'general',
      };

      try {
        let skillData = await fetchSkillMetaData(payload);
        this.setState({
          editable: skillData.skillMetadata.editable,
          loadViews: true,
        });
      } catch (error) {
        console.log('Error while fetching skill metadata', error);
      }

      actions.setSkillData({
        name: this.skillTag,
        category: this.groupValue,
        language: this.languageValue,
      });

      if (this.mode === 'edit') {
        document.title = 'SUSI.AI - Edit Skill';
        if (this.commitId) {
          let skillByCommitId = await actions.getSkillByCommitId({
            ...payload,
            commitID: this.commitId,
          });
          this.setState({
            author: skillByCommitId.author,
            date: skillByCommitId.commitDate,
            loadViews: true,
          });
          const match = skillByCommitId.file.match(/^::image\s(.*)$/m);
          if (match != null) {
            this.setState({ codeChanged: true });
          }
        }
        // Edit already existing Skill
        try {
          let skillCode = await actions.getSkillCode(payload);
          const {
            payload: { text: code },
          } = skillCode;
          const match = code.match(/^::image\s(.*)$/m);
          if (match !== null) {
            this.setState({
              codeChanged: true,
              loadViews: true,
            });
          }
        } catch (error) {
          console.log('Error while fetching skill', error);
        }
      } else if (
        searchURLPath('name') &&
        searchURLPath('group') &&
        searchURLPath('language')
      ) {
        let dataForBotBuilderCode = { ...payload, private: 1 };
        try {
          let payload = await actions.getBotBuilderCode(dataForBotBuilderCode);
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
        } catch (error) {
          console.log('Error while fetching skill', error);
        }
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

  async loadgroups() {
    if (this.state.groups.length === 0) {
      try {
        let payload = await fetchAllGroupOptions();
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
      } catch (error) {
        console.log('Error while fetching groups', error);
      }
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
      modalType: 'deleteSkill',
      handleConfirm: this.deleteSkill,
      handleClose: this.props.actions.closeModal,
      name: this.skillData.skill,
    });
  };

  getSnackbarMessage = (language, category, name) => {
    let fields = [];
    let message = 'Please do not leave the ';
    if (language === '') {
      fields.push('language');
    }
    if (category === null) {
      fields.push('category');
    }
    if (name === '') {
      fields.push('name');
    }
    let length = fields.length;
    fields.map((field, index) => {
      if (index === length - 2) {
        message += field + ' and ';
      } else if (index === length - 1) {
        message += field;
      } else {
        message += field + ' , ';
      }
      return field;
    });
    if (length > 1) {
      message += ' fields empty';
    } else {
      message += ' field empty';
    }
    return message;
  };
  // eslint-disable-next-line complexity
  saveClick = async () => {
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

    if (language === '' || category === null || name === '') {
      let message = this.getSnackbarMessage(language, category, name);
      this.props.actions.openSnackBar({
        snackBarMessage: message,
        snackBarPosition: { vertical: 'top', horizontal: 'right' },
        variant: 'warning',
      });
      return 0;
    }

    if (
      !new RegExp(/.+\.\w+/g).test(imageUrl) &&
      !(
        imageUrl === '<image_name>' ||
        imageUrl === 'images/<image_name>' ||
        imageUrl === 'images/<image_name_event>' ||
        imageUrl === 'images/<image_name_job>' ||
        imageUrl === 'images/<image_name_contact>'
      )
    ) {
      this.props.actions.openSnackBar({
        snackBarMessage: 'Image must be in format of images/imageName.jpg',
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
      this.skillTag === name &&
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
      if (file) {
        form.append('image', file);
        form.append('image_name', imageUrl.replace('images/', ''));
      } else {
        form.append('image', 'images/default.png');
        form.append('image_name', 'default.png');
      }
      form.append('content', code);
      form.append('access_token', accessToken);
      if (this.isBotBuilder) {
        form.append('private', '1');
      }
      try {
        let payload = await createSkill(form);
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
      } catch (error) {
        this.setState({
          loading: false,
        });
        this.props.actions.openSnackBar({
          snackBarMessage: String(error),
          snackBarPosition: { vertical: 'top', horizontal: 'right' },
          variant: 'error',
        });
      }
    } else {
      form.append('OldModel', 'general');
      form.append('OldGroup', this.groupValue);
      form.append('OldLanguage', this.languageValue);
      form.append('OldSkill', this.skillTag);
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
      try {
        let payload = await modifySkill(form);
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
      } catch (error) {
        this.setState({
          loading: false,
        });
        this.props.actions.openSnackBar({
          snackBarMessage: String(error),
          snackBarPosition: { vertical: 'top', horizontal: 'right' },
          variant: 'error',
        });
      }
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

  deleteSkill = async () => {
    this.setState({
      loading: true,
    });
    const { actions, history } = this.props;
    const { model, group, language, skill } = this.skillData;
    try {
      await deleteSkill({ model, group, language, skill });
      this.setState({
        loading: false,
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
      this.setState({
        loading: false,
      });
      actions.openModal({
        modalType: 'confirm',
        title: 'Failed',
        handleConfirm: actions.closeModal,
        content: (
          <p>
            Error! <b>{skill}</b> could not be deleted!
          </p>
        ),
      });
    }
  };

  handleLabel = () => {
    if (this.mode === 'edit') {
      return 'Update';
    }
    return 'Create';
  };

  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleChangePublicSkill = event => {
    this.setState({
      publicSkill: event.target.checked,
    });
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
      isAdmin,
    } = this.props;
    const { loadViews, anchorEl, publicSkill } = this.state;
    const open = !!anchorEl;
    let showTopBar = true;
    if (this.props.hasOwnProperty('showTopBar')) {
      showTopBar = this.props.showTopBar;
    }

    const skillWizard = (
      <div>
        <HeadingContainer>
          {this.isBotBuilder ? (
            <Heading>1. Add a new skill to your bot</Heading>
          ) : (
            (this.mode === 'create' && (
              <Heading>Create a SUSI.AI skill</Heading>
            )) || <Heading>Edit skill</Heading>
          )}
          <ViewsDiv>
            <IconButton
              title="Code"
              onClick={() => actions.setView({ view: 'code' })}
            >
              <Code color={view === 'code' ? 'primary' : 'inherit'} />
            </IconButton>
            <IconButton
              title="Conversation"
              onClick={() => actions.setView({ view: 'conversation' })}
            >
              <QA color={view === 'conversation' ? 'primary' : 'inherit'} />
            </IconButton>
            <IconButton
              title="Tree"
              onClick={() => actions.setView({ view: 'tree' })}
            >
              <Timeline color={view === 'tree' ? 'primary' : 'inherit'} />
            </IconButton>
          </ViewsDiv>
        </HeadingContainer>
        <ReactToolTip
          effect="solid"
          place="bottom"
          delayHide={500}
          html={true}
        />
        {accessToken && this.state.editable && (
          <PaperContainer>
            <a
              href="https://github.com/fossasia/susi.ai/blob/master/docs/Skill_Tutorial.md"
              rel="noopener noreferrer"
              target="_blank"
            >
              <InfoIcon data-tip="Learn more about SUSI Skill Language" />
            </a>
            <CenterDiv>
              <DropDownDiv>
                <Popover
                  open={open}
                  anchorEl={anchorEl}
                  onClose={this.handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                  <Text>
                    Open Source Skills will show in the public directory and are
                    editable by everyone just like a Wikipedia article. Private
                    skills are only editable by the creator/owner of the skill.
                    They are not listed in the public directory and can
                    currently only be used by the creator/owner.
                  </Text>
                </Popover>
                {this.isBotBuilder ? null : (
                  <Fragment>
                    <DetailText
                      style={{ color: publicSkill ? '#808080' : '#4285f4' }}
                    >
                      Private Skill (Coming Soon)
                      <IconButton
                        onClick={this.handleClick}
                        style={{ padding: '0px' }}
                      >
                        <QuestionIcon />
                      </IconButton>
                    </DetailText>
                    <Switch
                      color="primary"
                      checked={publicSkill}
                      onChange={this.handleChangePublicSkill}
                    />
                    <DetailText
                      style={{ color: publicSkill ? '#4285f4' : '#808080' }}
                    >
                      Open Source and Public Skill
                    </DetailText>
                  </Fragment>
                )}
                <DropDownWrap>
                  <SkillDetail>
                    <OutlinedSelectField
                      select
                      label="Category"
                      value={category}
                      onChange={this.handleGroupChange}
                      autoWidth={true}
                    >
                      {this.state.groups}
                    </OutlinedSelectField>
                  </SkillDetail>
                  <SkillDetail>
                    <OutlinedSelectField
                      select
                      label="Language"
                      value={language}
                      onChange={this.handleLanguageChange}
                      autoWidth={true}
                    >
                      {this.state.languages}
                    </OutlinedSelectField>
                  </SkillDetail>
                  <SkillDetail>
                    <OutlinedInput
                      id="outlined-name"
                      label={this.isBotBuilder ? 'Bot Name ' : 'Skill Name '}
                      margin="normal"
                      value={name}
                      onChange={this.handleExpertChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </SkillDetail>
                  <ImageDiv>
                    <IconWrap>
                      <Img alt="preview" id="target" src={image} />
                      <Check />
                    </IconWrap>
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
                </DropDownWrap>
              </DropDownDiv>
            </CenterDiv>
          </PaperContainer>
        )}
        {!loadViews ? <CircularLoader height={10} /> : null}
        {view === 'code' && loadViews ? (
          <CodeView editable={accessToken && this.state.editable} />
        ) : null}
        {view === 'conversation' && loadViews ? <ConversationView /> : null}
        {view === 'tree' && loadViews ? <TreeView botbuilder={false} /> : null}
        {!this.isBotBuilder && accessToken && this.state.editable && (
          <Fragment>
            <SkillCommitDiv>
              <SavePaper>
                <FlexWrapper>
                  <CommitField
                    label="Commit Message"
                    placeholder="Enter Commit Message"
                    margin="dense"
                    value={this.state.commitMessage}
                    onChange={this.handleCommitMessageChange}
                  />
                  <div style={{ display: 'flex', marginTop: '10px' }}>
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
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.saveClick}
                      style={{ marginLeft: '10px', height: '36px' }}
                    >
                      {this.state.loading ? (
                        <CircularProgress color="#ffffff" size={24} />
                      ) : (
                        this.handleLabel()
                      )}
                    </Button>
                  </div>
                </FlexWrapper>
                <span style={{ float: 'left', marginTop: '10px' }}>
                  Your skill will be stored to{' '}
                  <a
                    href="https://github.com/fossasia/susi_skill_data"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    susi_skill_data
                  </a>
                </span>
              </SavePaper>
            </SkillCommitDiv>
          </Fragment>
        )}
        {this.state.prevButton === 1 ? (
          <PreviewButton>
            <span title="See Preview">
              <ChevronLeftIcon onClick={this.handlePreviewToggle} />
            </span>
          </PreviewButton>
        ) : null}
        {this.mode === 'edit' && isAdmin && (
          <DeleteSkillSection>
            <div>
              <div>
                <b>Delete this Skill</b>
              </div>
              {'Once you delete a skill, only admins can ' +
                'undo this action before 30 days of deletion. Please be certain.'}
            </div>
            <DeleteButton onClick={this.handleDeleteModal}>Delete</DeleteButton>
          </DeleteSkillSection>
        )}
      </div>
    );

    return (
      <Container style={this.isBotBuilder ? null : { padding: '20px 9px 0px' }}>
        <Grid fluid style={this.isBotBuilder ? { padding: '0px' } : null}>
          <Row>
            <Col
              md={12}
              xl={this.state.colSkill}
              style={{
                display: this.state.colSkill === 0 ? 'none' : 'block',
                maxWidth: '100%',
                marginBottom: this.isBotBuilder ? '0px' : '40px',
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
                      <B>{this.skillTag}</B>
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
                !isAdmin && (
                  <HomeDiv>
                    <TitlePara>
                      THIS SKILL IS NOT EDITABLE. IT IS CURRENTLY LOCKED BY
                      ADMINS. YOU CAN STILL SEE THE CODE OF THE SKILL.
                    </TitlePara>
                    <SubTitlePara>
                      There can be various reasons for non-editable skills.{' '}
                      <br />
                      For example if the skill is a standard skill, if there was
                      vandalism happening in the skill or if there is a dispute
                      about the skill.
                    </SubTitlePara>
                    <DescriptionPara>
                      The code is shown below in a read only mode.
                    </DescriptionPara>
                  </HomeDiv>
                )}

              {this.isBotBuilder ? (
                <div>{skillWizard}</div>
              ) : (
                <StyledPaper>{skillWizard}</StyledPaper>
              )}
            </Col>
            {this.isBotBuilder ? null : (
              <PreviewCol
                md={12}
                xl={this.state.colPreview}
                style={{
                  display: this.state.colPreview === 0 ? 'none' : 'block',
                }}
              >
                <Preview
                  handlePreviewToggle={this.handlePreviewToggle}
                  paperWidth={'100%'}
                />
              </PreviewCol>
            )}
          </Row>
        </Grid>
      </Container>
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

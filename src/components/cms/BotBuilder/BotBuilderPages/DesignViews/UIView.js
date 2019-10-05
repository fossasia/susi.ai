import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Col, Row as _Row } from 'react-flexbox-grid';
import CircularLoader from '../../../../shared/CircularLoader';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import uiActions from '../../../../../redux/actions/ui';
import createActions from '../../../../../redux/actions/create';
import _Close from '@material-ui/icons/Close';
import Add from '@material-ui/icons/Add';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { colors } from '../../../../../utils';
import ColorPickerComponent from '../../../../shared/ColorPickerComponent';
import _Check from '@material-ui/icons/Check';
import styled from 'styled-components';
import { uploadImage } from '../../../../../apis';
import { CircularProgress } from '@material-ui/core';
import getImageSrc from '../../../../../utils/getImageSrc';

const BotAvatarImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 10px;
  cursor: pointer;
`;

const AvatarUploadButton = styled.label`
  border-radius: 50%;
  height: 60px;
  width: 60px;
  background-color: #eee;
  text-align: center;
  cursor: pointer;
  display: inline-block;
  position: relative;
  top: ${props => (props.top ? props.top + 'px' : '10px')};
`;

const DesignContainer = styled.div`
  max-width: 100%;
  text-align: left;

  @media (max-width: 480px) {
    margin-left: 20px;
  }
`;

const FileUploadButton = styled.label`
  display: inline-block;
  font-family: sans-serif;
  cursor: pointer;
  text-decoration: none;
  padding: 0px 10px;
  position: relative;
  z-index: 1;
  line-height: 36px;
  border-radius: 2px;
  transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
  background-color: rgb(66, 133, 244);
  text-align: center;
  color: #fff;
  font-size: 14px;
  text-transform: uppercase;
  max-width: 200px;
  min-width: 130px;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px;

  &:hover {
    background-color: rgb(90, 147, 241);
  }
`;

const Close = styled(_Close)`
  vertical-align: middle;
  margin-left: 20px;
  cursor: pointer;
`;

const ToggleLabel = styled.label`
  margin-right: 10px;
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.87);
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Form = styled.form`
  display: inline-block;
`;

const Row = styled(_Row)`
  margin-bottom: 15px;
`;

const ComponentName = styled.div`
  font-size: 18px;
  font-weight: 400;
`;

const BotBuilderContainer = styled.div`
  padding: 10px 0 25px 0;
`;

const AddIcon = styled(Add)`
  height: 30px;
  margin-top: 15px;
  color: rgb(66, 133, 245);
`;

const Input = styled.input`
  display: none;
`;

const Check = styled(_Check)`
  display: none;
  position: absolute;
  top: -9px;
  right: 0px;
  font-size: 23px;
  color: #4285f5;
`;

const IconWrap = styled.span`
  display: inline-block;
  position: relative;
  ${BotAvatarImg} {
    border: ${props => (props.icon ? 'solid 2px #4285f5' : 'none')};
  }

  ${Check} {
    display: ${props => (props.icon ? 'block' : 'none')};
  }
`;

// Custom Theme feature Component
const customiseOptionsList = [
  {
    id: 1,
    component: 'botbuilderBackgroundBody',
    name: 'Change background',
  },
  {
    id: 2,
    component: 'botbuilderUserMessageBackground',
    name: 'User message bubble',
  },
  {
    id: 3,
    component: 'botbuilderUserMessageTextColor',
    name: 'User message text',
  },
  {
    id: 4,
    component: 'botbuilderBotMessageBackground',
    name: 'Bot message bubble',
  },
  {
    id: 5,
    component: 'botbuilderBotMessageTextColor',
    name: 'Bot message text',
  },
  {
    id: 6,
    component: 'botbuilderIconColor',
    name: 'Avatar background',
  },
  {
    id: 7,
    component: 'botbuilderAvatar',
    name: 'Choose your bot avatar',
  },
];

class UIView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadedSettings: false,
      uploadingBodyBackgroundImg: false,
      botbuilderBodyBackgroundImgName: this.props.design
        .botbuilderBodyBackgroundImgName,
      uploadingBotbuilderIconImg: false,
      showBackgroundImageChange:
        this.props.design.botbuilderBodyBackgroundImgName !== '',
      botbuilderIconSelected: this.props.design.botbuilderIconSelected,
      avatars: this.props.design.avatars,
    };
  }

  componentDidMount() {
    this.getSettings();
  }

  handleChangeColor = (component, color) => {
    if (color) {
      const { actions } = this.props;
      if (!color.startsWith('#')) {
        color = '#' + color;
      }
      actions.setDesignComponentColor({ component, color });
    }
  };

  handleChangeBodyBackgroundImage = event => {
    const file = this.backgroundImage.files[0];
    const imageName = file.name;
    const image = window.URL.createObjectURL(file);

    if (!event.target.files || !event.target.files[0]) {
      this.handleRemoveUrlBody();
    } else {
      this.setImageBodyBackground(image, imageName);
    }
    this.backgroundImageSelectedFile = this.backgroundImage.files[0];
  };

  uploadBackgroundImage = () => {
    const { accessToken, actions } = this.props;
    this.setState({ uploadingBodyBackgroundImg: true });
    let form = new FormData();
    form.append('access_token', accessToken);
    form.append('image_name', this.backgroundImageSelectedFile.name);
    form.append('image', this.backgroundImageSelectedFile);
    uploadImage(form)
      .then(payload => {
        this.setImageBodyBackground(
          getImageSrc({ relativePath: `image=${payload.imagePath}` }),
          this.props.design.botbuilderBodyBackgroundImgName,
        );
        this.setState({
          uploadingBodyBackgroundImg: false,
        });
      })
      .catch(error => {
        this.setState({
          uploadingBodyBackgroundImg: false,
        });
        actions.openSnackBar({
          snackBarMessage: "Error! Couldn't upload image",
          snackBarDuration: 2000,
        });
      });
  };

  setImageBodyBackground = (image, imageName) => {
    const { actions } = this.props;
    actions.setBotBackgroundImage({
      botbuilderBodyBackgroundImg: image,
      botbuilderBodyBackgroundImgName: imageName,
    });
  };

  handleRemoveUrlBody = () => {
    let {
      actions,
      design: { code },
    } = this.props;
    code = code.replace(
      /^::bodyBackgroundImage\s(.*)$/m,
      '::bodyBackgroundImage ',
    );
    actions.updateDesignData({
      code,
      botbuilderBodyBackgroundImg: '',
      botbuilderBodyBackgroundImgName: '',
    });
  };

  handleChangeIconImage = event => {
    const file = this.botBuilderIcon.files[0];
    if (!event.target.files || !event.target.files[0]) {
      this.handleRemoveUrlIcon();
    } else {
      this.uploadAvatarImage(file, file.name);
    }
  };

  uploadAvatarImage = (file, filename) => {
    const { accessToken, actions } = this.props;
    this.setState({ uploadingBotbuilderIconImg: true });
    let form = new FormData();
    form.append('access_token', accessToken);
    form.append('image_name', filename);
    form.append('image', file);
    uploadImage(form)
      .then(payload => {
        this.setState({
          uploadingBotbuilderIconImg: false,
        });
        actions.setBotAvatar({
          botbuilderIconImg: getImageSrc({
            relativePath: `image=${payload.imagePath}`,
          }),
        });
      })
      .catch(error => {
        this.setState({
          uploadingBotbuilderIconImg: false,
        });
        actions.openSnackBar({
          snackBarMessage: "Error! Couldn't set image",
          snackBarDuration: 2000,
        });
      });
  };

  handleRemoveUrlIcon = () => {
    let {
      actions,
      design: { code },
    } = this.props;
    code = code.replace(/^::botIconImage\s(.*)$/m, '::botIconImage ');
    actions.updateDesignData({
      code,
      botbuilderIconImg: '',
    });
    this.setState({
      iconSelected: null,
    });
  };

  getSettings = () => {
    const { code } = this.props.design;
    const botIconImageMatch = code.match(/^::botIconImage\s(.*)$/m);

    if (botIconImageMatch && botIconImageMatch[1].length > 0) {
      let avatarsObj = this.state.avatars;
      avatarsObj.push({
        id: avatarsObj.length,
        url: botIconImageMatch[1],
      });
      for (let icon of avatarsObj) {
        if (icon.url === botIconImageMatch[1]) {
          this.handleIconSelect(icon);
          break;
        }
      }
      this.setState({
        avatars: avatarsObj,
      });
    }

    this.setState({
      loadedSettings: true,
    });
  };

  handleReset = () => {
    // reset to default values
    const { actions } = this.props;
    this.setState({ loadedSettings: false });
    actions.resetDesignData().then(() => {
      this.setState({
        loadedSettings: true,
      });
    });
  };

  handleIconSelect = icon => {
    let { actions } = this.props;
    actions.setBotAvatar({
      botbuilderIconImg: icon.url,
      botbuilderIconSelected: icon.id,
      addNewIcon: false,
    });
  };

  handleClickColorBox = id => {
    document.getElementById(`colorPicker${id}`).click();
  };

  handleShowBackgroundImageChangeToggle = () => {
    let {
      actions,
      design: { code },
    } = this.props;
    let isInputChecked = !this.state.showBackgroundImageChange;
    if (isInputChecked === false) {
      code = code.replace(
        /^::bodyBackgroundImage\s(.*)$/m,
        '::bodyBackgroundImage ',
      );
      actions.updateDesignData({
        code,
        botbuilderBodyBackgroundImg: '',
        botbuilderBodyBackgroundImgName: '',
      });
    }
    this.setState({ showBackgroundImageChange: isInputChecked });
  };

  render() {
    const {
      showBackgroundImageChange,
      uploadingBodyBackgroundImg,
      uploadingBotbuilderIconImg,
      loadedSettings,
      resetting,
    } = this.state;
    const {
      design: {
        botbuilderBodyBackgroundImg,
        botbuilderBodyBackgroundImgName,
        avatars,
        botbuilderIconSelected,
      },
      design,
    } = this.props;
    console.log({ botbuilderBodyBackgroundImgName });
    const customizeComponents = customiseOptionsList.map(component => {
      return (
        <div key={component.id} className="circleChoose">
          <Row>
            <Col xs={12} md={6} lg={6}>
              {component.id === 7 ? (
                <ColumnContainer>
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: '400',
                    }}
                  >
                    {component.name}
                  </div>
                </ColumnContainer>
              ) : (
                <ColumnContainer>
                  <ComponentName>{component.name}</ComponentName>
                  {component.id === 1 && (
                    <div>
                      <ToggleLabel
                        onClick={this.handleShowBackgroundImageChangeToggle}
                      >
                        Color
                      </ToggleLabel>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={showBackgroundImageChange}
                            onChange={
                              this.handleShowBackgroundImageChangeToggle
                            }
                            color="primary"
                          />
                        }
                        label="Image"
                      />
                    </div>
                  )}
                </ColumnContainer>
              )}
            </Col>
            <Col xs={12} md={6} lg={6}>
              {component.id !== 7 &&
              !(component.id === 1 && showBackgroundImageChange === true) ? (
                <RowContainer>
                  <ColorPickerComponent
                    component={component.component}
                    id={component.id}
                    handleChangeColor={this.handleChangeColor}
                    backgroundColor={design[component.component]}
                    handleClickColorBox={this.handleClickColorBox}
                  />
                </RowContainer>
              ) : null}
              {component.component === 'botbuilderBackgroundBody' &&
                showBackgroundImageChange === true && (
                  <div>
                    <Form>
                      {botbuilderBodyBackgroundImg === '' && (
                        <AvatarUploadButton top="0">
                          <Input
                            disabled={uploadingBodyBackgroundImg}
                            type="file"
                            ref={c => {
                              this.backgroundImage = c;
                            }}
                            onChange={this.handleChangeBodyBackgroundImage}
                            accept="image/*"
                          />
                          <AddIcon />
                        </AvatarUploadButton>
                      )}
                      <FileUploadButton
                        title="Upload Background Image"
                        onClick={this.uploadBackgroundImage}
                      >
                        {uploadingBodyBackgroundImg && (
                          <CircularLoader
                            height={2.25}
                            color="inherit"
                            size={24}
                          />
                        )}
                        {!uploadingBodyBackgroundImg &&
                          (botbuilderBodyBackgroundImgName !== '' ||
                            botbuilderBodyBackgroundImg !== '') &&
                          'Upload Image'}
                      </FileUploadButton>
                    </Form>
                    {botbuilderBodyBackgroundImg && (
                      <div>
                        <span>{botbuilderBodyBackgroundImgName}</span>
                        <span title="Remove image">
                          <Close onClick={this.handleRemoveUrlBody} />
                        </span>
                      </div>
                    )}
                  </div>
                )}
            </Col>
          </Row>
          {component.component === 'botbuilderAvatar' && (
            <BotBuilderContainer>
              {avatars.map(icon => {
                return (
                  <IconWrap
                    id={icon.id}
                    key={icon.id}
                    icon={botbuilderIconSelected === icon.id}
                  >
                    <BotAvatarImg
                      alt="icon"
                      src={icon.url}
                      onClick={() => this.handleIconSelect(icon)}
                    />
                    <Check />
                  </IconWrap>
                );
              })}
              <Form>
                <AvatarUploadButton title="Upload your own bot icon">
                  <Input
                    disabled={uploadingBotbuilderIconImg}
                    type="file"
                    ref={c => {
                      this.botBuilderIcon = c;
                    }}
                    onChange={
                      uploadingBotbuilderIconImg
                        ? null
                        : this.handleChangeIconImage
                    }
                    accept="image/x-png,image/gif,image/jpeg"
                  />
                  {uploadingBotbuilderIconImg ? (
                    <CircularLoader height={3.7} size={30} />
                  ) : (
                    <AddIcon />
                  )}
                </AvatarUploadButton>
              </Form>
            </BotBuilderContainer>
          )}
        </div>
      );
    });
    return (
      <div>
        {!loadedSettings ? (
          <CircularLoader />
        ) : (
          <DesignContainer>
            {loadedSettings && <Grid>{customizeComponents}</Grid>}
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleReset}
            >
              {resetting ? (
                <CircularProgress color={colors.light.header} size={24} />
              ) : (
                'Reset Changes'
              )}
            </Button>
          </DesignContainer>
        )}
      </div>
    );
  }
}

UIView.propTypes = {
  actions: PropTypes.object,
  code: PropTypes.string,
  accessToken: PropTypes.string,
  design: PropTypes.object,
};

function mapStateToProps(store) {
  return {
    accessToken: store.app.accessToken,
    design: store.create.design,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...createActions, ...uiActions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UIView);

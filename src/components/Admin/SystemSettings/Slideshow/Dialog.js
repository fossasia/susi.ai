import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import _Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dropzone from './Dropzone';
import uiActions from '../../../../redux/actions/ui';
import CircularProgress from '@material-ui/core/CircularProgress';
import getImageSrc from '../../../../utils/getImageSrc';
import {
  modifySkillSlideshow,
  uploadImage,
  deleteSkillSlideshow,
} from '../../../../apis/index';

const Button = styled(_Button)`
  float: left;
  margin: 1rem 0;
  width: 9rem;
`;

class SkillSlideshowDialog extends React.Component {
  state = {
    image: '',
    redirectLink: this.props.redirectLink || '',
    previewUrl: '',
    imageSuffix:
      (this.props.imageName && this.props.imageName.split('_')[1]) || '',
    imagePath: this.props.imageName || '',
    info: this.props.info || '',
    file: '',
    uploadingImage: false,
    isSliderImageUploaded: this.props.operation === 'Edit',
    isSliderImageAdded: false,
  };

  saveSlide = () => {
    const { redirectLink, info, imagePath } = this.state;
    modifySkillSlideshow({ redirectLink, info, imageName: imagePath })
      .then(() => {
        this.props.getSkillSlideshow();
      })
      .catch(error => console.log('Error', error));
    this.props.actions.closeModal();
  };

  deleteSlide = () => {
    const { redirectLink, imagePath } = this.state;
    deleteSkillSlideshow({ redirectLink, imageName: imagePath })
      .then(() => {
        this.props.getSkillSlideshow();
      })
      .catch(error => console.log('Error', error));
    this.props.actions.closeModal();
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSliderSubmit = () => {
    const { file, imageSuffix } = this.state;
    const { accessToken, actions } = this.props;
    // eslint-disable-next-line no-undef
    let form = new FormData();
    form.append('access_token', accessToken);
    form.append('image', file);
    form.append('image_name', imageSuffix);
    this.setState({ uploadingImage: true });
    uploadImage(form).then(({ imagePath }) => {
      actions.openSnackBar({
        snackBarMessage: 'Slider Uploaded',
      });
      this.setState({
        uploadingImage: false,
        isSliderImageUploaded: true,
        imagePath,
      });
    });
  };

  handleImageChange = e => {
    e.preventDefault();
    // eslint-disable-next-line no-undef
    let reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        file: file,
        previewUrl: reader.result,
        isSliderImageAdded: true,
      });
    };
    reader.readAsDataURL(file);
  };

  handleFilePreview = () => {
    const fileUpload = document.getElementById('file-opener');
    this.props.operation !== 'Delete' && fileUpload.click();
  };

  handleConfirm = () => {
    if (this.props.operation === 'Delete') {
      this.deleteSlide();
      return;
    }
    this.saveSlide();
  };

  render() {
    const {
      imageSuffix,
      redirectLink,
      info,
      isSliderImageUploaded,
      isSliderImageAdded,
      previewUrl,
      uploadingImage,
      imagePath,
    } = this.state;
    const { handleClose, operation, imageName } = this.props;
    const disabled = operation === 'Delete';
    const uploadDisabled =
      disabled ||
      ((imageSuffix === '' || (imageName && imageName.split('_')[1])) &&
        isSliderImageUploaded &&
        operation === 'Create') ||
      !isSliderImageAdded ||
      uploadingImage;
    return (
      <React.Fragment>
        <DialogTitle>{operation} Slideshow</DialogTitle>
        <DialogContent>
          <TextField
            label="Redirect Url"
            placeholder="Redirect Url"
            margin="normal"
            value={redirectLink || ''}
            fullWidth={true}
            name="redirectLink"
            onChange={this.handleChange}
            disabled={disabled || operation === 'Edit'}
            required
          />
          <div style={{ display: 'flex', justifyContent: 'spaceBetween' }}>
            <TextField
              label="Image Suffix"
              placeholder="Image Suffix"
              margin="normal"
              value={imageSuffix || ''}
              fullWidth={true}
              name="imageSuffix"
              onChange={this.handleChange}
              disabled={disabled}
              required
            />
            <TextField
              label="Image Path"
              placeholder="Image Path"
              margin="normal"
              value={imagePath || ''}
              fullWidth={true}
              name="imagePath"
              onChange={this.handleChange}
              disabled={true}
              style={{ marginLeft: '2rem' }}
            />
          </div>
          <TextField
            label="Information"
            placeholder="Information"
            margin="normal"
            value={info || ''}
            fullWidth={true}
            name="info"
            onChange={this.handleChange}
            disabled={disabled}
          />
          <Dropzone
            src={
              isSliderImageUploaded && !isSliderImageAdded
                ? getImageSrc({ relativePath: `image=${imagePath}` })
                : previewUrl
            }
            handleFilePreview={this.handleFilePreview}
            isSliderImageAdded={isSliderImageAdded || isSliderImageUploaded}
            disabled={operation === 'Delete'}
          />
          <input
            id="file-opener"
            type="file"
            onChange={e => this.handleImageChange(e)}
            accept="image/x-png,image/gif,image/jpeg"
            onClick={event => {
              event.target.value = null;
            }}
            style={{ display: 'none' }}
          />
          <Button
            color="primary"
            onClick={this.handleSliderSubmit}
            disabled={uploadDisabled}
            variant="contained"
          >
            {uploadingImage ? <CircularProgress size={24} /> : 'Upload Image'}
          </Button>
        </DialogContent>
        <DialogActions>
          <Button
            key={1}
            variant="contained"
            color="primary"
            onClick={this.handleConfirm}
            disabled={
              operation === 'Create' &&
              (redirectLink === '' ||
                imageSuffix === '' ||
                imagePath === '' ||
                !isSliderImageUploaded)
            }
          >
            {operation}
          </Button>
          <Button key={2} onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </React.Fragment>
    );
  }
}

SkillSlideshowDialog.propTypes = {
  redirectLink: PropTypes.string,
  imageName: PropTypes.string,
  info: PropTypes.string,
  getSkillSlideshow: PropTypes.func,
  handleClose: PropTypes.func,
  actions: PropTypes.object,
  accessToken: PropTypes.string,
  operation: PropTypes.string,
};

function mapStateToProps(store) {
  return {
    accessToken: store.app.accessToken,
  };
}

function mapStateToDispatch(dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapStateToDispatch,
)(SkillSlideshowDialog);

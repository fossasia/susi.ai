import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '../../../shared/Button';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

class CropDialog extends Component {
  static propTypes = {
    title: PropTypes.string,
    content: PropTypes.string,
    handleConfirm: PropTypes.func,
    imagePreviewUrl: PropTypes.string,
    handleClose: PropTypes.func,
  };

  state = {
    src: this.props.imagePreviewUrl,
    crop: {
      unit: '%',
      width: 30,
      aspect: 1 / 1,
    },
    croppedImageUrl: null,
    loading: false,
  };

  getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, 'image/jpeg');
    });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      try {
        const croppedImageUrl = await this.getCroppedImg(
          this.imageRef,
          crop,
          'newFile.jpeg',
        );
        this.setState({ croppedImageUrl });
      } catch (error) {
        console.log(error);
      }
    }
  }

  onImageLoaded = image => {
    this.imageRef = image;
  };

  onCropComplete = crop => {
    this.makeClientCrop(crop);
  };

  onCropChange = crop => {
    this.setState({
      crop,
    });
  };

  render() {
    const { title, handleConfirm, imagePreviewUrl, handleClose } = this.props;
    const { croppedImageUrl, crop, loading } = this.state;
    return (
      <React.Fragment>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {imagePreviewUrl && (
            <ReactCrop
              src={imagePreviewUrl}
              crop={crop}
              ruleOfThirds
              onImageLoaded={this.onImageLoaded}
              onComplete={this.onCropComplete}
              onChange={this.onCropChange}
            />
          )}
        </DialogContent>
        <DialogActions style={{ justifyContent: 'space-around' }}>
          <Button
            key={0}
            color="primary"
            variant="contained"
            handleClick={handleClose}
            buttonText="Cancel"
          />
          <Button
            key={1}
            color="primary"
            variant="contained"
            handleClick={() => {
              this.setState({ loading: true });
              handleConfirm(croppedImageUrl);
            }}
            isLoading={loading}
            disabled={loading}
            buttonText="Upload"
          />
        </DialogActions>
      </React.Fragment>
    );
  }
}

export default CropDialog;

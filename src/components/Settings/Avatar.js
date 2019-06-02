import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import { getGravatarProps } from '../../utils/getAvatarProps';
import Button from '@material-ui/core/Button';
import defaultAvatar from '../../../public/defaultAvatar.png';

const styles = {
  avatarEmptyBoxStyle: {
    margin: '0 auto',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItem: 'centre',
  },
  avatarAddButtonStyle: {
    margin: '50px auto',
    height: '50px',
    width: '50px',
  },
};

const Avatar = props => {
  const {
    avatarType,
    handleAvatarSubmit,
    imagePreviewUrl,
    removeAvatarImage,
    handleAvatarImageChange,
    isAvatarAdded,
    isAvatarUploaded,
    uploadingAvatar,
    email,
  } = props;
  switch (avatarType) {
    case 'server':
      return (
        <form
          style={{ display: 'inline-block' }}
          onSubmit={e => handleAvatarSubmit(e)}
        >
          {imagePreviewUrl !== '' && (
            <div>
              <div className="close-avatar">
                <CloseIcon
                  onClick={removeAvatarImage}
                  style={{ fill: '#999999' }}
                />
              </div>
              <img
                alt="User Avatar"
                className="setting-avatar"
                src={imagePreviewUrl}
                onClick={e => handleAvatarImageChange(e)}
              />
            </div>
          )}
          {imagePreviewUrl === '' &&
            !isAvatarAdded && (
              <label htmlFor="file-opener">
                <div onSubmit={e => handleAvatarImageChange(e)}>
                  {!isAvatarAdded && (
                    <div className="avatar-empty-box">
                      <div style={styles.avatarEmptyBoxStyle}>
                        <AddIcon
                          className="avatar-add-button"
                          style={styles.avatarAddButtonStyle}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <input
                  id="file-opener"
                  type="file"
                  className="input-avatar"
                  onChange={e => handleAvatarImageChange(e)}
                  accept="image/x-png,image/gif,image/jpeg"
                  style={{ marginTop: '10px' }}
                  onClick={event => {
                    event.target.value = null;
                  }}
                />
              </label>
            )}
          <Button
            disabled={!isAvatarAdded || isAvatarUploaded}
            onClick={e => handleAvatarSubmit(e)}
            variant="contained"
            color="primary"
          >
            {isAvatarAdded && uploadingAvatar ? (
              <CircularProgress size={24} color="secondary" />
            ) : (
              'Upload Image'
            )}
          </Button>
        </form>
      );
    case 'gravatar':
      return (
        <img
          alt="Gravatar avatar"
          className="setting-avatar"
          src={getGravatarProps(email).src}
        />
      );
    default:
      return (
        <img
          alt="Default avatar"
          className="setting-avatar"
          src={defaultAvatar}
        />
      );
  }
};

Avatar.propTypes = {
  email: PropTypes.string,
  avatarType: PropTypes.string,
  handleAvatarImageChange: PropTypes.func,
  imagePreviewUrl: PropTypes.string,
  uploadingAvatar: PropTypes.bool,
  removeAvatarImage: PropTypes.func,
  handleAvatarSubmit: PropTypes.func,
  isAvatarAdded: PropTypes.bool,
  isAvatarUploaded: PropTypes.bool,
};

export default Avatar;

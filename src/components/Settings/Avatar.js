import React from 'react';
import _AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import { getGravatarProps } from '../../utils/getAvatarProps';
import Button from '@material-ui/core/Button';
import defaultAvatar from '../../images/defaultAvatar.png';
import _Fab from '@material-ui/core/Fab';
import Menu from '@material-ui/core/Menu';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import styled from 'styled-components';

const Fab = styled(_Fab)`
  position: absolute;
  top: 70%;
  left: 4%;
`;

const AddIcon = styled(_AddIcon)`
  margin: 3.125rem auto;
  height: 3.125rem;
  width: 3.125rem;
  width: 2.5rem;
  display: block;
`;

const AvatarImage = styled.img`
  width: 10rem;
  border-radius: 6px;
  display: block;
  height: 10rem;
  margin: 1rem 0;
`;

const AvatarDiv = styled.div`
  margin: 0 auto;
  width: 100%;
  height: 100%;
  display: flex;
  align-item: centre;
`;

const Form = styled.form`
  display: inline-block;
`;

const PreviewContainer = styled.div`
  position: relative;
`;

const Input = styled.input`
  margin-top: 0.625rem;
`;

const EmptyAvatarContainer = styled.div`
  border: 1px solid #ced4da;
  height: 10rem;
  border-radius: 6px;
  width: 10rem;
  margin: 1rem 0;
  :hover {
    background-color: #ced4da;
    cursor: pointer;
  }
`;

const Avatar = props => {
  const handleFileUpload = () => {
    const fileUpload = document.getElementById('file-opener');
    fileUpload.click();
    props.handleMenuClose();
  };

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
    handleMenuClose,
    handleMenuClick,
    open,
    anchorEl,
  } = props;

  switch (avatarType) {
    case 'server':
      return (
        <Form onSubmit={e => handleAvatarSubmit(e)}>
          {imagePreviewUrl !== '' && (
            <PreviewContainer>
              <AvatarImage
                alt="User Avatar"
                src={imagePreviewUrl}
                onClick={e => handleAvatarImageChange(e)}
              />
              <Fab color="primary" size="small" onClick={handleMenuClick}>
                <EditIcon />
              </Fab>
              <input
                id="file-opener"
                type="file"
                className="input-avatar"
                onChange={e => handleAvatarImageChange(e)}
                accept="image/x-png,image/gif,image/jpeg"
                onClick={event => {
                  event.target.value = null;
                }}
              />
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              >
                <MenuList disableListWrap={true}>
                  <MenuItem
                    onClose={handleMenuClose}
                    onClick={handleFileUpload}
                  >
                    <ListItemText>Upload a Photo</ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClose={handleMenuClose}
                    onClick={removeAvatarImage}
                  >
                    <ListItemText>Remove Photo</ListItemText>
                  </MenuItem>
                </MenuList>
              </Menu>
            </PreviewContainer>
          )}
          {imagePreviewUrl === '' && !isAvatarAdded && (
            <label htmlFor="fileOpener">
              <div onSubmit={e => handleAvatarImageChange(e)}>
                {!isAvatarAdded && (
                  <EmptyAvatarContainer>
                    <AvatarDiv>
                      <AddIcon />
                    </AvatarDiv>
                  </EmptyAvatarContainer>
                )}
              </div>
              <Input
                id="fileOpener"
                type="file"
                className="input-avatar"
                onChange={e => handleAvatarImageChange(e)}
                accept="image/x-png,image/gif,image/jpeg"
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
        </Form>
      );
    case 'gravatar':
      return (
        <AvatarImage alt="Gravatar avatar" src={getGravatarProps(email).src} />
      );
    default:
      return <AvatarImage alt="Default avatar" src={defaultAvatar} />;
  }
};

Avatar.propTypes = {
  email: PropTypes.string,
  avatarType: PropTypes.string,
  handleAvatarImageChange: PropTypes.func,
  handleMenuClose: PropTypes.func,
  handleMenuClick: PropTypes.func,
  open: PropTypes.bool,
  anchorEl: PropTypes.bool,
  imagePreviewUrl: PropTypes.string,
  uploadingAvatar: PropTypes.bool,
  removeAvatarImage: PropTypes.func,
  handleAvatarSubmit: PropTypes.func,
  isAvatarAdded: PropTypes.bool,
  isAvatarUploaded: PropTypes.bool,
};

export default Avatar;

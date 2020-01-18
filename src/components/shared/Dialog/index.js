import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import uiActions from '../../../redux/actions/ui';
import appActions from '../../../redux/actions/app';
import Share from './dialogTypes/Share';
// import Tour from './Tour';
import SignUp from '../../Auth/SignUp/SignUp.react';
import Login from '../../Auth/Login/Login.react';
import ForgotPassword from '../../Auth/ForgotPassword/ForgotPassword.react';
import ThemeChanger from '../../Settings/ThemeChanger';
import { DialogContainer } from '../Container';
import DeleteAccount from '../../Auth/DeleteAccount/DeleteAccount.react';
import ConfirmDeleteAccount from '../../Auth/DeleteAccount/ConfirmDeleteAccount.react';
import AuthorSkills from '../../cms/AuthorSkills/AuthorSkills';
import UpdateSystemSettings from '../../Admin/Settings/ConfigKeys/UpdateSystemSettingsDialog';
import EditSkill from '../../Admin/ListSkills/EditSkillDialog';
import EditDevice from '../../Admin/ListDevices/EditDeviceDialog';
import ConfirmDialog from './dialogTypes/ConfirmDialog';
import CropDialog from './dialogTypes/CropDialog';
import ReportSkillDialog from '../../cms/SkillPage/ReportSkillDialog';
import EditFeedback from '../../cms/SkillFeedbackPage/EditFeedbackDialog';
import SkillSlideshowDialog from '../../Admin/Settings/Slideshow/Dialog';
import EditUserRole from '../../Admin/ListUser/EditUserRoleDialog';
import DeleteUserAccountDialog from '../../Admin/ListUser/DeleteDialog';
import EditUserDevice from '../../Admin/ListUser/DevicePanel/EditDeviceDialog';
import ConfirmDeleteWithInput from './dialogTypes/confirmDeleteWithInput';
import StandardActionDialog from './dialogTypes/StandardActionDialog';
import ChatApp from '../../ChatApp/ChatApp.react';
import AddDeviceDialog from '../../cms/MyDevices/AddDeviceDialog';
import ResetPasswordDialog from '../../Auth/ResetPassword';
import isMobileView from '../../../utils/isMobileView';
import { withRouter } from 'react-router-dom';

const DialogData = {
  share: { Component: Share, size: 'xs' },
  login: { Component: Login, size: 'sm' },
  signUp: { Component: SignUp, size: 'sm' },
  forgotPassword: { Component: ForgotPassword, size: 'sm' },
  themeChange: {
    Component: ThemeChanger,
    size: 'md',
    fullScreen: isMobileView(),
  },
  // tour: { Component: Tour, size: 'sm' },
  deleteAccount: { Component: DeleteAccount, size: 'sm' },
  confirmDeleteAccount: { Component: ConfirmDeleteAccount, size: 'sm' },
  noComponent: { Component: null, size: false },
  deleteDevice: {
    Component: ConfirmDeleteWithInput,
    size: 'sm',
    componentProps: { entityType: 'device' },
  },
  authorSkills: { Component: AuthorSkills, size: 'md' },
  updateSystemSettings: { Component: UpdateSystemSettings, size: 'sm' },
  createSystemSettings: { Component: UpdateSystemSettings, size: 'sm' },
  deleteSystemSettings: {
    Component: StandardActionDialog,
    size: 'sm',
    componentProps: { entityType: 'key', actionType: 'Delete' },
  },
  deleteSkill: {
    Component: ConfirmDeleteWithInput,
    size: 'sm',
    componentProps: { entityType: 'skill' },
  },
  confirm: { Component: ConfirmDialog, size: 'xs' },
  crop: { Component: CropDialog, size: 'xs' },
  showMessage: { Component: ConfirmDialog, size: 'sm' },
  editSkill: { Component: EditSkill, size: 'sm' },
  editDevice: { Component: EditDevice, size: 'sm' },
  restoreSkill: {
    Component: StandardActionDialog,
    size: 'sm',
    componentProps: { entityType: 'skill', actionType: 'Restore' },
  },
  reportSkill: { Component: ReportSkillDialog, size: 'sm' },
  deleteFeedback: {
    Component: StandardActionDialog,
    size: 'sm',
    componentProps: { entityType: 'feedback', actionType: 'Delete' },
  },
  editFeedback: {
    Component: EditFeedback,
    size: 'sm',
    componentProps: { entityType: 'feedback', actionType: 'Edit' },
  },
  // For skillCreator delete skill
  deleteBot: {
    Component: ConfirmDeleteWithInput,
    size: 'sm',
    componentProps: { entityType: 'bot', actionType: 'Delete' },
  },
  skillSlideshow: { Component: SkillSlideshowDialog, size: 'md' },
  editUserRole: { Component: EditUserRole, size: 'sm' },
  deleteUserAccount: { Component: DeleteUserAccountDialog, size: 'sm' },
  editUserDevice: { Component: EditUserDevice, size: 'sm' },
  chat: {
    Component: ChatApp,
    fullScreen: true,
    style: { padding: '0px', textAlign: 'left' },
  },
  addDevice: {
    Component: AddDeviceDialog,
    size: 'sm',
  },
  resetPass: {
    Component: ResetPasswordDialog,
    size: 'sm',
  },
};

const DialogSection = props => {
  const {
    actions,
    modalProps: { isModalOpen, modalType, ...otherProps },
    visited,
    mode,
    location: { pathname },
  } = props;

  const getDialog = () => {
    if (isModalOpen) {
      return DialogData[modalType];
    }
    // else if (!visited) {
    //   return DialogData.tour;
    // }
    else if (mode === 'fullScreen') {
      return DialogData.chat;
    } else if (pathname === '/resetpass') {
      return DialogData.resetPass;
    }
    return DialogData.noComponent;
  };

  const {
    size,
    Component,
    fullScreen = false,
    style = {
      padding: isMobileView() ? '0.3rem' : '2.4rem 1.5rem',
      textAlign: 'center',
    },
    componentProps = {},
  } = getDialog();
  return (
    <div>
      <Dialog
        maxWidth={size}
        fullWidth={true}
        open={isModalOpen || !visited || mode === 'fullScreen'}
        onClose={isModalOpen ? actions.closeModal : actions.setVisited}
        fullScreen={fullScreen}
      >
        <DialogContainer style={style}>
          {Component ? <Component {...componentProps} {...otherProps} /> : null}
        </DialogContainer>
      </Dialog>
    </div>
  );
};

DialogSection.propTypes = {
  actions: PropTypes.object,
  modalProps: PropTypes.object,
  visited: PropTypes.bool,
  mode: PropTypes.string,
  location: PropTypes.object,
};

function mapStateToProps(store) {
  return {
    modalProps: store.ui.modalProps,
    visited: store.app.visited,
    mode: store.ui.mode,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...appActions, ...uiActions }, dispatch),
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(DialogSection),
);

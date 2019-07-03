import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import uiActions from '../../redux/actions/ui';
import appActions from '../../redux/actions/app';
import Share from './Share';
import Tour from './Tour';
import SignUp from '../Auth/SignUp/SignUp.react';
import Login from '../Auth/Login/Login.react';
import ForgotPassword from '../Auth/ForgotPassword/ForgotPassword.react';
import RemoveDeviceDialog from '../Settings/DevicesTab/RemoveDeviceDialog';
import ThemeChanger from '../Settings/ThemeChanger';
import { DialogContainer } from '../shared/Container';
import DeleteAccount from '../Auth/DeleteAccount/DeleteAccount.react';
import ConfirmDeleteAccount from '../Auth/DeleteAccount/ConfirmDeleteAccount.react';
import AuthorSkills from '../cms/AuthorSkills/AuthorSkills';
import UpdateSystemSettings from '../Admin/SystemSettings/UpdateSystemSettingsDialog';
import DeleteSystemSettings from '../Admin/SystemSettings/DeleteSystemSettingsDialog';
import DeleteSkill from '../Admin/ListSkills/DeleteSkillDialog';
import EditSkill from '../Admin/ListSkills/EditSkillDialog';
import ConfirmSkill from '../Admin/ListSkills/ConfirmSkillDialog';
import RestoreSkill from '../Admin/ListSkills/RestoreSkillDialog';
import ReportSkillDialog from '../cms/SkillPage/ReportSkillDialog';
import DeleteFeedbackDialog from '../cms/SkillFeedbackPage/DeleteFeedbackDialog';
import EditFeedbackDialog from '../cms/SkillFeedbackPage/EditFeedbackDialog';
import DeleteSkillWithInput from '../cms/SkillCreator/DeleteSkillDialog';
import DeleteBot from '../cms/BotBuilder/DeleteBotDialog';
import ChangeUserRoleDialog from '../Admin/ListUser/ChangeUserRoleDialog';
import DeleteUserAccountDialog from '../Admin/ListUser/DeleteUserAccountDialog';
import EditDeviceConfigDialog from '../Admin/ListUser/EditDeviceConfigDialog';

const DialogData = {
  share: { Component: Share, size: 'xs' },
  login: { Component: Login, size: 'sm' },
  signUp: { Component: SignUp, size: 'sm' },
  forgotPassword: { Component: ForgotPassword, size: 'sm' },
  themeChange: { Component: ThemeChanger, size: 'md' },
  tour: { Component: Tour, size: 'sm' },
  deleteAccount: { Component: DeleteAccount, size: 'sm' },
  confirmDeleteAccount: { Component: ConfirmDeleteAccount, size: 'sm' },
  noComponent: { Component: null, size: false },
  deleteDevice: { Component: RemoveDeviceDialog, size: 'sm' },
  authorSkills: { Component: AuthorSkills, size: 'md' },
  updateSystemSettings: { Component: UpdateSystemSettings, size: 'sm' },
  createSystemSettings: { Component: UpdateSystemSettings, size: 'sm' },
  deleteSystemSettings: { Component: DeleteSystemSettings, size: 'sm' },
  deleteSkill: { Component: DeleteSkill, size: 'xs' },
  confirmSkill: { Component: ConfirmSkill, size: 'xs' },
  editSkill: { Component: EditSkill, size: 'sm' },
  restoreSkill: { Component: RestoreSkill, size: 'xs' },
  reportSkill: { Component: ReportSkillDialog, size: 'sm' },
  deleteFeedback: { Component: DeleteFeedbackDialog, size: 'sm' },
  editFeedback: { Component: EditFeedbackDialog, size: 'sm' },
  // For skillCreator delete skill
  deleteSkillWithInput: { Component: DeleteSkillWithInput, size: 'sm' },
  deleteBot: { Component: DeleteBot, size: 'sm' },
  changeUserRole: { Component: ChangeUserRoleDialog, size: 'sm' },
  deleteUser: { Component: DeleteUserAccountDialog, size: 'sm' },
  editDevice: { Component: EditDeviceConfigDialog, size: 'sm' },
};

const DialogSection = props => {
  const {
    actions,
    modalProps: { isModalOpen, modalType, ...otherProps },
    visited,
  } = props;

  const getDialog = () => {
    if (isModalOpen) {
      return DialogData[modalType];
    } else if (!visited) {
      return DialogData.tour;
    }
    return DialogData.noComponent;
  };

  const { size, Component } = getDialog();
  return (
    <div>
      <Dialog
        maxWidth={size}
        fullWidth={true}
        open={isModalOpen || !visited}
        onClose={isModalOpen ? actions.closeModal : actions.setVisited}
      >
        <DialogContainer>
          {Component ? <Component {...otherProps} /> : null}
        </DialogContainer>
      </Dialog>
    </div>
  );
};

DialogSection.propTypes = {
  actions: PropTypes.object,
  modalProps: PropTypes.object,
  visited: PropTypes.bool,
};

function mapStateToProps(store) {
  return {
    modalProps: store.ui.modalProps,
    visited: store.app.visited,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...appActions, ...uiActions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DialogSection);

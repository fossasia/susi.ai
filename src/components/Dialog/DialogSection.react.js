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
import DeleteAccountModal from '../Auth/DeleteAccount/DeleteAccountModal.react';

const DialogData = {
  share: { Component: Share, size: 'xs' },
  login: { Component: Login, size: 'sm' },
  signUp: { Component: SignUp, size: 'sm' },
  forgotPassword: { Component: ForgotPassword, size: 'sm' },
  themeChange: { Component: ThemeChanger, size: 'md' },
  tour: { Component: Tour, size: 'sm' },
  deleteAccount: { Component: DeleteAccountModal, size: 'sm' },
  noComponent: { Component: null, size: false },
  deleteDevice: { Component: RemoveDeviceDialog, size: 'sm' },
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
  const addPadding = modalType !== 'deleteAccount';
  return (
    <div>
      <Dialog
        maxWidth={size}
        fullWidth={true}
        open={isModalOpen || !visited}
        onClose={isModalOpen ? actions.closeModal : actions.setVisited}
      >
        <DialogContainer padding={addPadding}>
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

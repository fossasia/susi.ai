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
import ThemeChanger from '../Settings/ThemeChanger';
import { DialogContainer } from '../shared/Container';
import DeleteAccountModal from '../Auth/DeleteAccount/DeleteAccountModal.react';

const DialogData = {
  share: { component: <Share />, size: 'xs' },
  login: { component: <Login />, size: 'sm' },
  signUp: { component: <SignUp />, size: 'sm' },
  forgotPassword: { component: <ForgotPassword />, size: 'sm' },
  themeChange: { component: <ThemeChanger />, size: 'md' },
  tour: { component: <Tour />, size: 'sm' },
  deleteAccount: { component: <DeleteAccountModal />, size: 'sm' },
  noComponent: { component: null, size: false },
};

const DialogSection = props => {
  const {
    actions,
    modalProps: { isModalOpen, modalType },
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
  const { size, component } = getDialog();
  const addPadding = modalType !== 'deleteAccount';
  return (
    <div>
      <Dialog
        maxWidth={size}
        fullWidth={true}
        open={isModalOpen || !visited}
        onClose={isModalOpen ? actions.closeModal : actions.setVisited}
      >
        <DialogContainer padding={addPadding}>{component}</DialogContainer>
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

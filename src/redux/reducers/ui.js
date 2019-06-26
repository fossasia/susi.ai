import { handleActions } from 'redux-actions';
import actionTypes from '../actionTypes';

const defaultState = {
  modalProps: {
    isModalOpen: false,
    modalType: '',
  },
  snackBarProps: {
    isSnackBarOpen: false,
    snackBarMessage: '',
    snackBarDuration: 2500,
    snackBarPosition: { vertical: 'bottom', horizontal: 'center' },
    variant: '',
  },
};

export default handleActions(
  {
    [actionTypes.UI_OPEN_MODAL](state, { payload }) {
      return {
        ...state,
        modalProps: {
          isModalOpen: true,
          ...payload,
        },
      };
    },
    [actionTypes.UI_CLOSE_MODAL](state) {
      return {
        ...state,
        modalProps: defaultState.modalProps,
      };
    },
    [actionTypes.UI_OPEN_SNACKBAR](state, { payload }) {
      return {
        ...state,
        snackBarProps: {
          ...state.snackBarProps,
          isSnackBarOpen: true,
          ...payload,
        },
      };
    },
    [actionTypes.UI_CLOSE_SNACKBAR](state) {
      return {
        ...state,
        snackBarProps: defaultState.snackBarProps,
      };
    },
  },
  defaultState,
);

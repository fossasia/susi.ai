import { createAction } from 'redux-actions';
import actionTypes from '../actionTypes';

const returnArgumentsFn = function(payload) {
  return Promise.resolve(payload);
};

const dialogActions = {
  openModal: createAction(actionTypes.UI_OPEN_MODAL, returnArgumentsFn),
  closeModal: createAction(actionTypes.UI_CLOSE_MODAL, returnArgumentsFn),
  openSnackBar: createAction(actionTypes.UI_OPEN_SNACKBAR, returnArgumentsFn),
  closeSnackBar: createAction(actionTypes.UI_CLOSE_SNACKBAR, returnArgumentsFn),
  handleChatBubble: createAction(
    actionTypes.HANDLE_CHAT_BUBBLE,
    returnArgumentsFn,
  ),
};

export default dialogActions;

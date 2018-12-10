import { createAction } from 'redux-actions';
import actionTypes from '../actionTypes';
import * as apis from '../../apis';

const returnArgumentsFn = function(payload) {
  return Promise.resolve(payload);
};

const messageActions = {
  markAllRead: createAction(actionTypes.MESSAGES_MARK_ALL_READ),
  createMessage: createAction(
    actionTypes.MESSAGES_CREATE_USER_MESSAGE,
    returnArgumentsFn,
  ),
  createSusiMessage: createAction(
    actionTypes.MESSAGES_CREATE_SUSI_MESSAGE,
    returnArgumentsFn,
  ),
  resetVoice: createAction(actionTypes.MESSAGES_RESET_MESSAGE_VOICE),
  saveFeedback: createAction(
    actionTypes.MESSAGES_FEEDBACK_RECEIVED,
    returnArgumentsFn,
  ),
  initializeMessageStore: createAction(
    actionTypes.MESSAGES_GET_HISTORY_FROM_SERVER,
    apis.getHistory,
  ),
  createHistoryMessages: createAction(
    actionTypes.MESSAGES_CREATE_HISTORY_MESSAGES,
    returnArgumentsFn,
  ),
};

export default messageActions;

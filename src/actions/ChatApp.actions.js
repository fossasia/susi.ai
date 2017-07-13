import ChatAppDispatcher from '../dispatcher/ChatAppDispatcher';
import * as ChatWebAPIUtils from '../utils/ChatWebAPIUtils';
import * as ChatMessageUtils from '../utils/ChatMessageUtils';
import ChatConstants from '../constants/ChatConstants';
import * as Actions from './API.actions';

let ActionTypes = ChatConstants.ActionTypes;

export function createMessage(text, currentThreadID, voice) {
  Actions.sendFeedback();
  let message = ChatMessageUtils.getCreatedMessageData(text, currentThreadID, voice);
  ChatAppDispatcher.dispatch({
    type: ActionTypes.CREATE_MESSAGE,
    message
  });
  ChatWebAPIUtils.createMessage(message);
};

export function receiveCreatedMessage(createdMessage, tempMessageID) {
  ChatAppDispatcher.dispatch({
    type: ActionTypes.RECEIVE_RAW_CREATED_MESSAGE,
    rawMessage: createdMessage,
    tempMessageID
  });
};

export function clickThread(threadID) {
  ChatAppDispatcher.dispatch({
    type: ActionTypes.CLICK_THREAD,
    threadID
  });
};

export function receiveAll(rawMessages) {
  ChatAppDispatcher.dispatch({
    type: ActionTypes.RECEIVE_RAW_MESSAGES,
    rawMessages
  });
};

export function resetVoice() {
  ChatAppDispatcher.dispatch({
    type: ActionTypes.RESET_MESSAGE_VOICE,
  });
};

export function saveFeedback(feedback) {
  ChatAppDispatcher.dispatch({
    type: ActionTypes.FEEDBACK_RECEIVED,
    feedback
  });
};

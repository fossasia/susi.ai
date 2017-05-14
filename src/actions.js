import ChatAppDispatcher from './dispatcher/ChatAppDispatcher';
import * as ChatWebAPIUtils from './utils/ChatWebAPIUtils';
import * as ChatMessageUtils from './utils/ChatMessageUtils';
import ChatConstants from './constants/ChatConstants';

let ActionTypes = ChatConstants.ActionTypes;

export function createMessage(text, currentThreadID) {
  let message = ChatMessageUtils.getCreatedMessageData(text, currentThreadID);
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

export function createSUSIMessage(createdMessage, currentThreadID) {
  let message = ChatMessageUtils.getSUSIMessageData(createdMessage, currentThreadID);
  ChatAppDispatcher.dispatch({
    type: ActionTypes.CREATE_SUSI_MESSAGE,
    message
  });
  ChatWebAPIUtils.receiveSUSIMessage(message);
};

export function postSUSIMessage(receivedSUSIMessage, tempMessageID) {
  ChatAppDispatcher.dispatch({
    type: ActionTypes.RECEIVE_SUSI_MESSAGE,
    rawMessage: receivedSUSIMessage,
    tempMessageID
  });
}
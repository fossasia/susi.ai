import ChatAppDispatcher from './dispatcher/ChatAppDispatcher';
import * as ChatWebAPIUtils from './utils/ChatWebAPIUtils';
import * as ChatMessageUtils from './utils/ChatMessageUtils';
import ChatConstants from './constants/ChatConstants';
import $ from 'jquery';

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
   var timestamp = Date.now();

  let receivedMessage =  {
    id: 'm_' + timestamp,
    threadID: currentThreadID,
    authorName: 'SUSI', // hard coded for the example
    text: '',
    response: {},
    date: new Date(timestamp),
    isRead: true,
  };
  // Ajax Success calls the Dispatcher to CREATE_SUSI_MESSAGE
  $.ajax({
    url: 'http://api.asksusi.com/susi/chat.json?q='+createdMessage.text,
    dataType: 'jsonp',
    jsonpCallback: 'p',
    jsonp: 'callback',
    crossDomain: true,
    timeout: 3000,
    async: false,
    success: function (response) {
       receivedMessage.text = response.answers[0].actions[0].expression;
       receivedMessage.response = response;
        let message =  ChatMessageUtils.getSUSIMessageData(
          receivedMessage, currentThreadID
        );

        ChatAppDispatcher.dispatch({
          type: ActionTypes.CREATE_SUSI_MESSAGE,
          message
        });
      },
    error: function(errorThrown) {
      console.log(errorThrown);
      receivedMessage.text = 'Please check your internet connection';

    }
  });
};

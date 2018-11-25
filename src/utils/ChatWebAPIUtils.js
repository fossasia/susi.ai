import * as Actions from '../actions/';
import * as ChatDataServer from '../ChatDataServer';

/*
  The createMessage function receives the client's message and calls for
  a SUSI Message creation using Actions.createSUSIMessage()
*/
export const createMessage = message => {
  ChatDataServer.postMessage(message, createdMessage => {
    Actions.receiveCreatedMessage(createdMessage, message.id);
    Actions.createSUSIMessage(createdMessage, message.threadID, message.voice);
  });
};

export const getAllMessages = () => {
  ChatDataServer.getMessages(messages => {
    Actions.receiveAll(messages);
  });
};

export const getHistory = () => {
  Actions.getHistory();
};

export const getLocation = () => {
  Actions.getLocation();
};

export const getSettings = () => {
  Actions.getSettings();
};

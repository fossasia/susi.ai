import * as Actions from '../actions/';
import * as ChatDataServer from '../ChatDataServer';

/*
  The createMessage function receives the client's message and calls for
  a SUSI Message creation using Actions.createSUSIMessage()
*/
export function createMessage(message) {
  ChatDataServer.postMessage(message, createdMessage => {
    Actions.receiveCreatedMessage(createdMessage, message.id);
    Actions.createSUSIMessage(createdMessage, message.threadID, message.voice);
  });
};

export function getAllMessages() {
  ChatDataServer.getMessages(messages => {
    Actions.receiveAll(messages);
  });
};

export function getHistory(){
	Actions.getHistory();
}

export function getLocation(){
  Actions.getLocation();
}

export function getSettings(){
  Actions.getSettings();
}

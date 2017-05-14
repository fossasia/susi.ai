
import * as Actions from '../actions';
import * as ChatExampleDataServer from '../ChatExampleDataServer';

export function createMessage(message) {
  ChatExampleDataServer.postMessage(message, createdMessage => {
    Actions.receiveCreatedMessage(createdMessage, message.id);
  });
  ChatExampleDataServer.postSUSIMessage(message, createdMessage => {
    Actions.createSUSIMessage(createdMessage, message.threadID);
  });
};

export function receiveSUSIMessage(message) {
	ChatExampleDataServer.postSUSIMessage(message, receivedSUSIMessage => {
		Actions.postSUSIMessage(message, message.id);
	})
}

export function getAllMessages() {
  ChatExampleDataServer.getMessages(messages => {
    Actions.receiveAll(messages);
  });
};
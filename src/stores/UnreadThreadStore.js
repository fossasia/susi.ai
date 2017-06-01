import ChatAppDispatcher from '../dispatcher/ChatAppDispatcher';
import ChatConstants from '../constants/ChatConstants';
import { EventEmitter } from 'events';
import MessageStore from '../stores/MessageStore';
import ThreadStore from '../stores/ThreadStore';

let ActionTypes = ChatConstants.ActionTypes;
let CHANGE_EVENT = 'change';

let UnreadThreadStore = {
  ...EventEmitter.prototype,

  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getCount() {
    let threads = ThreadStore.getAll();
    let unreadCount = 0;
    for (let id in threads) {
      if (!threads[id].lastMessage.isRead) {
        unreadCount++;
      }
    }
    return unreadCount;
  }

};

UnreadThreadStore.dispatchToken = ChatAppDispatcher.register(action => {
  ChatAppDispatcher.waitFor([
    ThreadStore.dispatchToken,
    MessageStore.dispatchToken
  ]);

  switch (action.type) {

    case ActionTypes.CLICK_THREAD:
      UnreadThreadStore.emitChange();
      break;

    case ActionTypes.RECEIVE_RAW_MESSAGES:
      UnreadThreadStore.emitChange();
      break;

    default:
      // do nothing
  }
});

export default UnreadThreadStore;

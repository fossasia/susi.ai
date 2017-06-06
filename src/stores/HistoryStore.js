import ChatAppDispatcher from '../dispatcher/ChatAppDispatcher';
import ChatConstants from '../constants/ChatConstants';
import { EventEmitter } from 'events';
import ThreadStore from '../stores/ThreadStore';

let ActionTypes = ChatConstants.ActionTypes;
let CHANGE_EVENT = 'change';

let _history = {};

let HistoryStore = {
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

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  /**
   * @param {string} threadID
   */
  getAllForThread(threadID) {
    let threadMessages = [];
    for (let id in _history) {
      if (_history[id].threadID === threadID) {
        threadMessages.push(_history[id]);
      }
    }
    threadMessages.sort((a, b) => {
      if (a.date < b.date) {
        return -1;
      } else if (a.date > b.date) {
        return 1;
      }
      return 0;
    });
    return threadMessages;
  },

  getAllForCurrentThread() {
    return this.getAllForThread(ThreadStore.getCurrentID());
  }

};

HistoryStore.dispatchToken = ChatAppDispatcher.register(action => {

  switch(action.type) {

    case ActionTypes.STORE_HISTORY_MESSAGE: {
      let message = action.message;
      _history[message.id] = message;
      HistoryStore.emitChange();
      break;
    }

    default:
      // do nothing
  }

});

export default HistoryStore;

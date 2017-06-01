import ChatAppDispatcher from '../dispatcher/ChatAppDispatcher';
import ChatConstants from '../constants/ChatConstants';
import * as ChatMessageUtils from '../utils/ChatMessageUtils';
import { EventEmitter } from 'events';

let ActionTypes = ChatConstants.ActionTypes;
let CHANGE_EVENT = 'change';

let _currentID = null;
let _threads = {};

let ThreadStore = {
  ...EventEmitter.prototype,

  init(rawMessages) {
    rawMessages.forEach(message => {
      let threadID = message.threadID;
      let thread = _threads[threadID];
      if (thread && thread.lastMessage.timestamp > message.timestamp) {
        return;
      }
      _threads[threadID] = {
        id: threadID,
        name: message.threadName,
        lastMessage: ChatMessageUtils.convertRawMessage(message, _currentID)
      };
    });

    if (!_currentID) {
      let allChrono = this.getAllChrono();
      _currentID = allChrono[allChrono.length - 1].id;
    }

    _threads[_currentID].lastMessage.isRead = true;
  },

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

  /**
   * @param {string} id
   */
  get(id) {
    return _threads[id];
  },

  getAll() {
    return _threads;
  },

  getAllChrono() {
    let orderedThreads = [];
    for (let id in _threads) {
      let thread = _threads[id];
      orderedThreads.push(thread);
    }
    orderedThreads.sort(function(a, b) {
      if (a.lastMessage.date < b.lastMessage.date) {
        return -1;
      } else if (a.lastMessage.date > b.lastMessage.date) {
        return 1;
      }
      return 0;
    });
    return orderedThreads;
  },

  getCurrentID() {
    return _currentID;
  },

  getCurrent() {
    return this.get(this.getCurrentID());
  }

};

ThreadStore.dispatchToken = ChatAppDispatcher.register(action => {

  switch(action.type) {

    case ActionTypes.CLICK_THREAD:
      _currentID = action.threadID;
      _threads[_currentID].lastMessage.isRead = true;
      ThreadStore.emitChange();
      break;

    case ActionTypes.CREATE_MESSAGE: {
      let message = action.message;
      _threads[message.threadID].lastMessage = message;
      ThreadStore.emitChange();
      break;
    }

    case ActionTypes.RECEIVE_RAW_CREATED_MESSAGE: {
      let rawMessage = action.rawMessage;
      let currentThreadID = ThreadStore.getCurrentID();
      let message = ChatMessageUtils.convertRawMessage(
        rawMessage, currentThreadID
      );
      _threads[message.threadID].lastMessage = message;
      ThreadStore.emitChange();
      break;
    }

    case ActionTypes.RECEIVE_RAW_MESSAGES:
      ThreadStore.init(action.rawMessages);
      ThreadStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default ThreadStore;

import ChatAppDispatcher from '../dispatcher/ChatAppDispatcher';
import ChatConstants from '../constants/ChatConstants';
import * as ChatMessageUtils from '../utils/ChatMessageUtils';
import { EventEmitter } from 'events';
import ThreadStore from './ThreadStore';

let ActionTypes = ChatConstants.ActionTypes;
let CHANGE_EVENT = 'change';
let lang = 'en-US';
let _messages = {};
let _feedback = {};
let _showLoading = false;

function _markAllInThreadRead(threadID) {
  for (let id in _messages) {
    if (_messages[id].threadID === threadID) {
      _messages[id].isRead = true;
    }
  }
}

function _addDates(allMsgs){
  let msgsWithDates = [];
  let currDate = null;
  allMsgs.forEach((message)=>{
    if(currDate === null){
      let dateMsg = {
          id: 'd_'+Date.parse(message.date),
          threadID: 't_1',
          date: message.date,
          type: 'date',
        };
      msgsWithDates.push(dateMsg);
    }
    else if(currDate.getDate() !== message.date.getDate()){
      let dateMsg = {
          id: 'd_'+Date.parse(message.date),
          threadID: 't_1',
          date: message.date,
          type: 'date',
        };
      msgsWithDates.push(dateMsg);
    }
    currDate = message.date;
    msgsWithDates.push(message);
  });
  return msgsWithDates;
}

let MessageStore = {
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

  get(id) {
    return _messages[id];
  },

  getAll() {
    return _messages;

  },

  getLang() {
    return lang
  },

  getLoadStatus(){
    return _showLoading;
  },

  getFeedback(){
    return _feedback;
  },

  /**
   * @param {string} threadID
   */
  getAllForThread(threadID) {
    let threadMessages = [];
    for (let id in _messages) {
      if (_messages[id].threadID === threadID) {
        threadMessages.push(_messages[id]);
      }
    }
    threadMessages.sort((a, b) => {
      if (a.date < b.date) {
        return -1;
      }
      else if (a.date > b.date) {
        return 1;
      }
      return 0;
    });
    return threadMessages;
  },

  getAllForCurrentThread() {
    return _addDates(this.getAllForThread(ThreadStore.getCurrentID()));
  },

  resetVoiceForThread(threadID) {
    for (let id in _messages) {
      if ((_messages[id].threadID === threadID) &&
          (_messages[id].authorName === 'SUSI')) {
          _messages[id].voice = false;
          _messages[id].feedback.isRated = true;
      }
    }
  },

  resetVoiceForCurrentThread(){
    this.resetVoiceForThread(ThreadStore.getCurrentID());
  }

};

MessageStore.dispatchToken = ChatAppDispatcher.register(action => {

  switch(action.type) {

    case ActionTypes.CLICK_THREAD:
      ChatAppDispatcher.waitFor([ThreadStore.dispatchToken]);
      _markAllInThreadRead(ThreadStore.getCurrentID());
      MessageStore.emitChange();
      break;

    case ActionTypes.CREATE_MESSAGE: {
      let message = action.message;
      _messages[message.id] = message;
      _showLoading = true;
      MessageStore.emitChange();
      break;
    }

    case ActionTypes.RECEIVE_RAW_CREATED_MESSAGE: {
      let { rawMessage, tempMessageID } = action;
      delete _messages[tempMessageID];
      let message = ChatMessageUtils.convertRawMessage(rawMessage);
      _messages[message.id] = message;
      MessageStore.emitChange();
      break;
    }

    case ActionTypes.CREATE_SUSI_MESSAGE: {
      let message = action.message;
      lang = message.lang;
      console.log(message.lang);
      MessageStore.resetVoiceForThread(message.threadID);
      _messages[message.id] = message;
      _showLoading = false;
      _feedback = {};
      MessageStore.emitChange();
      break;
    }

    case ActionTypes.STORE_HISTORY_MESSAGE: {
      let message = action.message;
      _messages[message.id] = message;
      MessageStore.emitChange();
      break;
    }

    case ActionTypes.RESET_MESSAGE_VOICE: {
      MessageStore.resetVoiceForCurrentThread();
      MessageStore.emitChange();
      break;
    }

    case ActionTypes.FEEDBACK_RECEIVED: {
      _feedback = action.feedback;
      MessageStore.emitChange();
      break;
    }

    default:
      // do nothing
  }

});

export default MessageStore;

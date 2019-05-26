import { handleActions } from 'redux-actions';
import actionTypes from '../actionTypes';

const defaultState = {
  messages: [],
  messagesByID: {},
  unreadMessageIDs: [],
  skillFeedbackByMessageId: {},
  loadingHistory: false,
  loadingHistoryError: false,
  loadingReply: false,
  initialisedVoices: false,
  historyBuffer: [],
};

export default handleActions(
  {
    [actionTypes.MESSAGES_MARK_ALL_READ](state, { payload }) {
      return {
        ...state,
        unreadMessageIDs: [],
      };
    },
    [actionTypes.MESSAGES_CREATE_USER_MESSAGE](state, { payload }) {
      const { message } = payload;
      let { messages, messagesByID } = state;
      messages = [...messages, message.id];
      messagesByID[message.id] = message;
      return {
        ...state,
        messages,
        messagesByID,
        loadingReply: true,
      };
    },
    [actionTypes.MESSAGES_CREATE_SUSI_MESSAGE](state, { payload }) {
      const { message } = payload;
      let { messages, messagesByID } = state;
      // setting voice for all other SUSI message to false ( inefficient )
      // messagesByID.forEach(message => {
      //   if (message.authorName === 'SUSI') {
      //     message.voice = false;
      //   }
      // });
      messages = [...messages, message.id];
      messagesByID[message.id] = message;
      return {
        ...state,
        messages,
        messagesByID,
        loadingReply: false,
      };
    },
    [actionTypes.MESSAGES_STORE_HISTORY_MESSAGE](state, { payload }) {
      const { message } = payload;
      let { historyBuffer, messages, messagesByID } = state;
      historyBuffer.push(message);
      if (historyBuffer.length === message.historyCognitionsCount * 2) {
        historyBuffer.forEach((cognition, index) => {
          messagesByID[cognition.id] = cognition;
          if (messages.indexOf(cognition.id) === -1) {
            messages = [...messages, cognition.id];
          }
        });
        historyBuffer.splice(0, historyBuffer.length);
      }
      return {
        ...state,
        historyBuffer,
        messages,
        messagesByID,
      };
    },
    [actionTypes.MESSAGES_RESET_MESSAGE_VOICE](state, { payload }) {
      let { messagesByID } = state;
      messagesByID.forEach(message => {
        if (message.authorName === 'SUSI') {
          message.voice = false;
        }
      });
      return {
        ...state,
        messagesByID,
      };
    },
    [actionTypes.MESSAGES_SAVE_SKILL_FEEDBACK](state, { payload }) {
      const { messageId, feedback } = payload;
      return {
        ...state,
        skillFeedbackByMessageId: {
          ...state.skillFeedbackByMessageId,
          [messageId]: feedback,
        },
      };
    },
    [actionTypes.MESSAGES_GET_HISTORY_FROM_SERVER](state, { payload }) {
      return {
        ...defaultState,
        loadingHistory: true,
        loadingHistoryError: false,
      };
    },
    [actionTypes.MESSAGES_INITIALIZE_MESSAGE_STORE](state, { payload }) {
      let { messagePairArray } = payload;
      let messages = [];
      let messagesByID = {};
      if (Array.isArray(messagePairArray)) {
        messagePairArray = messagePairArray.reverse();
        messagePairArray.forEach(messagePair => {
          const { userMessage, susiMessage } = messagePair;
          messages.push(userMessage.id);
          messages.push(susiMessage.id);
          messagesByID[userMessage.id] = userMessage;
          messagesByID[susiMessage.id] = susiMessage;
        });
      }
      return {
        ...defaultState,
        messages,
        messagesByID,
        loadingHistory: false,
      };
    },
    [actionTypes.MESSAGES_INITIALIZE_MESSAGE_STORE_FAILED](state, { payload }) {
      return {
        ...defaultState,
        loadingHistory: false,
        loadingHistoryError: true,
      };
    },
    [actionTypes.APP_LOGOUT](state, { payload }) {
      return {
        ...defaultState,
      };
    },
  },
  defaultState,
);

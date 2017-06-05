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

  let receivedMessage = {
    id: 'm_' + timestamp,
    threadID: currentThreadID,
    authorName: 'SUSI', // hard coded for the example
    text: '',
    response: {},
    actions: [],
    websearchresults: [],
    date: new Date(timestamp),
    isRead: true,
  };
  // Fetching local browser language
  var locale = document.documentElement.getAttribute('lang');
  // Ajax Success calls the Dispatcher to CREATE_SUSI_MESSAGE
  $.ajax({
    url: 'http://api.asksusi.com/susi/chat.json?q='+createdMessage.text+'&language='+locale,
    dataType: 'jsonp',
    jsonpCallback: 'p',
    jsonp: 'callback',
    crossDomain: true,
    timeout: 3000,
    async: false,
    success: function (response) {
      receivedMessage.text = response.answers[0].actions[0].expression;
      receivedMessage.response = response;
      let actions = [];
      response.answers[0].actions.forEach((actionobj) => {
        actions.push(actionobj.type);
      });
      receivedMessage.actions = actions;
      if (actions.indexOf('websearch') >= 0) {
        let actionIndex = actions.indexOf('websearch');
        let query = response.answers[0].actions[actionIndex].query;
        $.ajax({
          url: 'http://api.duckduckgo.com/?format=json&q=' + query,
          dataType: 'jsonp',
          crossDomain: true,
          timeout: 3000,
          async: false,
          success: function (data) {
            receivedMessage.websearchresults = data.RelatedTopics;
            if (data.AbstractText) {
              let abstractTile = {
                Text: '',
                FirstURL: '',
                Icon: { URL: '' },
              }
              abstractTile.Text = data.AbstractText;
              abstractTile.FirstURL = data.AbstractURL;
              abstractTile.Icon.URL = data.Image;
              receivedMessage.websearchresults.unshift(abstractTile);
            }
            let message = ChatMessageUtils.getSUSIMessageData(
              receivedMessage, currentThreadID);
            ChatAppDispatcher.dispatch({
              type: ActionTypes.CREATE_SUSI_MESSAGE,
              message
            });
          },
          error: function (errorThrown) {
            console.log(errorThrown);
            receivedMessage.text = 'Please check your internet connection';
          }
        });
      }
      else {
        let message = ChatMessageUtils.getSUSIMessageData(
          receivedMessage, currentThreadID);

        ChatAppDispatcher.dispatch({
          type: ActionTypes.CREATE_SUSI_MESSAGE,
          message
        });
      }
    },
    error: function (errorThrown) {
      console.log(errorThrown);
      receivedMessage.text = 'Please check your internet connection';
    }
  });
};

export function getHistory() {

  $.ajax({
    url: 'http://api.susi.ai/susi/memory.json',
    dataType: 'jsonp',
    crossDomain: true,
    timeout: 3000,
    async: false,
    success: function (history) {
      history.cognitions.forEach((cognition) => {

        let susiMsg = {
          id: 'm_',
          threadID: 't_1',
          authorName: 'SUSI', // hard coded for the example
          text: '',
          response: {},
          actions: [],
          websearchresults: [],
          date: '',
          isRead: true,
        };

        let userMsg = {
          id: 'm_',
          threadID: 't_1',
          authorName: 'You',
          date: '',
          text: '',
          isRead: true
        };

        let query = cognition.query;

        userMsg.id = 'm_' + Date.parse(cognition.query_date);
        userMsg.date = new Date(cognition.query_date);
        userMsg.text = query;

        susiMsg.id = 'm_' + Date.parse(cognition.answer_date);
        susiMsg.date = new Date(cognition.answer_date);
        susiMsg.text = cognition.answers[0].actions[0].expression;
        susiMsg.response = cognition;

        let actions = [];
        cognition.answers[0].actions.forEach((actionObj) => {
          actions.push(actionObj.type);
        });
        susiMsg.actions = actions;

        if (actions.indexOf('websearch') >= 0) {
          $.ajax({
            url: 'http://api.duckduckgo.com/?format=json&q=' + query,
            dataType: 'jsonp',
            crossDomain: true,
            timeout: 3000,
            async: false,
            success: function (data) {
              susiMsg.websearchresults = data.RelatedTopics;
              if (data.AbstractText) {
                let abstractTile = {
                  Text: '',
                  FirstURL: '',
                  Icon: { URL: '' },
                }
                abstractTile.Text = data.AbstractText;
                abstractTile.FirstURL = data.AbstractURL;
                abstractTile.Icon.URL = data.Image;
                susiMsg.websearchresults.unshift(abstractTile);
              }
            },
            error: function (errorThrown) {
              console.log(errorThrown);
              susiMsg.text = 'Please check your internet connection';
            }
          });
        }

        let message = userMsg;
        ChatAppDispatcher.dispatch({
          type: ActionTypes.STORE_HISTORY_MESSAGE,
          message
        });

        message = susiMsg;
        ChatAppDispatcher.dispatch({
          type: ActionTypes.STORE_HISTORY_MESSAGE,
          message
        });
      });
    },
    error: function (errorThrown) {
      console.log(errorThrown);
    }
  });
}
export function themeChanged(theme) {
  ChatAppDispatcher.dispatch({
    type: ActionTypes.THEME_CHANGED,
    theme
  });
};

export function ToggleSearch() {
  ChatAppDispatcher.dispatch({
    type: ActionTypes.SEARCH_MODE
  });
};

export function ToggleHistory() {
  ChatAppDispatcher.dispatch({
    type: ActionTypes.SHOW_HISTORY_CHANGED
  });
};

import ChatAppDispatcher from './dispatcher/ChatAppDispatcher';
import * as ChatWebAPIUtils from './utils/ChatWebAPIUtils';
import * as ChatMessageUtils from './utils/ChatMessageUtils';
import ChatConstants from './constants/ChatConstants';
import $ from 'jquery';

import Cookies from 'universal-cookie';

const cookies = new Cookies();
let ActionTypes = ChatConstants.ActionTypes;

let _Location = null;

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

export function getLocation(){
  $.ajax({
    url: 'http://ipinfo.io/json',
    dataType: 'jsonp',
    crossDomain: true,
    timeout: 3000,
    async: false,
    success: function (response) {
      let loc = response.loc.split(',');
      _Location = {
        lat: loc[0],
        lng: loc[1],
      };
    },
    error: function(errorThrown){
      console.log(errorThrown);
      _Location = null;
    }
  });
}

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

  let url = '';
  // Fetching local browser language
  var locale = document.documentElement.getAttribute('lang');
  // Ajax Success calls the Dispatcher to CREATE_SUSI_MESSAGE
  if(cookies.get('loggedIn')===null || cookies.get('loggedIn')===undefined){
    url = 'http://api.asksusi.com/susi/chat.json?q='+createdMessage.text+'&language='+locale;
  }
  else{
    url = 'http://api.asksusi.com/susi/chat.json?q='+createdMessage.text+'&language='+locale+'&access_token='+cookies.get('loggedIn');
  }
  if(_Location){
    url = url+'&latitude='+_Location.lat+'&longitude='+_Location.lng;
  }
  $.ajax({
    url: url,
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
        let actionJson = response.answers[0].actions[actionIndex];
        let query = actionJson.query;
        let count = -1;
        if(actionJson.hasOwnProperty('count')){
          count = actionJson.count;
        }
        $.ajax({
          url: 'http://api.duckduckgo.com/?format=json&q=' + query,
          dataType: 'jsonp',
          crossDomain: true,
          timeout: 3000,
          async: false,
          success: function (data) {
            if(count === -1){
              count = data.RelatedTopics.length+1;
            }
            if(count > 0 && data.AbstractText){
              let abstractTile = {
                title: '',
                description: '',
                link: '',
                icon: '',
              }
              abstractTile.title = data.Heading;
              abstractTile.description = data.AbstractText;
              abstractTile.link = data.AbstractURL;
              abstractTile.icon = data.Image;
              receivedMessage.websearchresults.push(abstractTile);
              count--;
            }
            for(var tileKey=0;
            tileKey<data.RelatedTopics.length && count > 0;
            tileKey++) {
              let tileData = data.RelatedTopics[tileKey];
              if(!tileData.hasOwnProperty('Name')){
                let websearchTile = {
                  title: '',
                  description: '',
                  link: '',
                  icon: '',
                };
                websearchTile.title =
                  tileData.Result.match(/<a [^>]+>([^<]+)<\/a>/)[1];
                websearchTile.description = tileData.Text;
                websearchTile.link = tileData.FirstURL;
                websearchTile.icon = tileData.Icon.URL;
                receivedMessage.websearchresults.push(websearchTile);
                count--;
              }
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
  let url = '';
  if(cookies.get('loggedIn')===null || cookies.get('loggedIn')===undefined){
    url = 'http://api.susi.ai/susi/memory.json';
    console.log(url);
  }
    else{
      url = 'http://api.susi.ai/susi/memory.json?access_token='+cookies.get('loggedIn');
      console.log(url);
    }
  $.ajax({
    url: url,
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

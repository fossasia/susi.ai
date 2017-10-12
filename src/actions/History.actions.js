import Cookies from 'universal-cookie';
import $ from 'jquery';
import ChatAppDispatcher from '../dispatcher/ChatAppDispatcher';
import ChatConstants from '../constants/ChatConstants';
import UserPreferencesStore from '../stores/UserPreferencesStore';

const cookies = new Cookies();

let ActionTypes = ChatConstants.ActionTypes;

// Action to get user chat history
export function getHistory() {
  let BASE_URL = '';
  let defaults = UserPreferencesStore.getPreferences();
  let defaultServerURL = defaults.Server;

  if(cookies.get('serverUrl')===defaultServerURL||
    cookies.get('serverUrl')===null||
    cookies.get('serverUrl')=== undefined){
    BASE_URL = defaultServerURL;
  }
  else{
    BASE_URL= cookies.get('serverUrl');
  }

  let url = '';
  if(cookies.get('loggedIn')===null||
    cookies.get('loggedIn')===undefined){
    url = BASE_URL+'/susi/memory.json';
  }
  else{
    url = BASE_URL+'/susi/memory.json?access_token='+cookies.get('loggedIn');
  }
  $.ajax({
    url: url,
    dataType: 'jsonp',
    crossDomain: true,
    timeout: 3000,
    async: false,
    success: function (history) {

      var historyCognitionsCount = history.cognitions.length;

      history.cognitions.forEach((cognition) => {

        let susiMsg = {
          id: 'm_',
          threadID: 't_1',
          authorName: 'SUSI', // hard coded for the example
          text: '',
          response: {},
          actions: [],
          websearchresults: [],
          rssResults: [],
          date: '',
          isRead: true,
          type: 'message',
          lang: 'en-US',
          feedback: {
              isRated: true,
              rating: null,
            },
          historyCognitionsCount: historyCognitionsCount,
        };

        let userMsg = {
          id: 'm_',
          threadID: 't_1',
          authorName: 'You',
          date: '',
          text: '',
          isRead: true,
          type: 'message',
          historyCognitionsCount: historyCognitionsCount,
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
            error: function(xhr, status, error) {
              if (status === 'timeout') {
                console.log('Please check your internet connection');
              }
            }
          });
        }
        else if (actions.indexOf('rss') >= 0) {
          let actionIndex = actions.indexOf('rss');
          let actionJson = susiMsg.response.answers[0].actions[actionIndex];
          let count = -1;
          if(actionJson.hasOwnProperty('count')){
            count = actionJson.count;
          }
          let data = susiMsg.response.answers[0].data;
          if(count === -1 || count > data.length){
            count = data.length;
          }
          var pushedDataIndices = [];
          var remainingDataIndices = [];
          data.forEach((rssData,index) => {
            if(rssData.hasOwnProperty('image') && pushedDataIndices.length < count){
              susiMsg.rssResults.push(rssData);
              pushedDataIndices.push(index);
            }
            else{
              remainingDataIndices.push(index);
            }
          });
          count -= pushedDataIndices.length;
          if(count === 0){
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
          }
          else{
            previewURLForImage(userMsg,susiMsg,BASE_URL,data,
                              count,remainingDataIndices,0,0);
          }
        }
        else{
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
        }
      });
    },
    error: function(xhr, status, error) {
         if (status === 'timeout') {
                console.log('Please check your internet connection');
        }
    }
  });
}

function previewURLForImage(userMsg,susiMsg,BASE_URL,data,
                            count,remainingDataIndices,j,resultsAdded){
  var dataIndex = remainingDataIndices[j];
  let respData = data[dataIndex];
  let previewURL = BASE_URL+'/susi/linkPreview.json?url='+respData.link;
  console.log(previewURL);
  $.ajax({
    url: previewURL,
    dataType: 'jsonp',
    crossDomain: true,
    timeout: 3000,
    async: false,
    success: function (rssResponse) {
      if(rssResponse.accepted){
        respData.image = rssResponse.image;
        respData.descriptionShort = rssResponse.descriptionShort;
        susiMsg.rssResults.push(respData);
        resultsAdded += 1;
      }
      if(resultsAdded === count || j === remainingDataIndices.length - 1){
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
      }
      else{
        j+=1;
        previewURLForImage(userMsg,susiMsg,BASE_URL,data,
                          count,remainingDataIndices,j,resultsAdded);
      }
    },
    error: function(xhr, status, error) {
      console.log(error);
      if(j === remainingDataIndices.length - 1){
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
      }
      else{
        j+=1;
        previewURLForImage(userMsg,susiMsg,BASE_URL,data,
                          count,remainingDataIndices,j,resultsAdded);
      }
    }
  });
}

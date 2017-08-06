import Cookies from 'universal-cookie';
import $ from 'jquery';
import ChatAppDispatcher from '../dispatcher/ChatAppDispatcher';
import ChatConstants from '../constants/ChatConstants';
import UserPreferencesStore from '../stores/UserPreferencesStore';

const cookies = new Cookies();

let ActionTypes = ChatConstants.ActionTypes;


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
          type: 'message',
          lang: 'en-US',
          feedback: {
              isRated: true,
              rating: null,
            }
        };

        let userMsg = {
          id: 'm_',
          threadID: 't_1',
          authorName: 'You',
          date: '',
          text: '',
          isRead: true,
          type: 'message'
        };

        let query = cognition.query;

        userMsg.id = 'm_' + Date.parse(cognition.query_date);
        userMsg.date = new Date(cognition.query_date);
        userMsg.text = query;

        // Translate history
        let defaultPrefLanguage = defaults.PrefLanguage;
        // Translate the User message text
        let urlForTranslate = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en-US&tl='+defaultPrefLanguage+'&dt=t&q='+userMsg.text;
        $.ajax({
          url: urlForTranslate,
          dataType: 'json',
          crossDomain: true,
          timeout: 3000,
          async: false,
          success: function (response) {
            if(response[0]){
              if(response[0][0]){
                userMsg.text = response[0][0][0];
              }
            }
          },
          error: function(errorThrown){
            console.log(errorThrown);
          }
        });

        susiMsg.id = 'm_' + Date.parse(cognition.answer_date);
        susiMsg.date = new Date(cognition.answer_date);
        susiMsg.text = cognition.answers[0].actions[0].expression;
        susiMsg.response = cognition;

        // Translate the SUSI message text
        urlForTranslate = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en-US&tl='+defaultPrefLanguage+'&dt=t&q='+susiMsg.text;
        $.ajax({
          url: urlForTranslate,
          dataType: 'json',
          crossDomain: true,
          timeout: 3000,
          async: false,
          success: function (response) {
            if(response[0]){
              if(response[0][0]){
                susiMsg.text = response[0][0][0];
              }
            }
          },
          error: function(errorThrown){
            console.log(errorThrown);
          }
        });
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
    error: function(xhr, status, error) {
         if (status === 'timeout') {
                console.log('Please check your internet connection');
        }
    }
  });
}

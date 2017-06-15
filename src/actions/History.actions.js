import Cookies from 'universal-cookie';
import $ from 'jquery';
import ChatAppDispatcher from '../dispatcher/ChatAppDispatcher';
import ChatConstants from '../constants/ChatConstants';

const cookies = new Cookies();

let ActionTypes = ChatConstants.ActionTypes;


export function getHistory() {
  let BASE_URL = '';
  if(cookies.get('serverUrl')==='http://api.susi.ai' || cookies.get('serverUrl')===null || cookies.get('serverUrl')=== undefined){
    BASE_URL = 'http://api.susi.ai';
  }
  else{
      BASE_URL= cookies.get('serverUrl');
    }
  let url = '';
  if(cookies.get('loggedIn')===null || cookies.get('loggedIn')===undefined){
    url = BASE_URL+'/susi/memory.json';
    console.log(url);
  }
    else{
      url = BASE_URL+'/susi/memory.json?access_token='+cookies.get('loggedIn');
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
          type: 'message'
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

import Cookies from 'universal-cookie';
import $ from 'jquery';
import ChatAppDispatcher from '../dispatcher/ChatAppDispatcher';
import * as ChatMessageUtils from '../utils/ChatMessageUtils';
import ChatConstants from '../constants/ChatConstants';
import UserPreferencesStore from '../stores/UserPreferencesStore';
import MessageStore from '../stores/MessageStore';
import * as Actions from './HardwareConnect.actions'
import * as SettingsActions from './Settings.actions';

const cookies = new Cookies();
let ActionTypes = ChatConstants.ActionTypes;
let _Location = null;

// Get Location
export function getLocation(){
  $.ajax({
    url: 'https://cors-anywhere.herokuapp.com/http://freegeoip.net/json/',
    timeout: 3000,
    async: true,
    success: function (response) {
      _Location = {
        lat: response.latitude,
        lng: response.longitude,
      };
    },
    error: function(xhr, status, error) {
      if (xhr.status === 404 || status === 'error') {
        _Location = null;
      }
    }
  });

}
export function createSUSIMessage(createdMessage, currentThreadID, voice) {
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
    type: 'message',
    voice: voice,
    lang: 'en-US',
    positiveFeedback: 0,
    negativeFeedback: 0
    };

  let defaults = UserPreferencesStore.getPreferences();
  let defaultServerURL = defaults.Server;
  let BASE_URL = '';
  if(cookies.get('serverUrl')===defaultServerURL||
    cookies.get('serverUrl')===null||
    cookies.get('serverUrl')=== undefined) {
    BASE_URL = defaultServerURL;
  }
  else{
    BASE_URL= cookies.get('serverUrl');
  }
  let url = '';
  // Fetching local browser language
  var locale = document.documentElement.getAttribute('lang');
  if(cookies.get('loggedIn')===null||
    cookies.get('loggedIn')===undefined) {
    // console.log(createdMessage.text);
    url = BASE_URL+'/susi/chat.json?q='+
          createdMessage.text+
          '&language='+locale;
  }
  else{
    // console.log(createdMessage.text);
    url = BASE_URL+'/susi/chat.json?q='
          +createdMessage.text+'&language='
          +locale+'&access_token='
          +cookies.get('loggedIn');
  }
  // Send location info of client if available
  if(_Location){
    url = url+'&latitude='+_Location.lat+'&longitude='+_Location.lng;
  }
  console.log(url);
  // Ajax Success calls the Dispatcher to CREATE_SUSI_MESSAGE
  $.ajax({
    url: url,
    dataType: 'jsonp',
    jsonpCallback: 'p',
    jsonp: 'callback',
    crossDomain: true,
    timeout: 3000,
    async: false,
    success: function (response) {
      console.log(response)
      // send susi response to connected Hardware Device
      Actions.sendToHardwareDevice(response);

      receivedMessage.text = response.answers[0].actions[0].expression;
      if(receivedMessage.lang===undefined){
        receivedMessage.lang = document.documentElement.getAttribute('lang');
      }
      else{
        // Setting Language received from User
        receivedMessage.lang = response.answers[0].actions[0].language;
      }
      receivedMessage.response = response;
      if(response.answers[0] !== undefined){
        let skills = response.answers[0].skills[0];
        let model = '';
        let group = '';
        let skill = '';
        let parsed = skills.split('/');
        if(parsed.length === 7){
          model = parsed[3];
          group = parsed[4];
          skill = parsed[6].slice(0,-4);
        }
        let getFeedbackEndPoint = BASE_URL+'/cms/getSkillRating.json?'+
                    'model='+model+
                    '&group='+group+
                    '&skill='+skill;
        $.ajax({
          url: getFeedbackEndPoint,
          dataType: 'jsonp',
          crossDomain: true,
          timeout: 3000,
          async: false,
          success: function (data) {
            console.log(getFeedbackEndPoint)
            console.log(data);
            if(data.accepted) {
              let positiveCount = data.skill_rating.positive;
              let negativeCount = data.skill_rating.negative;
              receivedMessage.positiveFeedback = positiveCount;
              receivedMessage.negativeFeedback = negativeCount;
            }

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
                success: function (webdata) {
                  if(count === -1){
                    count = webdata.RelatedTopics.length+1;
                  }
                  if(count > 0 && webdata.AbstractText){
                    let abstractTile = {
                      title: '',
                      description: '',
                      link: '',
                      icon: '',
                    }
                    abstractTile.title = webdata.Heading;
                    abstractTile.description = webdata.AbstractText;
                    abstractTile.link = webdata.AbstractURL;
                    abstractTile.icon = webdata.Image;
                    receivedMessage.websearchresults.push(abstractTile);
                    count--;
                  }
                  for(var tileKey=0;
                  tileKey<webdata.RelatedTopics.length && count > 0;
                  tileKey++) {
                    let tileData = webdata.RelatedTopics[tileKey];
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
                  console.log(receivedMessage);
                  let message = ChatMessageUtils.getSUSIMessageData(
                    receivedMessage, currentThreadID);
                  ChatAppDispatcher.dispatch({
                    type: ActionTypes.CREATE_SUSI_MESSAGE,
                    message
                  });
                },
                error: function(xhr, status, error) {
                    if (xhr.status === 404) {
                      receivedMessage.text = 'Some error occurred while sending your message!';
                    }
                    if (status === 'timeout') {
                      receivedMessage.text = 'Please check your internet connection';
                    }
                }
              });
            }

            let message = ChatMessageUtils.getSUSIMessageData(
              receivedMessage, currentThreadID);
            ChatAppDispatcher.dispatch({
              type: ActionTypes.CREATE_SUSI_MESSAGE,
              message
            });
          },
          error: function(xhr, status, error) {
            console.log(getFeedbackEndPoint)
              if (xhr.status === 404) {
                console.log('Some error occurred while getting feedback!');
              }
              if (status === 'timeout') {
                console.log('Please check your internet connection');
              }
          }
        });
      }
      else {
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
            success: function (webdata) {
              if(count === -1){
                count = webdata.RelatedTopics.length+1;
              }
              if(count > 0 && webdata.AbstractText){
                let abstractTile = {
                  title: '',
                  description: '',
                  link: '',
                  icon: '',
                }
                abstractTile.title = webdata.Heading;
                abstractTile.description = webdata.AbstractText;
                abstractTile.link = webdata.AbstractURL;
                abstractTile.icon = webdata.Image;
                receivedMessage.websearchresults.push(abstractTile);
                count--;
              }
              for(var tileKey=0;
              tileKey<webdata.RelatedTopics.length && count > 0;
              tileKey++) {
                let tileData = webdata.RelatedTopics[tileKey];
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
              console.log(receivedMessage);
              let message = ChatMessageUtils.getSUSIMessageData(
                receivedMessage, currentThreadID);
              ChatAppDispatcher.dispatch({
                type: ActionTypes.CREATE_SUSI_MESSAGE,
                message
              });
            },
            error: function(xhr, status, error) {
                if (xhr.status === 404) {
                  receivedMessage.text = 'Some error occurred while sending your message!';
                }
                if (status === 'timeout') {
                  receivedMessage.text = 'Please check your internet connection';
                }
            }
          });
        }
        let message = ChatMessageUtils.getSUSIMessageData(
          receivedMessage, currentThreadID);
        ChatAppDispatcher.dispatch({
          type: ActionTypes.CREATE_SUSI_MESSAGE,
          message
        });
      }
    },
    error: function (xhr, status, error) {
      if (status === 'timeout') {
        receivedMessage.text = 'Please check your internet connection';
      }
    }
  });
};


// Get Settings From Server or Cookies if not loggedIn
export function getSettings(){
  if(cookies.get('loggedIn')===null||
      cookies.get('loggedIn')===undefined){
    let settings = cookies.get('settings');
    if(settings!==undefined){
      // Check if the settings are set in the cookie
      SettingsActions.initialiseSettings(settings);
    }
  }
  else{
    let defaults = UserPreferencesStore.getPreferences();
    let defaultServerURL = defaults.StandardServer;
    let BASE_URL = '';
    if(cookies.get('serverUrl')===defaultServerURL||
      cookies.get('serverUrl')===null||
      cookies.get('serverUrl')=== undefined) {
      BASE_URL = defaultServerURL;
    }
    else{
      BASE_URL= cookies.get('serverUrl');
    }
    let url = '';
    if(cookies.get('loggedIn')===null||
      cookies.get('loggedIn')===undefined) {
      return;
    }

    url = BASE_URL+'/aaa/listUserSettings.json?'
            +'access_token='+cookies.get('loggedIn');

    $.ajax({
      url: url,
      dataType: 'jsonp',
      crossDomain: true,
      timeout: 3000,
      async: false,
      success: function (response) {
        if(response.hasOwnProperty('settings')){
          SettingsActions.initialiseSettings(response.settings);
        }
      },
      error: function(errorThrown){
        console.log(errorThrown);
      }
    });
  }
}

// Update Changed Settings on server
export function pushSettingsToServer(settings){
  let defaults = UserPreferencesStore.getPreferences();
  let defaultServerURL = defaults.StandardServer;
  let BASE_URL = '';
  if(cookies.get('serverUrl')===defaultServerURL||
    cookies.get('serverUrl')===null||
    cookies.get('serverUrl')=== undefined) {
    BASE_URL = defaultServerURL;
  }
  else{
    BASE_URL= cookies.get('serverUrl');
  }
  let url = '';

  if(cookies.get('loggedIn')===null||
    cookies.get('loggedIn')===undefined) {
    return;
  }

  Object.keys(settings).forEach((key) => {
    console.log(key, settings[key]);
    switch(key){
      case 'Theme':{
        url = BASE_URL+'/aaa/changeUserSettings.json?'
          +'key=theme&value='+settings.Theme
          +'&access_token='+cookies.get('loggedIn');
        console.log(url);
        makeServerCall(url);
        break;
      }
      case 'EnterAsSend':{
        url = BASE_URL+'/aaa/changeUserSettings.json?'
          +'key=enter_send&value='+settings.EnterAsSend
          +'&access_token='+cookies.get('loggedIn');
        console.log(url);
        makeServerCall(url);
        break;
      }
      case 'MicInput':{
        url = BASE_URL+'/aaa/changeUserSettings.json?'
          +'key=mic_input&value='+settings.MicInput
          +'&access_token='+cookies.get('loggedIn');
        console.log(url);
        makeServerCall(url);
        break;
      }
      case 'SpeechOutput':{
        url = BASE_URL+'/aaa/changeUserSettings.json?'
          +'key=speech_output&value='+settings.SpeechOutput
          +'&access_token='+cookies.get('loggedIn');
        console.log(url);
        makeServerCall(url);
        break;
      }
      case 'SpeechOutputAlways':{
        url = BASE_URL+'/aaa/changeUserSettings.json?'
          +'key=speech_always&value='+settings.SpeechOutputAlways
          +'&access_token='+cookies.get('loggedIn');
        console.log(url);
        makeServerCall(url);
        break;
      }
      default: {
        // do nothing
      }
    }
  });
}

export function sendFeedback(){
  let feedback = MessageStore.getFeedback();
  if(feedback===null){
    return;
  }
  console.log(feedback);
  if(Object.keys(feedback).length === 0 && feedback.constructor === Object){
    return;
  }
  let defaults = UserPreferencesStore.getPreferences();
  let defaultServerURL = defaults.Server;
  let BASE_URL = '';
  if(cookies.get('serverUrl')===defaultServerURL||
    cookies.get('serverUrl')===null||
    cookies.get('serverUrl')=== undefined) {
    BASE_URL = defaultServerURL;
  }
  else{
    BASE_URL= cookies.get('serverUrl');
  }
  let url = BASE_URL+'/cms/rateSkill.json?'+
            'model='+feedback.model+
            '&group='+feedback.group+
            '&language='+feedback.language+
            '&skill='+feedback.skill+
            '&rating='+feedback.rating;
  console.log(url);
  makeServerCall(url);
}

export function makeServerCall(url){
  $.ajax({
    url: url,
    dataType: 'jsonp',
    crossDomain: true,
    timeout: 3000,
    async: false,
    success: function (response) {
      console.log(response);
    },
    error: function(errorThrown){
      console.log(errorThrown);
    }
  });
}

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
let offlineMessage = null;

window.addEventListener('offline', handleOffline.bind(this));
window.addEventListener('online', handleOnline.bind(this));
function handleOffline() {
  offlineMessage = 'Sorry, cannot answer that now. I have no net connectivity';
}
function handleOnline() {
  offlineMessage = null;
}
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
    feedback: {
        isRated: false,
        rating: null,
      }
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
    url = BASE_URL+'/susi/chat.json?q='+
          createdMessage.text+
          '&language='+locale;
  }
  else{
    url = BASE_URL+'/susi/chat.json?q='
          +createdMessage.text+'&language='
          +locale+'&access_token='
          +cookies.get('loggedIn');
  }
  // Send location info of client if available
  if(_Location){
    url += '&latitude='+_Location.lat+'&longitude='+_Location.lng;
  }
  console.log(url);
  // Ajax Success calls the Dispatcher to CREATE_SUSI_MESSAGE only when the User is online
  if(!offlineMessage){
  $.ajax({
    url: url,
    dataType: 'jsonp',
    jsonpCallback: 'p',
    jsonp: 'callback',
    crossDomain: true,
    timeout: 3000,
    async: false,
    success: function (response) {
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
      else {
        let message = ChatMessageUtils.getSUSIMessageData(
          receivedMessage, currentThreadID);
        ChatAppDispatcher.dispatch({
          type: ActionTypes.CREATE_SUSI_MESSAGE,
          message
        });
      }
    },
    error: function (xhr, status, error) {
      console.log(receivedMessage.text);
      if (status === 'timeout') {
        receivedMessage.text = 'Please check your internet connection';
      }
    }
  });
  }
  else{
    receivedMessage.text = offlineMessage;
    let message = ChatMessageUtils.getSUSIMessageData(
              receivedMessage, currentThreadID);
            ChatAppDispatcher.dispatch({
              type: ActionTypes.CREATE_SUSI_MESSAGE,
              message
          });
  }
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
        if(response.hasOwnProperty('settings') && response.accepted){
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
      case 'SpeechRate':{
        url = BASE_URL+'/aaa/changeUserSettings.json?'
          +'key=speech_rate&value='+settings.SpeechRate
          +'&access_token='+cookies.get('loggedIn');
        console.log(url);
        makeServerCall(url);
        break;
      }
      case 'SpeechPitch':{
        url = BASE_URL+'/aaa/changeUserSettings.json?'
          +'key=speech_pitch&value='+settings.SpeechPitch
          +'&access_token='+cookies.get('loggedIn');
        console.log(url);
        makeServerCall(url);
        break;
      }
      case 'TTSLanguage':{
        url = BASE_URL+'/aaa/changeUserSettings.json?'
          +'key=speech_lang&value='+settings.TTSLanguage
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

// Get the translated example Text in all languages supported by browser
export function getTTSLangText(voiceList){
  let defText = 'This is an example of speech synthesis';
  voiceList.forEach((voice,index) => {
    let url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en-US&tl='+voice.lang+'&dt=t&q='+defText;
    $.ajax({
      url: url,
      dataType: 'json',
      crossDomain: true,
      timeout: 3000,
      async: false,
      success: function (response) {
        if(response[0]){
          if(response[0][0]){
            let translatedText = response[0][0][0];
            voice.translatedText = translatedText;
          }
        }
      },
      error: function(errorThrown){
        console.log(errorThrown);
      }
    });
  });
}

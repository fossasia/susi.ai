import Cookies from 'universal-cookie';
import $ from 'jquery';
import ChatAppDispatcher from '../dispatcher/ChatAppDispatcher';
import * as ChatMessageUtils from '../utils/ChatMessageUtils';
import ChatConstants from '../constants/ChatConstants';
import UserPreferencesStore from '../stores/UserPreferencesStore';
import MessageStore from '../stores/MessageStore';
import * as Actions from './HardwareConnect.actions';
import * as SettingsActions from './Settings.actions';

const cookies = new Cookies();
let ActionTypes = ChatConstants.ActionTypes;
let _Location = null;
let offlineMessage = null;
let defaultMessage = 'Sorry, I could not understand what you just said.';

// Handle offline, online events
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
// Main server call for Creating a SUSI Message
export function createSUSIMessage(createdMessage, currentThreadID, voice) {
  var timestamp = Date.now();
  let receivedMessage = {
    id: 'm_' + timestamp,
    threadID: currentThreadID,
    authorName: 'SUSI',
    text: '',
    response: {},
    actions: [],
    websearchresults: [],
    rssResults: [],
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
          encodeURIComponent(createdMessage.text)+
          '&language='+locale;
  }
  else{
    url = BASE_URL+'/susi/chat.json?q='
          +encodeURIComponent(createdMessage.text)+'&language='
          +locale+'&access_token='
          +cookies.get('loggedIn');
  }
  // Send location info of client if available
  if(_Location){
    url += '&latitude='+_Location.lat+'&longitude='+_Location.lng;
  }
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
      // Trying for empty response i.e no answer returned
      try{
      receivedMessage.text = response.answers[0].actions[0].expression;
      	}
      catch (err) {
      	if (err instanceof TypeError) {
      		let emptyData = [];
      		emptyData[0] = [];
      		emptyData[1] = {};
      		response.answers = [];
      		response.answers[0] = {
      			actions: [],
      			data:emptyData,
      		};
      		response.answers[0].actions[0] = {
      			expression:defaultMessage,
      			language:'en',
      			type:'answer',
      		   		   	};
        	receivedMessage.text = response.answers[0].actions[0].expression;
    	}
      }
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
        // Get RSS responses
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
              abstractTile.image = data.Image;
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
                websearchTile.image = tileData.Icon.URL;
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
      else if (actions.indexOf('rss') >= 0) {
        let actionIndex = actions.indexOf('rss');
        let actionJson = receivedMessage.response.answers[0].actions[actionIndex];
        let count = -1;
        if(actionJson.hasOwnProperty('count')){
          count = actionJson.count;
        }
        let data = receivedMessage.response.answers[0].data;
        if(count === -1 || count > data.length){
          count = data.length;
        }
        var pushedDataIndices = [];
        var remainingDataIndices = [];
        data.forEach((rssData,index) => {
          if(rssData.hasOwnProperty('image') && pushedDataIndices.length < count){
            receivedMessage.rssResults.push(rssData);
            pushedDataIndices.push(index);
          }
          else{
            remainingDataIndices.push(index);
          }
        });
        count -= pushedDataIndices.length;
        if(count === 0){
          let message = ChatMessageUtils.getSUSIMessageData(
            receivedMessage, currentThreadID);
          ChatAppDispatcher.dispatch({
            type: ActionTypes.CREATE_SUSI_MESSAGE,
            message
          });

        }
        else{
          previewURLForImage(receivedMessage,currentThreadID,
                              BASE_URL,data,count,remainingDataIndices,0,0);
        }
      }
      else  {
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
// Get images for RSS links
function previewURLForImage(receivedMessage,currentThreadID,
                            BASE_URL,data,count,remainingDataIndices,j,resultsAdded){
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
        receivedMessage.rssResults.push(respData);
        resultsAdded += 1;
      }
      if(resultsAdded === count ||
          j === remainingDataIndices.length - 1){
        let message = ChatMessageUtils.getSUSIMessageData(
          receivedMessage, currentThreadID);
        ChatAppDispatcher.dispatch({
          type: ActionTypes.CREATE_SUSI_MESSAGE,
          message
        });
      }
      else{
        j+=1;
        previewURLForImage(receivedMessage,currentThreadID,
                            BASE_URL,data,count,remainingDataIndices,j,resultsAdded);
      }
    },
    error: function(xhr, status, error) {
      console.log(error);
      if(j === remainingDataIndices.length - 1){
        let message = ChatMessageUtils.getSUSIMessageData(
          receivedMessage, currentThreadID);
        ChatAppDispatcher.dispatch({
          type: ActionTypes.CREATE_SUSI_MESSAGE,
          message
        });
      }
      else{
        j+=1;
        previewURLForImage(receivedMessage,currentThreadID,
                            BASE_URL,data,count,remainingDataIndices,j,resultsAdded);
      }
    }
  });
}

// Get Settings From Server or Cookies if not loggedIn
export function getSettings(){
  if(cookies.get('loggedIn')===null||
      cookies.get('loggedIn')===undefined){
    let settings = cookies.get('settings');
    if(settings!==undefined){
      // Check if the settings are set in the cookie
      SettingsActions.initialiseSettings(settings);
    }else{
     // get defaults and set it in cookies
      settings = UserPreferencesStore.getPreferences();
      settings.theme = settings.Theme
      settings.enterAsSend = settings.EnterAsSend
      settings.micInput = settings.MicInput
      settings.speechOutput = settings.SpeechOutput
      settings.speechOutputAlways = settings.SpeechOutputAlways
      settings.speechRate = settings.SpeechRate
      settings.speechPitch = settings.SpeechPitch
      settings.ttsLanguage = settings.TTSLanguage
      settings.prefLanguage = settings.PrefLanguage
      settings.customThemeValue = settings.ThemeValues
      settings.LocalStorage = true;
      settings.checked=false;
      settings.CountryCode= 'US';
      settings.CountryDialCode='+1';
      settings.phoneNo= '';
      settings.serverUrl='https://api.susi.ai';
      cookies.set('settings',settings);
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
          if(response.hasOwnProperty('session') && response.accepted){
            SettingsActions.initialiseIdentity(response.session.identity);
          }
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

  if(cookies.get('loggedIn')===null||
    cookies.get('loggedIn')===undefined) {
    return;
  }

  let url = BASE_URL+'/aaa/changeUserSettings.json?'
    +'&access_token='+cookies.get('loggedIn');

  Object.keys(settings).forEach((key,index) => {
    url += '&key'+(index+1).toString()+'='+key
          +'&value'+(index+1).toString()+'='+(settings[key]).toString();
  });
  url += '&count='+(Object.keys(settings).length).toString();
  // push settings to server
  makeServerCall(url);
}

// Update Changed Settings on server
export function pushCustomThemeToServer(customTheme){
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
       url = BASE_URL+'/aaa/changeUserSettings.json?'
          +'key1=customThemeValue&value1='+customTheme
          +'&access_token='+cookies.get('loggedIn')
          +'&count=1'
        console.log(url);
        makeServerCall(url);

}
// Server calls for Feedback Storage
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
// Helper function for making server call
export function makeServerCall(url){
  console.log(url)
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
      async: true,

      success: function (response) {
        if(response[0]){
          if(response[0][0]){
            let translatedText = response[0][0][0];
            voice.translatedText = translatedText;
            // console.log(url);
          }
        }
      },

      error: function(errorThrown){
        console.log(errorThrown);
      }

    });
  });
}

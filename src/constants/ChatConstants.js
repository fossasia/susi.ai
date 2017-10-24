import keyMirror from 'keymirror';

export default {

  ActionTypes: keyMirror({
    CLICK_THREAD: null,
    CREATE_MESSAGE: null,
    RECEIVE_RAW_CREATED_MESSAGE: null,
    CREATE_SUSI_MESSAGE: null,
    RECEIVE_SUSI_MESSAGE: null,
    RECEIVE_RAW_MESSAGES: null,
    STORE_HISTORY_MESSAGE: null,
    SERVER_CHANGED: null,
    INIT_SETTINGS: null,
    INIT_IDENTITY: null,
    INIT_TTS_VOICES: null,
    SETTINGS_CHANGED: null,
    RESET_MESSAGE_VOICE: null,
    FEEDBACK_RECEIVED: null,
    CHANGE_CUSTOM_THEME:null,
    INIT_THEME_CUSTOM_THEME:null,
  })

};

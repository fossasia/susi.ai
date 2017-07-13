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
    THEME_CHANGED:null,
    SERVER_CHANGED: null,
    ENTER_AS_SEND_CHANGED: null,
    MIC_INPUT_CHANGED: null,
    SPEECH_OUTPUT_CHANGED: null,
    SPEECH_OUTPUT_ALWAYS_CHANGED: null,
    INIT_SETTINGS: null,
    RESET_MESSAGE_VOICE: null,
    FEEDBACK_RECEIVED: null,
  })

};

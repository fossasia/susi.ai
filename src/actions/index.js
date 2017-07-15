// imports
import {  getLocation,
          getSettings,
          setThemeSettings,
          setMicInputSettings,
          setEnterAsSendSettings,
          setSpeechOutputSettings,
          setSpeechOutputAlwaysSettings,
          sendFeedback,
          createSUSIMessage } from './API.actions';

import {  getHistory } from './History.actions';

import {  createMessage,
          receiveCreatedMessage,
          clickThread,
          resetVoice,
          saveFeedback,
          receiveAll } from './ChatApp.actions';

import {  serverChanged,
          ToggleSearch,
          initialiseSettings,
          enterAsSendChanged,
          micInputChanged,
          speechOutputChanged,
          speechOutputAlwaysChanged,
          speechRateChanged,
          speechPitchChanged,
          themeChanged  } from './Settings.actions';

import {  connectToWebSocket,
          sendToHardwareDevice } from './HardwareConnect.actions';


// exports
export {  getLocation,
          getSettings,
          setThemeSettings,
          setMicInputSettings,
          setEnterAsSendSettings,
          setSpeechOutputSettings,
          setSpeechOutputAlwaysSettings,
          createSUSIMessage }

export { getHistory }

export {  createMessage,
          receiveCreatedMessage,
          clickThread,
          resetVoice,
          saveFeedback,
          receiveAll }

export { serverChanged,
         ToggleSearch,
         initialiseSettings,
         enterAsSendChanged,
         micInputChanged,
         speechOutputChanged,
         speechOutputAlwaysChanged,
         speechRateChanged,
         speechPitchChanged,
         sendFeedback,
         themeChanged }

export { connectToWebSocket, sendToHardwareDevice }

// imports
import {  getLocation,
          getSettings,
          setThemeSettings,
          setMicInputSettings,
          setEnterAsSendSettings,
          setSpeechOutputSettings,
          setSpeechOutputAlwaysSettings,
          createSUSIMessage } from './API.actions';

import {  getHistory } from './History.actions';

import {  createMessage,
          receiveCreatedMessage,
          clickThread,
          resetVoice,
          receiveAll } from './ChatApp.actions';

import {  serverChanged,
          ToggleSearch,
          initialiseSettings,
          enterAsSendChanged,
          micInputChanged,
          speechOutputChanged,
          speechOutputAlwaysChanged,
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
          receiveAll }

export { serverChanged,
         ToggleSearch,
         initialiseSettings,
         enterAsSendChanged,
         micInputChanged,
         speechOutputChanged,
         speechOutputAlwaysChanged,
         themeChanged }

export { connectToWebSocket, sendToHardwareDevice }

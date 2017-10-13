// imports
import {  getLocation,
          getSettings,
          pushSettingsToServer,
          sendFeedback,
          getTTSLangText,
          createSUSIMessage } from './API.actions';

import {  getHistory } from './History.actions';

import {  createMessage,
          receiveCreatedMessage,
          clickThread,
          resetVoice,
          saveFeedback,
          receiveAll } from './ChatApp.actions';

import {  serverChanged,
          initialiseSettings,
          initialiseIdentity,
          initialiseTTSVoices,
          settingsChanged,
          customThemeChanged,
          } from './Settings.actions';

import {  connectToWebSocket,
          sendToHardwareDevice } from './HardwareConnect.actions';

// exports
export {  getLocation,
          getSettings,
          pushSettingsToServer,
          sendFeedback,
          getTTSLangText,
          createSUSIMessage }

export { getHistory }

export {  createMessage,
          receiveCreatedMessage,
          clickThread,
          resetVoice,
          saveFeedback,
          receiveAll }

export { serverChanged,
         initialiseSettings,
         initialiseIdentity,
         initialiseTTSVoices,
         settingsChanged,
         customThemeChanged,
        }

export { connectToWebSocket, sendToHardwareDevice }

// imports
import {  getLocation,
          getSettings,
          pushSettingsToServer,
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
          settingsChanged} from './Settings.actions';

import {  connectToWebSocket,
          sendToHardwareDevice } from './HardwareConnect.actions';


// exports
export {  getLocation,
          getSettings,
          pushSettingsToServer,
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
         sendFeedback,
         settingsChanged}

export { connectToWebSocket, sendToHardwareDevice }

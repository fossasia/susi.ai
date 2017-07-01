// imports
import {  getLocation,
          getSettings,
          setThemeSettings,
          setEnterAsSendSettings,
          createSUSIMessage } from './API.actions';

import {  getHistory } from './History.actions';

import {  createMessage,
          receiveCreatedMessage,
          clickThread,
          receiveAll } from './ChatApp.actions';

import {  serverChanged,
          ToggleSearch,
          initialiseSettings,
          enterAsSendChanged,
          themeChanged  } from './Settings.actions';

import {  connectToWebSocket,
          sendToHardwareDevice } from './HardwareConnect.actions';


// exports
export {  getLocation,
          getSettings,
          setThemeSettings,
          setEnterAsSendSettings,
          createSUSIMessage }

export { getHistory }

export {  createMessage,
          receiveCreatedMessage,
          clickThread,
          receiveAll }

export { serverChanged,
         ToggleSearch,
         initialiseSettings,
         enterAsSendChanged,
         themeChanged }

export { connectToWebSocket, sendToHardwareDevice }

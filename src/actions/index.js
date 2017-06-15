// imports
<<<<<<< ad40ffcf71a4ecfa576a16f7e4d7938d5b5069ec
import {  getLocation, createSUSIMessage } from './API.actions';
import {  getHistory } from './History.actions';
import {  createMessage,
          receiveCreatedMessage,
          clickThread,
          receiveAll } from './ChatApp.actions';
import {  getDefaults,
          setDefaults,
          setDefaultTheme,
          setDefaultServer,
          ToggleSearch,
=======
import { getLocation, createSUSIMessage } from './API.actions';
import { getHistory } from './History.actions';
import { createMessage,
  receiveCreatedMessage,
  clickThread,
  receiveAll } from './ChatApp.actions';
import { getDefaults,
         setDefaults,
         setDefault// imports
import { getLocation, createSUSIMessage } from './API.actions';
import { getHistory } from './History.actions';
import { createMessage,
  receiveCreatedMessage,
  clickThread,
  receiveAll } from './ChatApp.actions';
import { getDefaults,
         setDefaults,
         setDefaultTheme,
         ToggleSearch,
         themeChanged} from './Settings.actions';

// exports
export { getLocation, createSUSIMessage }
export { getHistory }

export {  createMessage,
          receiveCreatedMessage,
          clickThread,
          receiveAll }

export { getDefaults,
  setDefaults,
  setDefaultTheme,
  ToggleSearch,
  themeChanged }
Theme,
       ToggleSearch,
>>>>>>> Fixes #268: susi message search now works
          themeChanged} from './Settings.actions';

// exports
export { getLocation, createSUSIMessage }
export { getHistory }

export {  createMessage,
          receiveCreatedMessage,
          clickThread,
          receiveAll }

export { getDefaults,
<<<<<<< ad40ffcf71a4ecfa576a16f7e4d7938d5b5069ec
         setDefaults,
         setDefaultTheme,
         setDefaultServer,
         ToggleSearch,
         themeChanged }
=======
  setDefaults,
  setDefaultTheme,
  ToggleSearch,
  themeChanged }
>>>>>>> Fixes #268: susi message search now works

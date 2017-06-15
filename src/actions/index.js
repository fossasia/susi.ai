// imports
import { getLocation, createSUSIMessage } from './API.actions';
import { getHistory } from './History.actions';
import { createMessage,
  receiveCreatedMessage,
  clickThread,
  receiveAll } from './ChatApp.actions';
import { getDefaults,
         setDefaults,
         setDefaultTheme,
       ToggledSearch,
          themeChanged} from './Settings.actions';

// exports
export { getLocation, createSUSIMessage }
export { getHistory }

export { createMessage,
  receiveCreatedMessage,
  clickThread,
  receiveAll }

export { getDefaults,
  setDefaults,
  setDefaultTheme,
  ToggledSearch,
  themeChanged }

import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import app from './app';
import settings from './settings';
import messages from './messages';
import ui from './ui';

export default combineReducers({
  routing: routerReducer,
  app,
  settings,
  messages,
  ui,
});

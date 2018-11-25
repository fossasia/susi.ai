import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import app from './app';
import settings from './settings';

export default combineReducers({
  routing: routerReducer,
  app,
  settings,
});

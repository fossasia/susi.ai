import { combineReducers } from 'redux';
import app from './app';
import settings from './settings';
import messages from './messages';
import ui from './ui';
import skills from './skills';
import skill from './skill';
import create from './create';
import { connectRouter } from 'connected-react-router';

export default history =>
  combineReducers({
    router: connectRouter(history),
    app,
    settings,
    messages,
    ui,
    skills,
    skill,
    create,
  });

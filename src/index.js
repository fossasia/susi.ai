import ChatApp from './components/ChatApp.react';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import * as ChatWebAPIUtils from './utils/ChatWebAPIUtils';

ChatWebAPIUtils.getAllMessages();

ReactDOM.render(
  <ChatApp /> ,
  document.getElementById('root')
);

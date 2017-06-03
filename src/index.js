import ChatApp from './components/ChatApp.react';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as ChatWebAPIUtils from './utils/ChatWebAPIUtils';

ChatWebAPIUtils.getHistory();
ChatWebAPIUtils.getAllMessages();

const App = () => (
  <MuiThemeProvider>
    <ChatApp />
  </MuiThemeProvider>
);

ReactDOM.render(
  <App /> ,
  document.getElementById('root')
);

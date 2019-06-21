import MessageSection from './MessageSection/MessageSection.react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ChatApp.css';

class ChatApp extends Component {
  static propTypes = {
    actions: PropTypes.object,
    app: PropTypes.object,
  };

  componentDidMount() {
    document.title = 'SUSI.AI Chat - Open Source Artificial Intelligence';
  }

  render() {
    return (
      <div className="chatapp">
        <MessageSection />
      </div>
    );
  }
}

export default ChatApp;

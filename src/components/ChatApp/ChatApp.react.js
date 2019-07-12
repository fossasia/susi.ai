import MessageSection from './MessageSection/MessageSection.react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

class ChatApp extends Component {
  static propTypes = {
    actions: PropTypes.object,
    app: PropTypes.object,
    history: PropTypes.object,
    showChatBubble: PropTypes.bool,
    fullScreenChat: PropTypes.bool,
  };

  componentDidMount() {
    document.title = 'SUSI.AI Chat - Open Source Artificial Intelligence';
  }

  render() {
    const { showChatBubble, history, fullScreenChat } = this.props;
    return (
      <MessageSection
        history={history}
        showChatBubble={showChatBubble}
        fullScreenChat={fullScreenChat}
      />
    );
  }
}

export default withRouter(ChatApp);

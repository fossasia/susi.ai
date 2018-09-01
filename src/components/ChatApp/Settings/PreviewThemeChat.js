import React, { Component } from 'react';
import * as $ from 'jquery';
import './PreviewThemeChat.css';
import susiWhite from '../../../images/susi-logo-white.png';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Send from 'material-ui/svg-icons/content/send';
import PropTypes from 'prop-types';

class PreviewThemeChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [{ message: 'Hi I am Susi', author: 'Susi' }],
      message: '',
    };
  }

  sendMessage = event => {
    event.preventDefault();
    this.addMessage(this.state.message, 'You');
    let self = this;
    $.ajax({
      type: 'GET',
      url:
        'https://api.susi.ai/susi/chat.json?q=' +
        encodeURIComponent(this.state.message),
      contentType: 'application/json',
      dataType: 'json',
      success: function(data) {
        if (data.answers[0]) {
          self.addMessage(data.answers[0].actions[0].expression, 'SUSI');
        } else {
          self.addMessage(
            'Sorry, I could not understand what you just said.',
            'SUSI',
          );
        }
      },
      error: function(e) {
        console.log(e);
      },
    });
    this.setState({ message: '' });
  };

  addMessage = (message, author) => {
    var messageObj = { message, author };
    this.setState({ messages: [...this.state.messages, messageObj] });
  };

  render() {
    const colors = {
      headerColor: this.props.header,
      paneColor: this.props.pane,
      bodyColor: this.props.body,
      composerColor: this.props.composer,
      textareColor: this.props.textarea,
      buttonColor: this.props.button,
    };
    const backgroundImages = {
      messageBackgroundImage: this.props.messageBackgroundImage,
      bodyBackgroundImage: this.props.bodyBackgroundImage,
    };
    let messages = null;
    if (this.state.messages.length) {
      messages = this.state.messages.map((message, index) => {
        if (message.author === 'You') {
          return (
            <div key={index} className="susi-comment-you susi-comment-box">
              {message.message}
            </div>
          );
        }
        return (
          <div key={index} className="susi-comment-susi susi-comment-box">
            {message.message}
          </div>
        );
      });
    } else {
      return null;
    }
    return (
      <div style={{ paddingRight: '20px' }}>
        <h2>Preview</h2>
        <div
          className="susi-chat-container"
          style={{
            backgroundColor: colors.bodyColor,
            backgroundImage: `url(${backgroundImages.bodyBackgroundImage})`,
          }}
        >
          <div
            className="susi-chat-navbar"
            style={{ backgroundColor: colors.headerColor }}
          >
            <img src={susiWhite} alt="susi-logo" className="susi-logo" />
            <MoreVertIcon
              className="morevertIcon"
              style={{ height: '30px', width: '15px' }}
            />
          </div>
          <div
            className="chat-window"
            style={{
              backgroundColor: colors.paneColor,
              backgroundImage: `url(${
                backgroundImages.messageBackgroundImage
              })`,
            }}
          >
            <div className="chat-message-container">
              <div className="chat-messages">{messages}</div>
            </div>
            <div
              className="chat-footer-container"
              style={{ backgroundColor: colors.composerColor }}
            >
              <div className="chat-footer">
                <textarea
                  type="text"
                  style={{ backgroundColor: colors.textareColor }}
                  placeholder="Enter your response"
                  className="chat-input"
                  value={this.state.message}
                  onChange={ev => this.setState({ message: ev.target.value })}
                />
              </div>
              <Send onClick={this.sendMessage} className="chat-input-send" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PreviewThemeChat.propTypes = {
  header: PropTypes.string,
  pane: PropTypes.string,
  body: PropTypes.string,
  composer: PropTypes.string,
  textarea: PropTypes.string,
  button: PropTypes.string,
  messageBackgroundImage: PropTypes.string,
  bodyBackgroundImage: PropTypes.string,
};

export default PreviewThemeChat;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getSusiPreviewReply } from '../../../apis/index';
import susiWhite from '../../../images/susi-logo-white.png';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import loadingGIF from '../../../images/loading.gif';
import Send from '@material-ui/icons/Send';
import './PreviewThemeChat.css';

class PreviewThemeChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [{ message: 'Hi, I am SUSI', author: 'SUSI', loading: false }],
      message: '',
    };
  }

  sendMessage = event => {
    const { message } = this.state;
    if (message.trim().length > 0) {
      this.addMessage(message, 'You');
      const encodedMessage = encodeURIComponent(message);
      getSusiPreviewReply(encodedMessage)
        .then(payload => {
          const { messages } = this.state;
          let index;
          for (let i = 0; i < messages.length; i++) {
            if (messages[i].loading === true) {
              index = i;
              break;
            }
          }

          let messageObj;
          if (payload.answers[0]) {
            messageObj = {
              message: payload.answers[0].actions[0].expression,
              author: 'SUSI',
              loading: false,
            };
          } else {
            messageObj = {
              message: 'Sorry, I could not understand what you just said.',
              author: 'SUSI',
              loading: false,
            };
          }
          this.setState(prevState => ({
            messages: [
              ...prevState.messages.slice(0, index),
              messageObj,
              ...prevState.messages.slice(index + 1),
            ],
          }));
        })
        .catch(error => {
          console.log('Could not fetch reply');
        });
      this.setState({ message: '' });
    }
  };

  addMessage = (message, author, loading = false) => {
    const messageObj = { message, author, loading };
    const loadingObj = {
      message: (
        <img
          src={loadingGIF}
          style={{ height: '10px', width: 'auto' }}
          alt="please wait.."
        />
      ),
      author: 'SUSI',
      loading: true,
    };
    this.setState({
      messages: [...this.state.messages, messageObj, loadingObj],
    });
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
            <img
              src={susiWhite}
              alt="susi-logo"
              className="susi-preview-logo"
            />
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
                  onKeyDown={event => {
                    if (event.keyCode === 13) {
                      this.sendMessage();
                    }
                  }}
                  onKeyPress={event => {
                    if (event.which === 13) {
                      event.preventDefault();
                    }
                  }}
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

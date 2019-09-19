import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { getSusiPreviewReply } from '../../apis';
import susiWhite from '../../images/susi-logo-white.png';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import loadingGIF from '../../images/loading.gif';
import _Send from '@material-ui/icons/Send';

const ChatMessagesContainer = styled.div`
  font-size: 15px;
  padding-bottom: 3.75rem;
  box-shadow: 2px 0 3px -3px #000000, -2px 0 3px -3px #000000;
  height: 17.5rem;
  overflow-y: overlay;
  overflow-x: hidden;
`;

const ChatMessages = styled.div`
  display: flex;
  flex-direction: column;
`;

const SusiLogo = styled.img.attrs({
  alt: 'Susi logo',
})`
  height: 0.75rem;
  vertical-align: middle;
  max-width: 5.25rem;
  width: auto;
  padding: 0.5rem;
`;

const Message = styled.div`
  box-shadow: 0 1px 0.5px rgba(0, 0, 0, 0.13);
  border-radius: 0.5rem;
  margin: 0.625rem;
  min-width: 3rem;
  max-width: 9.3rem;
  padding: 0.75rem 1rem;
  text-align: left;
  ${props =>
    props.author === 'SUSI'
      ? css`
          background-color: #ffffff;
          align-self: flex-start;
        `
      : css`
          background-color: #e0e0e0;
          align-self: flex-end;
          text-align: left;
        `}
`;

const ChatContainer = styled.div`
  border: 1px solid #000000;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: ${props => props.backgroundColor}
    ${props =>
      props.backgroundImageUrl &&
      css`
        background-image: url(props.backgroundImageUrl);
      `};
`;

const ChatComposerContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  justify-content: space-evenly;
  box-shadow: 0 -1px 4px 0 rgba(0, 0, 0, 0.12);
  background-color: ${props => props.backgroundColor};
`;

const TextArea = styled.textarea.attrs({
  type: 'text',
  placeholder: 'Enter your response',
})`
  padding: 0 5px;
  border: none;
  font-size: 0.875rem;
  border-radius: 6px;
  background-color: ${props => props.backgroundColor};
`;

const NavBar = styled.div`
  display: flex;
  height: 1.875rem;
  justify-content: space-between;
  background-color: ${props => props.backgroundColor};
`;

const ChatWindow = styled.div`
  margin: 0 1.25rem 0 1.25rem;
  min-width: 16rem;
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : 'black'};
  ${props =>
    props.backgroundImageUrl &&
    css`
      background-image: url(props.backgroundImageUrl);
    `};
  @media (max-width: 800px) {
    min-width: 12.5rem;
  }
`;

const Send = styled(_Send)`
  cursor: pointer;
  margin-left: 5px;
`;

class PreviewThemeChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [
        { messageText: 'Hi, I am SUSI', author: 'SUSI', loading: false },
      ],
      messageText: '',
    };
  }

  sendMessage = event => {
    const { messageText } = this.state;
    if (messageText.trim().length > 0) {
      this.addMessage(messageText, 'You');
      const encodedMessage = encodeURIComponent(messageText);
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
              messageText: payload.answers[0].actions[0].expression,
              author: 'SUSI',
              loading: false,
            };
          } else {
            messageObj = {
              messageText: 'Sorry, I could not understand what you just said.',
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
      this.setState({ messageText: '' });
    }
  };

  addMessage = (messageText, author, loading = false) => {
    const messageObj = { messageText, author, loading };
    const loadingObj = {
      messageText: (
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
    const { messages, messageText } = this.state;
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
    let renderMessages = null;
    if (messages.length) {
      renderMessages = messages.map((messageObj, index) => {
        if (messageObj.author === 'You') {
          return (
            <Message author={'You'} key={index}>
              {messageObj.messageText}
            </Message>
          );
        }
        return (
          <Message author={'SUSI'} key={index}>
            {messageObj.messageText}
          </Message>
        );
      });
    } else {
      return null;
    }
    return (
      <div>
        <h2>Preview</h2>
        <ChatContainer
          backgroundColor={colors.bodyColor}
          backgroundImageUrl={backgroundImages.bodyBackgroundImage}
        >
          <NavBar backgroundColor={colors.headerColor}>
            <SusiLogo src={susiWhite} />
            <MoreVertIcon style={{ height: '30px', width: '15px' }} />
          </NavBar>
          <ChatWindow
            backgroundColor={colors.paneColor}
            backgroundImageUrl={backgroundImages.messageBackgroundImage}
          >
            <ChatMessagesContainer>
              <ChatMessages>{renderMessages}</ChatMessages>
            </ChatMessagesContainer>
            <ChatComposerContainer backgroundColor={colors.composerColor}>
              <TextArea
                value={messageText}
                onChange={ev => this.setState({ messageText: ev.target.value })}
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
                backgroundColor={colors.textareColor}
              />
              <Send
                onClick={this.sendMessage}
                style={{ cursor: 'pointer', marginLeft: '5px' }}
              />
            </ChatComposerContainer>
          </ChatWindow>
        </ChatContainer>
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

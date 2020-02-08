import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchConversationResponse } from '../../../../apis';
import styled, { keyframes } from 'styled-components';
import _Send from '@material-ui/icons/Send';
import _Close from '@material-ui/icons/Close';
import { IconButton as _IconButton } from '@material-ui/core';
import _Paper from '@material-ui/core/Paper';
import _ChevronRight from '@material-ui/icons/ChevronRight';
import loadingGIF from '../../../../images/loading.gif';
import MessageBubble from '../../../ChatApp/MessageListItem/MessageBubbleStyle';
import './Chatbot.css';
import onChatComposerKeyDown from '../../../../utils/onChatComposerKeyDown';

const ENTER_KEY_CODE = 13;

const Paper = styled(_Paper)`
  width: ${props => props.width};
  position: relative;
  background-color: #ffffff;
  padding: 15px 0px;
  @media (min-width: 769px) {
    padding: 15px;
  }
`;

const ChevronRight = styled(_ChevronRight)`
  position: absolute;
  left: 0;
  top: 0;
  width: 35px;
  height: 35px;
  color: #9e9e9e;
  cursor: pointer;
  display: inherit;
  margin: 5px;
`;

const BR = styled.br`
  @media (min-width: 769px) {
    display: none;
  }
`;

const PreviewContainer = styled.div`
  height: ${props => (props.width < 1200 ? '740px' : '100%')};
  max-width: 95%;
  width: 360px;
  margin: 14px auto auto auto;
  padding: 0px 10px 10px;
  position: relative;
  overflow: hidden;
  @media (max-width: 520px) {
    width: 100%;
    padding: 0 10px;
  }
`;

const PreviewChatContainer = styled.div`
  min-height: ${props =>
    props.width > 1200 ? props.height - 250 + 'px' : '100%'};
  @media (max-width: 520px) {
    width: 100%;
  }
`;

const moveFromBottomFadeKeyframe = keyframes`
0% {
  opacity: .2;
  transform: translateY(5%)
}
`;

const SUSIFrameContainer = styled.div`
  overflow: auto;
  max-height: 800px;
  min-height: 280px;
  max-width: 100%;
  margin: 0;
  border-radius: 4px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.16);
  overflow-x: hidden;
  height: ${props =>
    props.width > 1200 ? props.height - 250 + 'px' : '630px'};
  width: 100%;
  animation: ${moveFromBottomFadeKeyframe} 0.3s ease both;
  media(max-width: 667px) {
    left: 0;
    right: 0;
    top: 0;
    border-radius: 4px;
    max-height: none;
  }
`;

const SUSIFrameWrapper = styled.div`
  position: relative;
  background-repeat: no-repeat;
  background-color: #fff;
  height: 100%;
  width: 100%;
  background-position: 150px 200px;
`;

const SUSIMessageContainer = styled.div`
  && {
    background-color: ${props => props.$backgroundColor};
    background-image: ${props => `url(${props.$backgroundImage})`};
  }
`;

const Close = styled(_Close)`
  fill: #fff;
`;

const launcherFrameAppearKeyframe = keyframes`
0% {
  opacity: 0;
  -webkit-transform: scale(.5);
  transform: scale(.5)
}
to {
  opacity: 1;
  -webkit-transform: scale(1);
  transform: scale(1)
}
`;

const SUSILauncherContainer = styled.div`
  right: 0;
  direction: ltr;
  bottom: 15px;
`;

const SUSILauncherWrapper = styled.div`
  width: 60px;
  background-size: 60px;
  text-align: right;
  float: right;
  margin-right: 0%;
  margin-top: 15px;
  border-radius: 5em;
  cursor: pointer;
  transition: transform .15s ease-in-out, box-shadow .15s ease-in-out;
  transform: translateY(150px);
  animation: ${launcherFrameAppearKeyframe} .25s ease forwards
  padding: 0;
  height: auto;
  :hover {
    box-shadow: 0 4px 42px 0 rgba(0, 0, 0, .25);
  }
`;

const SUSILauncherButton = styled.div`
  background-color: ${props => props.$backgroundColor};
  background-image: ${props => `url(${props.$backgroundImage})`};
  width: 60px;
  height: 60px;
  background-size: 60px;
  border-radius: 50%;
  margin: -1px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.15);
  right: 0;
  background-position: 50%;
  background-repeat: no-repeat;
  cursor: pointer;
  bottom: 15px;
  :after {
    content: '';
    position: absolute;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: #2ecc71;
    bottom: 5px;
    right: -1px;
  }
`;

const Send = styled(_Send)`
  fill: #0180c1;
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

const SUSICommentContent = styled.div`
  &&& {
    overflow-wrap: break-word;
    padding: 10px 0px;
  }
`;

const H1 = styled.h1`
  margin: 0px;
  text-align: center;
  @media (max-width: 769px) {
    padding-top: 0rem;
  }
`;

const Container = styled.div`
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
    0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
  position: relative;
`;

const ActionBar = styled.div`
  width: auto;
  height: 48px;
  background-color: #4285f4;
  padding: 0.3rem 0.5rem;
  top: 0px;
  display: flex;
  color: #fff;
  align-items: center;
  font-size: 1rem;
  justify-content: space-between;
`;

const IconButton = styled(_IconButton)`
  padding: 3.5px;
  color: #fff;
`;

const Textarea = styled.textarea`
  &&& {
    background: #fff;
    border: 1px solid white;
    padding: 10px !important;
    margin-right: 5px;
    width: 85% !important;
    border-radius: 10px !important;
    height: 50px;
  }
`;

class Preview extends Component {
  messageEndRef = React.createRef();
  msgNumber = 1;
  state = {
    messages: [{ message: 'Hi, I am SUSI', author: 'SUSI', loading: false }],
    message: '',
    previewChat: true,
    width: window.innerWidth,
    height: window.innerHeight,
    messageHistory: [],
    showMessage: false,
    currentMessageIndex: -1,
  };

  componentDidMount = () => {
    this.updateWindowDimensions();
    this.scrollToBottom();
    window.addEventListener('resize', this.updateWindowDimensions);
  };

  componentDidUpdate() {
    if (this.messageEndRef.current) {
      this.scrollToBottom();
    }
  }

  togglePreview = () => {
    this.setState(prevState => ({
      previewChat: !prevState.previewChat,
    }));
  };

  sendMessage = async event => {
    const { message, messageHistory } = this.state;
    const { code } = this.props;
    if (message.trim().length > 0) {
      this.setState({
        messageHistory: [message, ...messageHistory],
        showMessage: true,
        currentMessageIndex: -1,
      });
      this.addMessage(message, 'You');
      const encodedMessage = encodeURIComponent(message);
      const encodedCode = encodeURIComponent(code);
      try {
        let payload = await fetchConversationResponse({
          q: encodedMessage,
          instant: encodedCode,
        });
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
      } catch (error) {
        console.log('Could not fetch reply');
      }
      this.setState({ message: '' });
    }
  };

  onKeydown = event => {
    if (event.keyCode === ENTER_KEY_CODE) {
      event.preventDefault();
      this.sendMessage();
      this.setState({ message: '' });
    } else {
      const { messageHistory, currentMessageIndex } = this.state;
      const { message, newMessageIndex } = onChatComposerKeyDown(
        event.keyCode,
        messageHistory,
        currentMessageIndex,
      );
      if (message !== '') {
        event.preventDefault();
        this.setState({
          message: message,
          currentMessageIndex: newMessageIndex,
        });
      }
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

  escapeRegExp = str => {
    return str.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1');
  };

  replaceAll = (str, find, replace) => {
    return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
  };

  // Scroll to the bottom
  scrollToBottom = () => {
    this.messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateWindowDimensions);
  };

  updateWindowDimensions = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  render() {
    const { messages, previewChat, message, width, height } = this.state;
    const {
      design: {
        botbuilderBackgroundBody,
        botbuilderBodyBackgroundImg,
        botbuilderIconColor,
        botbuilderUserMessageBackground,
        botbuilderUserMessageTextColor,
        botbuilderBotMessageTextColor,
        botbuilderBotMessageBackground,
        botbuilderIconImg,
      },
      handlePreviewToggle,
      paperWidth,
    } = this.props;
    let renderMessages = null;
    if (messages && Array.isArray(messages) && messages.length > 0) {
      renderMessages = messages.map((message, index) => {
        if (message.author === 'You') {
          return (
            <MessageBubble
              author={message.author}
              width={'fit-content'}
              $backgroundColor={botbuilderUserMessageBackground}
              color={botbuilderUserMessageTextColor}
            >
              <SUSICommentContent>{message.message}</SUSICommentContent>
            </MessageBubble>
          );
        }
        return (
          <MessageBubble
            key={index}
            author={message.author}
            width={'fit-content'}
            $backgroundColor={botbuilderBotMessageBackground}
            color={botbuilderBotMessageTextColor}
          >
            <SUSICommentContent>{message.message}</SUSICommentContent>
          </MessageBubble>
        );
      });
    } else {
      return null;
    }
    return (
      <Container>
        <Paper width={paperWidth}>
          <ChevronRight onClick={handlePreviewToggle} />
          <BR />
          <H1>Preview</H1>
          <PreviewContainer width={width}>
            <PreviewChatContainer width={width} height={height}>
              {previewChat && (
                <SUSIFrameContainer width={width} height={height}>
                  <SUSIFrameWrapper>
                    <ActionBar>
                      <div>Chat with SUSI.AI</div>
                      <IconButton onClick={this.togglePreview}>
                        <Close />
                      </IconButton>
                    </ActionBar>
                    <div
                      id="susi-container"
                      className="susi-container susi-reset"
                    >
                      <div id="susi-chatbox" className="susi-chatbox">
                        <div
                          className="susi-sheet-content"
                          style={{ marginTop: '48px', marginBottom: '66px' }}
                        >
                          <SUSIMessageContainer
                            className="susi-sheet-content-container"
                            $backgroundColor={botbuilderBackgroundBody}
                            $backgroundImage={botbuilderBodyBackgroundImg}
                          >
                            <div
                              className="susi-conversation-parts-container"
                              style={{ padding: '5px' }}
                            >
                              <div
                                id="susi-message"
                                className="susi-conversation-parts"
                              >
                                {renderMessages}
                                <div ref={this.messageEndRef} />
                              </div>
                            </div>
                          </SUSIMessageContainer>
                        </div>
                        <div className="susi-composer-container">
                          <div id="susi-composer" className="susi-composer ">
                            <div
                              className="susi-composer-textarea-container"
                              style={{ backgroundColor: '#f9f9f9' }}
                            >
                              <div
                                className="susi-composer-textarea"
                                style={{
                                  boxShadow:
                                    'rgba(0, 0, 0, 0.16) 0px 0.1875rem 0.375rem, rgba(0, 0, 0, 0.23) 0px 3px 6px',
                                  padding: '0.875rem 0rem 0rem 0.5rem',
                                }}
                              >
                                <div style={{ display: 'flex' }}>
                                  <Textarea
                                    placeholder="Type a message..."
                                    rows="1"
                                    value={message}
                                    onKeyPress={event => {
                                      if (event.which === ENTER_KEY_CODE) {
                                        event.preventDefault();
                                      }
                                    }}
                                    onChange={ev =>
                                      this.setState({
                                        message: ev.target.value,
                                      })
                                    }
                                    onKeyDown={event => {
                                      this.onKeydown(event);
                                    }}
                                  />
                                  <div>
                                    <IconButton onClick={this.sendMessage}>
                                      <Send />
                                    </IconButton>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SUSIFrameWrapper>
                </SUSIFrameContainer>
              )}
            </PreviewChatContainer>
            <div style={{ textAlign: 'right' }}>
              <SUSILauncherContainer>
                <SUSILauncherWrapper onClick={this.togglePreview}>
                  <SUSILauncherButton
                    data-tip="Toggle Launcher"
                    $backgroundColor={botbuilderIconColor}
                    $backgroundImage={botbuilderIconImg}
                  />
                </SUSILauncherWrapper>
              </SUSILauncherContainer>
            </div>
          </PreviewContainer>
        </Paper>
      </Container>
    );
  }
}

Preview.propTypes = {
  design: PropTypes.object,
  code: PropTypes.string,
  botbuilderBackgroundBody: PropTypes.string,
  botbuilderBodyBackgroundImg: PropTypes.string,
  botbuilderIconColor: PropTypes.string,
  botbuilderUserMessageBackground: PropTypes.string,
  botbuilderUserMessageTextColor: PropTypes.string,
  botbuilderBotMessageTextColor: PropTypes.string,
  botbuilderBotMessageBackground: PropTypes.string,
  handlePreviewToggle: PropTypes.func,
  paperWidth: PropTypes.string,
};

function mapStateToProps(store) {
  return {
    design: store.create.design,
    code: store.create.skill.code,
  };
}

export default connect(
  mapStateToProps,
  null,
)(Preview);

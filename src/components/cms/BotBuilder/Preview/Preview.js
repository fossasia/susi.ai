import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchConversationResponse } from '../../../../apis';
import styled, { keyframes } from 'styled-components';
import _Send from '@material-ui/icons/Send';
import Close from '@material-ui/icons/Close';
import loadingGIF from '../../../../images/loading.gif';
import './Chatbot.css';

const Container = styled.div`
  height: 600px;
  max-width: 95%;
  width: 330px;
  margin: 10px auto auto auto;
  padding: 0 20px;
  @media (max-width: 520px) {
    width: 100%;
    padding: 0 10px;
  }
`;

const PreviewChatContainer = styled.div`
  min-height: 460px;
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
  max-height: 610px;
  min-height: 280px;
  max-width: 100%;
  margin: 0;
  border-radius: 8px;
  box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
  overflow-x: hidden;
  height: 460px;
  width: 100%;
  animation: ${moveFromBottomFadeKeyframe} 0.3s ease both;

  media(max-width: 667px) {
    left: 0;
    right: 0;
    top: 0;
    border-radius: 0;
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
    background-color: ${props => props.backgroundColor};
    background-image: ${props => `url(${props.backgroundImage})`};
  }
`;

const UserMessageContainer = styled.div`
  :after {
    content: '';
    position: absolute;
    box-sizing: border-box;
    right: -10px;
    top: 36px;
    transform: rotate(-135deg);
    border: 8px solid;
    background-color: transparent;
    transform-origin: 0 0;
    border-color: ${props =>
      `transparent transparent ${props.backgroundColor} ${props.backgroundColor}`};
  }
`;

const CloseButton = styled(Close)`
  cursor: pointer;
  position: absolute;
  right: 15px;
  top: 15px;
  width: 30px;
  height: 30px;
  background-color: #666;
  border-radius: 50%;
  fill: #fff;
`;

const SendButtonWrapper = styled.pre`
  margin: 0;
  cursor: pointer;
  overflow: hidden;
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
  background-color: ${props => props.backgroundColor};
  background-image: ${props => `url(${props.backgroundImage})`};
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
`;

const SUSICommentContent = styled.div`
  overflow-wrap: break-word;
`;

class Preview extends Component {
  constructor() {
    super();
    this.msgNumber = 1;
    this.state = {
      messages: [{ message: 'Hi, I am SUSI', author: 'SUSI', loading: false }],
      message: '',
      previewChat: true,
    };
  }

  togglePreview = () => {
    this.setState(prevState => ({
      previewChat: !prevState.previewChat,
    }));
  };

  sendMessage = event => {
    const { message } = this.state;
    const { code } = this.props;
    if (message.trim().length > 0) {
      this.addMessage(message, 'You');
      const encodedMessage = encodeURIComponent(message);
      const encodedCode = encodeURIComponent(code);
      fetchConversationResponse({ q: encodedMessage, instant: encodedCode })
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

  escapeRegExp = str => {
    return str.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1');
  };

  replaceAll = (str, find, replace) => {
    return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
  };

  // Scroll to the bottom
  scrollToBottomOfResults = () => {
    var textsDiv = document.querySelector('.susi-sheet-content');
    textsDiv.scrollTop = textsDiv.scrollHeight;
  };

  render() {
    const { messages, previewChat, message } = this.state;
    const {
      botbuilderBackgroundBody,
      botbuilderBodyBackgroundImg,
      botbuilderIconColor,
      botbuilderUserMessageBackground,
      botbuilderUserMessageTextColor,
      botbuilderBotMessageTextColor,
      botbuilderBotMessageBackground,
      botbuilderIconImg,
    } = this.props.design;
    const { botBuilder } = this.props;
    let renderMessages = null;
    if (messages.length) {
      renderMessages = messages.map((message, index) => {
        if (message.author === 'You') {
          return (
            <div
              key={index}
              className="susi-conversation-part susi-conversation-part-grouped-first"
            >
              <UserMessageContainer
                backgroundColor={botbuilderUserMessageBackground}
                className="susi-comment susi-comment-by-user"
              >
                <div
                  className="susi-comment-body-container susi-comment-body-container-user"
                  style={{
                    backgroundColor: botbuilderUserMessageBackground,
                    color: botbuilderUserMessageTextColor,
                  }}
                >
                  <div className="susi-comment-body">
                    <SUSICommentContent>{message.message}</SUSICommentContent>
                  </div>
                </div>
              </UserMessageContainer>
            </div>
          );
        }
        return (
          <div
            key={index}
            id="susiMsg"
            className="susi-conversation-part susi-conversation-part-grouped-first"
          >
            <div
              className="susi-comment-avatar susi-theme-bg"
              style={{
                backgroundImage: `url(${botbuilderIconImg})`,
              }}
            />
            <div className="susi-comment susi-comment-by-susi">
              <div
                className="susi-comment-body-container susi-comment-body-container-susi"
                style={{
                  backgroundColor: botbuilderBotMessageBackground,
                  color: botbuilderBotMessageTextColor,
                }}
              >
                <div className="susi-comment-body ">
                  <SUSICommentContent>{message.message}</SUSICommentContent>
                </div>
              </div>
            </div>
          </div>
        );
      });
    } else {
      return null;
    }
    return (
      <Container>
        <PreviewChatContainer>
          {previewChat && (
            <SUSIFrameContainer>
              <SUSIFrameWrapper>
                <div id="susi-container" className="susi-container susi-reset">
                  <div id="susi-chatbox" className="susi-chatbox">
                    <div className="susi-sheet-content">
                      <SUSIMessageContainer
                        className="susi-sheet-content-container"
                        backgroundColor={botbuilderBackgroundBody}
                        backgroundImage={botbuilderBodyBackgroundImg}
                      >
                        <div className="susi-conversation-parts-container">
                          <div
                            id="susi-message"
                            className="susi-conversation-parts"
                          >
                            {renderMessages}
                          </div>
                        </div>
                      </SUSIMessageContainer>
                    </div>
                    <div className="susi-composer-container">
                      <div id="susi-composer" className="susi-composer ">
                        <div className="susi-composer-textarea-container">
                          <div className="susi-composer-textarea">
                            <SendButtonWrapper>
                              <Send onClick={this.sendMessage} />
                            </SendButtonWrapper>
                            <textarea
                              placeholder="Enter your response"
                              rows="1"
                              value={message}
                              onKeyPress={event => {
                                if (event.which === 13 /* Enter */) {
                                  event.preventDefault();
                                }
                              }}
                              onChange={ev =>
                                this.setState({ message: ev.target.value })
                              }
                              onKeyDown={event => {
                                if (event.keyCode === 13) {
                                  this.sendMessage();
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <CloseButton onClick={this.togglePreview} />
              </SUSIFrameWrapper>
            </SUSIFrameContainer>
          )}
        </PreviewChatContainer>
        {botBuilder ? (
          <div style={{ textAlign: 'right' }}>
            <SUSILauncherContainer>
              <SUSILauncherWrapper onClick={this.togglePreview}>
                <SUSILauncherButton
                  data-tip="Toggle Launcher"
                  backgroundColor={botbuilderIconColor}
                  backgroundImage={botbuilderIconImg}
                />
              </SUSILauncherWrapper>
            </SUSILauncherContainer>
          </div>
        ) : null}
      </Container>
    );
  }
}

Preview.propTypes = {
  design: PropTypes.object,
  code: PropTypes.string,
  botBuilder: PropTypes.bool,
  botbuilderBackgroundBody: PropTypes.string,
  botbuilderBodyBackgroundImg: PropTypes.string,
  botbuilderIconColor: PropTypes.string,
  botbuilderUserMessageBackground: PropTypes.string,
  botbuilderUserMessageTextColor: PropTypes.string,
  botbuilderBotMessageTextColor: PropTypes.string,
  botbuilderBotMessageBackground: PropTypes.string,
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

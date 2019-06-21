import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactFitText from 'react-fittext';
import Modal from 'react-modal';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Send from '@material-ui/icons/Send';
import Mic from '@material-ui/icons/Mic';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import _TextareaAutosize from 'react-textarea-autosize';
import './ChatApp.css';
import messageActions from '../../redux/actions/messages';
import uiActions from '../../redux/actions/ui';
import {
  formatUserMessage,
  formatSusiMessage,
} from '../../utils/formatMessage';
import { urlParam } from '../../utils/helperFunctions';
import { invertColorTextArea } from '../../utils/invertColor';
import getCustomThemeColors from '../../utils/colors';
import * as apis from '../../apis';
import VoiceRecognition from './VoiceRecognition';
import { getAllUserMessages } from '../../utils/messageFilter';
import { createMessagePairArray } from '../../utils/formatMessage';

const ENTER_KEY_CODE = 13;
const UP_KEY_CODE = 38;
const DOWN_KEY_CODE = 40;

const SendButton = styled(IconButton)`
  align-content: center;
  border-radius: 50%;
  transition: box-shadow 0.3s ease-in-out;
  bottom: 0.875rem;
  right: 0.3125rem;
  position: absolute;
  color: rgb(66, 133, 244);
`;

const CloseButton = styled(CloseIcon)`
  position: absolute;
  z-index: 120000;
  fill: #444;
  width: 1.25rem;
  height: 1.25rem;
  right: 0px;
  top: 0px;
  cursor: pointer;
`;

const VoiceResponse = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  max-width: 46.5rem;
  margin: 0 auto;
  text-align: center;

  @media (max-width: 768px) {
    display: block;
    flex-wrap: row;
    max-width: 18.75rem;
  }
`;

const MicContainer = styled.div`
  border: 1px solid #eee;
  border-radius: 100%;
  box-shadow: 0 0.125rem 0.3125rem rgba(0, 0, 0, 0.1);
  cursor: pointer;
  left: 0;
  pointer-events: none;
  transition: background-color 0.218s, border 0.218s, box-shadow 0.218s;
  width: 5rem;
  height: 5rem;
  position: relative;
  background-color: #fe2222;
  animation: blinker 1s cubic-bezier(0.5, 0, 1, 1) infinite alternate;
  @media (max-width: 768px) {
    margin: 1rem auto;
    text-align: center;
  }
`;

const StyledMic = styled(Mic)`
  && {
    color: #fff;
    height: 2.5rem;
    width: 2.5rem;
    margin-top: 1.25rem;
    user-select: none;
    transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
  }
`;

const VoiceOutputText = styled.h1`
  font-family: 'Lato', sans-serif;
  width: 31rem;
  font-size: 100%;
  max-width: 25rem;
  text-align: left;
  padding-right: 1.25rem;
  color: ${props => props.color};
  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
    padding-right: 0px;
    margin: 0 auto;
  }
`;

const TextAreaContainer = styled.div`
  max-width: 89%;
  border-radius: 10px;
  display: block;
  position: relative;
  box-sizing: content-box;
  line-height: 20px;
  font-size: 15px;
  min-height: 20px;
  border: none;
  padding: 0.625rem 0.75rem;
  background-color: ${props => props.backgroundColor};
  color: ${props => props.color};
  max-height: 5rem;
  @media (max-width: 768px) {
    width: 81%;
  }
`;

const TextareaAutosize = styled(_TextareaAutosize)`
  line-height: 1rem;
  background-color: ${props => props.backgroundColor};
  color: ${props => props.color};
  border: none;
  width: 100%;
  outline: none;
  box-shadow: none;
  resize: none;
  font-family: 'Product Sans', sans-serif;
  font-weight: 300;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  margin-top: 0.1875rem;
  background: #fff;
  color: #001d38;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  min-height: 80%;
  position: relative;
  top: 0px;
`;

const Container = styled.div`
  width: 100%;
  margin: 0 8px 0 0;
  padding: 0.875rem 0.5625rem 0.5rem 0.5625rem;
  font-size: 0.875rem;
  border: none;
  background: 0 0;
  text-align: left;
  color: inherit;
  -webkit-appearance: none;
  border-radius: 0;
  display: block;
  text-align: left;
  color: inherit;
  outline: 0;
`;

class MessageComposer extends Component {
  static propTypes = {
    dream: PropTypes.string,
    textarea: PropTypes.string,
    speechOutput: PropTypes.bool,
    speechOutputAlways: PropTypes.bool,
    focus: PropTypes.bool,
    actions: PropTypes.object,
    enterAsSend: PropTypes.bool,
    micInput: PropTypes.bool,
    messagesByID: PropTypes.object,
    messages: PropTypes.array,
    openSnackBar: PropTypes.func,
    loadingHistory: PropTypes.bool,
    theme: PropTypes.string,
    customThemeValue: PropTypes.object,
    exitSearch: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      text: props.dream ? `dream ${props.dream}` : '',
      isListening: false,
      isSpeechDialogOpen: false,
      speechToTextOutput: '',
      rows: 1,
      micAccess: false,
      currentMessageIndex: -1,
      speechRecognitionTextcolor: '#000',
    };
    this.userMessageHistory = [];
    const { micInput } = this.props;
    if (micInput) {
      const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition ||
        window.mozSpeechRecognition ||
        window.msSpeechRecognition ||
        window.oSpeechRecognition;
      this.speechToTextAvailable = SpeechRecognition;
    } else {
      this.speechToTextAvailable = false;
    }
  }

  componentDidMount() {
    const { actions } = this.props;
    actions
      .getHistoryFromServer()
      .then(({ payload }) => {
        createMessagePairArray(payload).then(messagePairArray => {
          actions.initializeMessageStore(messagePairArray).then(() => {
            const testSkill = urlParam('testExample');
            const {
              messagesByID,
              messages,
              speechOutputAlways,
              enterAsSend,
            } = this.props;
            this.userMessageHistory = getAllUserMessages(
              messages,
              messagesByID,
              'REVERSE',
            );
            if (testSkill) {
              let text = testSkill.trim();
              if (text) {
                if (!enterAsSend) {
                  text = text.split('\n').join(' ');
                }
                this.createUserMessage(text, speechOutputAlways);
              }
            }
          });
        });
      })
      .catch(error => {
        actions.initializeMessageStoreFailed();
        console.log(error);
      });
  }

  onStart = () => {
    this.setState({
      speechToTextOutput: '',
      isSpeechDialogOpen: true,
      micAccess: true,
    });
  };

  onEnd = () => {
    const { speechOutputAlways, speechOutput } = this.props;
    const { speechToTextOutput } = this.state;
    this.setState({
      isListening: false,
      isSpeechDialogOpen: false,
      speechRecognitionTextcolor: '#000',
    });

    let voiceResponse = false;
    if (speechOutputAlways || speechOutput) {
      voiceResponse = true;
    }
    if (speechToTextOutput) {
      this.createUserMessage(speechToTextOutput, voiceResponse);
    }
  };

  onResult = ({ interimTranscript, finalTranscript }) => {
    if (!interimTranscript) {
      this.setState({
        speechToTextOutput: finalTranscript,
        speechRecognitionTextcolor: '#ccc',
      });
    } else {
      this.setState({
        speechToTextOutput: interimTranscript,
        speechRecognitionTextcolor: '#ccc',
      });
      if (finalTranscript) {
        this.setState({
          speechToTextOutput: finalTranscript,
          speechRecognitionTextcolor: '#000',
        });
        this.speechDialogClose();
      }
    }
  };

  speechDialogClose = () => {
    const { speechToTextOutput, micAccess } = this.state;
    const { actions } = this.props;
    this.setState({
      isSpeechDialogOpen: false,
      isListening: false,
    });
    if (speechToTextOutput === '' && micAccess) {
      actions.openSnackBar({
        snackBarMessage: "Sorry, didn't hear anything. Please speak again.",
      });
    }
  };

  speechDialogCloseButton = () => {
    this.setState({
      text: '',
      isListening: false,
      isSpeechDialogOpen: false,
      speechToTextOutput: '',
      rows: 1,
    });
  };

  onClickButton = () => {
    const { isListening } = this.state;
    let { text } = this.state;
    const { enterAsSend } = this.props;
    if (text === '') {
      if (this.speechToTextAvailable) {
        this.setState({ isListening: true });
        setTimeout(() => {
          if (!isListening) {
            this.speechDialogClose();
          }
        }, 5000);
      }
    } else {
      text = text.trim();
      if (text) {
        if (!enterAsSend) {
          text = text.split('\n').join(' ');
        }
        this.createUserMessage(text, this.props.speechOutputAlways);
      }
      this.setState({ text: '', currentMessageIndex: -1 });
    }
  };

  createUserMessage(text, voice) {
    this.userMessageHistory = [text, ...this.userMessageHistory];
    formatUserMessage({
      text,
      voice,
    }).then(userMessage => {
      this.props.actions
        .createMessage(userMessage)
        .then(
          apis.getSusiReply(userMessage).then(response => {
            formatSusiMessage({
              response,
              voice,
            }).then(susiMessage => {
              this.props.actions.createSusiMessage(susiMessage);
            });
          }),
        )
        .catch(error => {
          console.log(error);
        });
    });
  }

  onTextFieldChange = (event, value) => {
    this.setState({ text: event.target.value, currentMessageIndex: -1 });
  };

  onKeyDown = event => {
    let { text, currentMessageIndex } = this.state;
    const { enterAsSend, speechOutputAlways, exitSearch } = this.props;
    exitSearch();
    if (event.keyCode === ENTER_KEY_CODE && !event.shiftKey) {
      if (enterAsSend) {
        event.preventDefault();
        text = text.trim().replace(/\n|\r\n|\r/g, ' ');
        if (text) {
          this.createUserMessage(text, speechOutputAlways);
        }
        this.setState({ text: '', currentMessageIndex: -1 });
      }
    } else {
      switch (event.keyCode) {
        case UP_KEY_CODE: {
          event.preventDefault();
          const newMessageIndex =
            (currentMessageIndex + 1) % this.userMessageHistory.length;
          this.setState({
            text: this.userMessageHistory[newMessageIndex],
            currentMessageIndex: newMessageIndex,
          });
          break;
        }
        case DOWN_KEY_CODE: {
          event.preventDefault();
          if (currentMessageIndex - 1 === -1) {
            const newMessageIndex = this.userMessageHistory.length - 1;
            this.setState({
              text: this.userMessageHistory[newMessageIndex],
              currentMessageIndex: newMessageIndex,
            });
          } else {
            const newMessageIndex = currentMessageIndex - 1;
            this.setState({
              text: this.userMessageHistory[newMessageIndex],
              currentMessageIndex: newMessageIndex,
            });
          }
          break;
        }
        default:
          break;
      }
    }
  };

  render() {
    const {
      isListening,
      text,
      isSpeechDialogOpen,
      speechRecognitionTextcolor,
      speechToTextOutput,
    } = this.state;
    const { focus, theme, customThemeValue } = this.props;
    const { textarea } = getCustomThemeColors({ theme, customThemeValue });
    const textcolor = invertColorTextArea(textarea);
    return (
      <Container>
        {isListening && (
          <VoiceRecognition
            onStart={this.onStart}
            onEnd={this.onEnd}
            onResult={this.onResult}
            continuous={true}
            lang="en-US"
          />
        )}
        <TextAreaContainer backgroundColor={textarea}>
          <TextareaAutosize
            className="scroll"
            id="scroll"
            minRows={1}
            maxRows={2}
            placeholder="Type a message..."
            value={text}
            onChange={this.onTextFieldChange}
            onKeyDown={this.onKeyDown}
            ref={textarea => {
              this.nameInput = textarea;
            }}
            autoFocus={focus}
            background={textarea}
            color={textcolor}
          />
        </TextAreaContainer>
        <SendButton onClick={this.onClickButton}>
          {this.speechToTextAvailable && !text ? <Mic /> : <Send />}
        </SendButton>

        <Modal
          isOpen={isSpeechDialogOpen}
          className="Modal"
          contentLabel="Speak Now"
          overlayClassName="Overlay"
        >
          <VoiceResponse>
            <ReactFitText compressor={0.5} minFontSize={12} maxFontSize={26}>
              <VoiceOutputText color={speechRecognitionTextcolor}>
                {speechToTextOutput ? speechToTextOutput : 'Speak Now...'}
              </VoiceOutputText>
            </ReactFitText>
            <MicContainer>
              <StyledMic />
            </MicContainer>
            <CloseButton onClick={this.speechDialogCloseButton} />
          </VoiceResponse>
        </Modal>
      </Container>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...messageActions, ...uiActions }, dispatch),
  };
}

function mapStateToProps(store) {
  const { messagesByID, messages, loadingHistory } = store.messages;
  const {
    enterAsSend,
    micInput,
    speechOutput,
    speechOutputAlways,
  } = store.settings;
  return {
    messagesByID,
    micInput,
    enterAsSend,
    speechOutput,
    speechOutputAlways,
    messages,
    loadingHistory,
    customThemeValue: store.settings.customThemeValue,
    theme: store.settings.theme,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MessageComposer);

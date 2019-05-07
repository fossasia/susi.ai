import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactFitText from 'react-fittext';
import Modal from 'react-modal';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SendIcon from 'material-ui/svg-icons/content/send';
import MicIcon from 'material-ui/svg-icons/av/mic';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import TextareaAutosize from 'react-textarea-autosize';
import './ChatApp.css';
import actions from '../../redux/actions/messages';
import {
  formatUserMessage,
  formatSusiMessage,
} from '../../utils/formatMessage';
import { urlParam } from '../../utils/helperFunctions';
import * as apis from '../../apis';
import VoiceRecognition from './VoiceRecognition';
import { getAllUserMessages } from '../../utils/messageFilter';

const ENTER_KEY_CODE = 13;
const UP_KEY_CODE = 38;
const DOWN_KEY_CODE = 40;

const styles = {
  buttonStyle: {
    mini: true,
    bottom: '14px',
    right: '5px',
    position: 'absolute',
  },
  iconStyles: {
    color: '#fff',
    fill: 'currentcolor',
    height: '40px',
    width: '40px',
    marginTop: '20px',
    userSelect: 'none',
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
  },
  closingStyle: {
    position: 'absolute',
    zIndex: 120000,
    fill: '#444',
    width: '20px',
    height: '20px',
    right: '0px',
    top: '0px',
    cursor: 'pointer',
  },
};

class MessageComposer extends Component {
  static propTypes = {
    dream: PropTypes.string,
    textarea: PropTypes.string,
    textcolor: PropTypes.string,
    speechOutput: PropTypes.bool,
    speechOutputAlways: PropTypes.bool,
    micColor: PropTypes.string,
    focus: PropTypes.bool,
    actions: PropTypes.object,
    enterAsSend: PropTypes.bool,
    micInput: PropTypes.bool,
    messagesByID: PropTypes.object,
    messages: PropTypes.array,
    openSnackBar: PropTypes.func,
    loadingHistory: PropTypes.bool,
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
    const { speechOutputAlways, enterAsSend } = this.props;
    let testSkill = urlParam('testExample');
    if (testSkill) {
      let text = testSkill.trim();
      if (text) {
        if (!enterAsSend) {
          text = text.split('\n').join(' ');
        }
        setTimeout(() => {
          this.createUserMessage(text, speechOutputAlways);
        }, 1);
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { messagesByID, messages } = this.props;
    if (
      messages.length !== 0 &&
      prevProps.loadingHistory !== this.props.loadingHistory
    ) {
      this.userMessageHistory = getAllUserMessages(
        messages,
        messagesByID,
        'REVERSE',
      );
    }
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
    const { openSnackBar } = this.props;
    this.setState({
      isSpeechDialogOpen: false,
      isListening: false,
    });
    if (speechToTextOutput === '' && micAccess) {
      openSnackBar({
        snackBarMessage: "Sorry, didn't hear anything. Please speak again.",
        snackBarDuration: 4000,
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
        setTimeout(() => {
          this.createUserMessage(text, this.props.speechOutputAlways);
        }, 1);
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
    const { enterAsSend, speechOutputAlways } = this.props;
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
    const { textarea, textcolor, focus, micColor } = this.props;
    return (
      <div className="message-composer">
        {isListening && (
          <VoiceRecognition
            onStart={this.onStart}
            onEnd={this.onEnd}
            onResult={this.onResult}
            continuous={true}
            lang="en-US"
          />
        )}
        <div className="textBack" style={{ backgroundColor: textarea }}>
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
            style={{
              background: textarea,
              color: textcolor,
              lineHeight: '15px',
            }}
            autoFocus={focus}
          />
        </div>
        <IconButton
          className="send_button"
          iconStyle={{
            fill: micColor,
            margin: '1px 0px 1px 0px',
          }}
          onClick={this.onClickButton}
          style={styles.buttonStyle}
        >
          {this.speechToTextAvailable && !text ? <MicIcon /> : <SendIcon />}
        </IconButton>

        <Modal
          isOpen={isSpeechDialogOpen}
          className="Modal"
          contentLabel="Speak Now"
          overlayClassName="Overlay"
        >
          <div className="voice-response">
            <ReactFitText compressor={0.5} minFontSize={12} maxFontSize={26}>
              <h1
                style={{ color: speechRecognitionTextcolor }}
                className="voice-output"
              >
                {speechToTextOutput ? speechToTextOutput : 'Speak Now...'}
              </h1>
            </ReactFitText>
            <div
              className={isListening ? 'mic-container active' : 'mic-container'}
            >
              <MicIcon style={styles.iconStyles} />
            </div>
            <CloseIcon
              style={styles.closingStyle}
              onClick={this.speechDialogCloseButton}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
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
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MessageComposer);

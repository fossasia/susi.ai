import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactFitText from 'react-fittext';
import injectTapEventPlugin from 'react-tap-event-plugin';
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
import UserPreferencesStore from '../../stores/UserPreferencesStore';
import MessageStore from '../../stores/MessageStore';
import * as Actions from '../../actions/';

injectTapEventPlugin();

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
    threadID: PropTypes.string.isRequired,
    dream: PropTypes.string,
    textarea: PropTypes.string,
    textcolor: PropTypes.string,
    speechOutput: PropTypes.bool,
    speechOutputAlways: PropTypes.bool,
    micColor: PropTypes.string,
    focus: PropTypes.bool,
    actions: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      text: props.dream ? `dream ${props.dream}` : '',
      start: false,
      stop: false,
      open: false,
      result: '',
      animate: false,
      rows: 1,
      recognizing: false,
      micAccess: false,
      currentArrowIndex: -1, // current message indexed at -1, latest message at 0
    };
    this.flag = 1;
  }

  componentDidMount() {
    const { threadID, speechOutputAlways } = this.props;
    const micInputSetting = UserPreferencesStore.getMicInput();
    if (micInputSetting) {
      // Getting the Speech Recognition to test whether possible
      const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition ||
        window.mozSpeechRecognition ||
        window.msSpeechRecognition ||
        window.oSpeechRecognition;
      // Setting buttons accordingly
      if (SpeechRecognition != null) {
        this.Button = <MicIcon />;
        this.speechRecog = true;
      } else {
        this.Button = <SendIcon />;
        this.speechRecog = false;
      }
    } else {
      this.Button = <SendIcon />;
      this.speechRecog = false;
    }

    let testSkill = urlParam('testExample');
    if (testSkill) {
      let text = testSkill.trim();
      if (text) {
        let enterAsSend = UserPreferencesStore.getEnterAsSend();
        if (!enterAsSend) {
          text = text.split('\n').join(' ');
        }
        setTimeout(() => {
          Actions.createMessage(text, threadID, speechOutputAlways);
        }, 1);
      }
    }
  }

  componentDidUpdate() {
    const micInputSetting = UserPreferencesStore.getMicInput();
    if (micInputSetting) {
      // Getting the Speech Recognition to test whether possible
      const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition ||
        window.mozSpeechRecognition ||
        window.msSpeechRecognition ||
        window.oSpeechRecognition;
      // Setting buttons accordingly
      if (SpeechRecognition != null) {
        this.Button = <MicIcon />;
        this.speechRecog = true;
      } else {
        this.Button = <SendIcon />;
        this.speechRecog = false;
      }
    } else {
      this.Button = <SendIcon />;
      this.speechRecog = false;
    }
  }

  onStart = () => {
    this.setState({
      result: '',
      start: true,
      stop: false,
      open: true,
      micAccess: true,
      animate: true,
    });
  };

  onSpeechStart = () => {
    this.setState({
      recognizing: true,
      micAccess: true,
    });
    this.flag = 1;
  };

  onEnd = () => {
    const { speechOutputAlways, speechOutput, threadID } = this.props;
    const { result } = this.state;
    this.setState({
      start: false,
      stop: false,
      open: false,
      animate: false,
      color: '#000',
      recognizing: false,
    });

    let voiceResponse = false;
    if (speechOutputAlways || speechOutput) {
      voiceResponse = true;
    }
    this.Button = <MicIcon />;
    if (result) {
      Actions.createMessage(result, threadID, voiceResponse);
    }
  };

  speakDialogClose = () => {
    const { result, micAccess } = this.state;
    this.setState({
      open: false,
      start: false,
      stop: false,
    });
    if (result === '') {
      let x = document.getElementById('snackbar');
      if (micAccess) {
        x.className = 'show';
        setTimeout(() => {
          x.className = x.className.replace('show', '');
        }, 3000);
      }
    }
  };

  speakDialogCloseButton = () => {
    this.setState({
      text: '',
      start: false,
      stop: false,
      open: false,
      result: '',
      animate: false,
      rows: 1,
      recognizing: false,
    });
    this.flag = 0;
  };

  onResult = ({ interimTranscript, finalTranscript }) => {
    if (interimTranscript === undefined) {
      this.setState({
        result: finalTranscript,
        color: '#ccc',
      });
    } else {
      this.setState({
        result: interimTranscript,
        color: '#ccc',
      });
      if (finalTranscript) {
        this.setState({
          result: finalTranscript,
          color: '#000',
        });
        this.speakDialogClose();
      }
    }
  };

  _onClickButton = () => {
    const { recognizing } = this.state;
    let { text } = this.state;
    const { threadID, speechOutputAlways } = this.props;
    this.flag = 1;
    if (text === '') {
      if (this.speechRecog) {
        this.setState({ start: true });
      } else {
        this.setState({ start: false });
      }
    } else {
      text = text.trim();
      if (text) {
        let enterAsSend = UserPreferencesStore.getEnterAsSend();
        if (!enterAsSend) {
          text = text.split('\n').join(' ');
        }
        Actions.createMessage(text, threadID, speechOutputAlways);
      }
      if (this.speechRecog) {
        this.Button = <MicIcon />;
      }
      this.setState({ text: '', currentArrowIndex: -1 });
    }
    setTimeout(() => {
      if (recognizing === false && this.flag !== 0) {
        this.speakDialogClose();
      }
    }, 5000);
  };

  _onChange = (event, value) => {
    if (this.speechRecog) {
      if (event.target.value !== '') {
        this.Button = <SendIcon />;
      } else {
        this.Button = <MicIcon />;
      }
    } else {
      this.Button = <SendIcon />;
    }
    this.setState({ text: event.target.value, currentArrowIndex: -1 });
  };

  _onKeyDown = event => {
    let { text, currentArrowIndex } = this.state;
    const { threadID, speechOutputAlways } = this.props;
    if (event.keyCode === ENTER_KEY_CODE && !event.shiftKey) {
      const enterAsSend = UserPreferencesStore.getEnterAsSend();
      if (enterAsSend) {
        event.preventDefault();
        text = text.trim().replace(/\n|\r\n|\r/g, ' ');
        if (text) {
          Actions.createMessage(text, threadID, speechOutputAlways);

          formatUserMessage({
            text,
            voice: this.props.speechOutputAlways,
          }).then(userMessage => {
            this.props.actions
              .createMessage(userMessage)
              .then(
                apis.getSusiReply(userMessage).then(response => {
                  formatSusiMessage({
                    response,
                    voice: this.props.speechOutputAlways,
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
        this.setState({ text: '', currentArrowIndex: -1 });
        if (this.speechRecog) {
          this.Button = <MicIcon />;
        }
      }
    } else if (event.keyCode === UP_KEY_CODE) {
      event.preventDefault();
      const messages = MessageStore.getAllForCurrentThread().filter(
        message => message.authorName === 'You',
      );
      if (currentArrowIndex + 1 < messages.length) {
        currentArrowIndex++;
        const text = messages[messages.length - 1 - currentArrowIndex].text;
        this.setState({ text, currentArrowIndex });
      }
    } else if (event.keyCode === DOWN_KEY_CODE) {
      event.preventDefault();
      const messages = MessageStore.getAllForCurrentThread().filter(
        message => message.authorName === 'You',
      );
      if (currentArrowIndex - 1 > -1) {
        currentArrowIndex--;
        const text = messages[messages.length - 1 - currentArrowIndex].text;
        this.setState({ text, currentArrowIndex });
      } else {
        this.setState({ text: '', currentArrowIndex: -1 });
      }
    }
  };

  render() {
    const { start, stop, text, open, color, result, animate } = this.state;
    const { textarea, textcolor, focus, micColor } = this.props;
    return (
      <div className="message-composer">
        {start && (
          <VoiceRecognition
            onStart={this.onStart}
            onspeechend={this.onspeechend}
            onResult={this.onResult}
            onEnd={this.onEnd}
            onSpeechStart={this.onSpeechStart}
            continuous={true}
            lang="en-US"
            stop={stop}
          />
        )}

        <div id="snackbar">
          {"Sorry, didn't hear anything."} <br /> {'Please speak again.'}
        </div>

        <div className="textBack" style={{ backgroundColor: textarea }}>
          {/* TextareaAutosize node package used to get
          the auto sizing feature of the chat message composer */}
          <TextareaAutosize
            className="scroll"
            id="scroll"
            minRows={1}
            maxRows={2}
            placeholder="Type a message..."
            value={text}
            onChange={this._onChange}
            onKeyDown={this._onKeyDown}
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
          onTouchTap={this._onClickButton}
          style={styles.buttonStyle}
        >
          {this.Button}
        </IconButton>

        <Modal
          isOpen={open}
          className="Modal"
          contentLabel="Speak Now"
          overlayClassName="Overlay"
        >
          <div className="voice-response">
            <ReactFitText compressor={0.5} minFontSize={12} maxFontSize={26}>
              <h1 style={{ color: color }} className="voice-output">
                {result !== '' ? result : 'Speak Now...'}
              </h1>
            </ReactFitText>
            <div className={animate ? 'mic-container active' : 'mic-container'}>
              <MicIcon style={styles.iconStyles} />
            </div>
            <CloseIcon
              style={styles.closingStyle}
              onTouchTap={this.speakDialogCloseButton}
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

export default connect(
  null,
  mapDispatchToProps,
)(MessageComposer);

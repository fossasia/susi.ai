import * as Actions from '../../actions/';
import React,{Component} from 'react';
import PropTypes from 'prop-types';
import Send from 'material-ui/svg-icons/content/send';
import Mic from 'material-ui/svg-icons/av/mic';
import UserPreferencesStore from '../../stores/UserPreferencesStore';
import IconButton from 'material-ui/IconButton';
import injectTapEventPlugin from 'react-tap-event-plugin';
import VoiceRecognition from './VoiceRecognition';
import Modal from 'react-modal';
import ReactFitText from 'react-fittext';
import Close from 'material-ui/svg-icons/navigation/close';
injectTapEventPlugin();

let ENTER_KEY_CODE = 13;
const style = {
    mini: true,
    top: '10px',
    right:'3px',
    position: 'absolute',
};
const iconStyles = {
  color: '#fff',
  fill: 'currentcolor',
  height: '40px',
  width: '40px',
  marginTop: '20px',
  userSelect: 'none',
  transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
}

const closingStyle ={
      position: 'absolute',
      zIndex: 120000,
      fill: '#444',
      width: '20px',
      height: '20px',
      right: '0px',
      top: '0px',
      cursor:'pointer'
}

class MessageComposer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      text: '',
      start: false,
      stop: false,
      open: false,
      result:'',
      animate: false
    };
    if(props.dream!==''){
      this.state= {text: 'dream '+ props.dream}
    }
  }

  onStart = () => {
    this.setState({ start: true, stop: false, open:true,
      animate:true})
  }

  onEnd = () => {
    this.setState({ start: false, stop: false, open: false,
      animate:false})
  }

  onResult = ({interimTranscript,finalTranscript }) => {
    let result = interimTranscript;
    let voiceResponse = false;
    this.setState({result:result, color: '#ccc'});
    if(finalTranscript) {
      result = finalTranscript;
      this.setState({
      start: false,
      result:result,
      stop: false,
      open:false,
      animate:false,
      color: '#000'
      });
      if(this.props.speechOutputAlways || this.props.speechOutput){
        voiceResponse = true;
      }
      Actions.createMessage(result, this.props.threadID, voiceResponse);
      setTimeout(()=>this.setState({result: ''}),400);
      this.Button = <Mic />
    }
  }

  componentWillMount(){
    let micInputSetting = UserPreferencesStore.getMicInput();
    if(micInputSetting){
      // Getting the Speech Recognition to test whether possible
      const SpeechRecognition = window.SpeechRecognition
            || window.webkitSpeechRecognition
            || window.mozSpeechRecognition
            || window.msSpeechRecognition
            || window.oSpeechRecognition
      // Setting buttons accordingly
      if (SpeechRecognition != null) {
        this.Button = <Mic />
        this.speechRecog = true;
      }
      else {
        this.Button = <Send />;
        this.speechRecog = false;
      }
    }
    else{
      this.Button = <Send />;
      this.speechRecog = false;
    }
  }

  componentDidUpdate(){
    let micInputSetting = UserPreferencesStore.getMicInput();
    if(micInputSetting){
      // Getting the Speech Recognition to test whether possible
      const SpeechRecognition = window.SpeechRecognition
            || window.webkitSpeechRecognition
            || window.mozSpeechRecognition
            || window.msSpeechRecognition
            || window.oSpeechRecognition
      // Setting buttons accordingly
      if (SpeechRecognition != null) {
        this.Button = <Mic />
        this.speechRecog = true;
      }
      else {
        this.Button = <Send />;
        this.speechRecog = false;
      }
    }
    else{
      this.Button = <Send />;
      this.speechRecog = false;
    }
  }

  componentDidMount(){
    this.nameInput.focus();
  }

  render() {
    return (
      <div className="message-composer" >
        {this.state.start && (
          <VoiceRecognition
            onStart={this.onStart}
            onEnd={this.onEnd}
            onResult={this.onResult}
            continuous={true}
            lang="en-US"
            stop={this.state.stop}
          />
        )}
        <textarea
          name="message"
          value={this.state.text}
          onChange={this._onChange.bind(this)}
          onKeyDown={this._onKeyDown.bind(this)}
          ref={(textarea)=> { this.nameInput = textarea; }}
          placeholder="Type a message..."
          style={{background:this.props.textarea}}
        />
        <IconButton
          className="send_button"
          iconStyle={{fill:UserPreferencesStore.getTheme()==='light'?'#4285f4':'#fff',
          marginTop:'2px'}}
          onTouchTap={this._onClickButton.bind(this)}
          style={style}>
          {this.Button}
        </IconButton>

        <Modal
          isOpen={this.state.open}
          className="Modal"
          contentLabel="Speak Now"
          overlayClassName="Overlay">
          <div className='voice-response'>
          <ReactFitText compressor={0.5} minFontSize={12} maxFontSize={26}>
          <h1 style={{color:this.state.color}} className='voice-output'>
          {this.state.result !=='' ? this.state.result :
          'Speak Now...'}
          </h1>
          </ReactFitText>
          <div className={this.state.animate? 'mic-container active':'mic-container'}>
            <Mic style={iconStyles}/>
          </div>
          <Close style={closingStyle} onTouchTap={this.onEnd} />
          </div>

        </Modal>
        </div>
    );
  }

  _onClickButton(){
    if(this.state.text === ''){
      if(this.speechRecog){
      this.setState({ start: true })
      }
      else {
        this.setState({ start: false })
      }
    }
    else{
      let text = this.state.text.trim();
      if (text) {
      let EnterAsSend = UserPreferencesStore.getEnterAsSend();
      if(!EnterAsSend){
        text = text.split('\n').join(' ');
      }
      Actions.createMessage(text, this.props.threadID, this.props.speechOutputAlways);
    }
    if(this.speechRecog){
      this.Button = <Mic />
    }
    this.setState({text: ''});
    }
   }

  _onChange(event, value) {
    if(this.speechRecog){
      if(event.target.value !== ''){
        this.Button = <Send />
      }
      else{
        this.Button = <Mic />
      }
    }
    else{
      this.Button = <Send />
    }
    this.setState({text: event.target.value});
  }

  _onKeyDown(event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      let EnterAsSend = UserPreferencesStore.getEnterAsSend();
      if(EnterAsSend){
        event.preventDefault();
        let text = this.state.text.trim();
        if (text) {
          Actions.createMessage(text, this.props.threadID, this.props.speechOutputAlways);
        }
        this.setState({text: ''});
        if(this.speechRecog){
          this.Button = <Mic />
        }
      }
    }
  }

};

MessageComposer.propTypes = {
  threadID: PropTypes.string.isRequired,
  dream: PropTypes.string,
  textarea: PropTypes.string,
  speechOutput: PropTypes.bool,
  speechOutputAlways: PropTypes.bool,
};

export default MessageComposer;

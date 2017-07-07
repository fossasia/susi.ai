import * as Actions from '../../actions/';
import React,{Component} from 'react';
import PropTypes from 'prop-types';
import Send from 'material-ui/svg-icons/content/send';
import Mic from 'material-ui/svg-icons/av/mic';
import UserPreferencesStore from '../../stores/UserPreferencesStore';
import IconButton from 'material-ui/IconButton';
import injectTapEventPlugin from 'react-tap-event-plugin';
import VoiceRecognition from './VoiceRecognition';
import ReactLoading from 'react-loading';
injectTapEventPlugin();

let ENTER_KEY_CODE = 13;
const style = {
    mini: true,
    top: '4px',
    right:'3px',
    position: 'absolute',
};
const loadingStyle = {
    width: '50px',
    fill: '#607d8b',
    marginTop: '10px'
}
let Button, speechRecog;
// Getting the Speech Recognition to test whether possible
const SpeechRecognition = window.SpeechRecognition
      || window.webkitSpeechRecognition
      || window.mozSpeechRecognition
      || window.msSpeechRecognition
      || window.oSpeechRecognition
// Setting buttons accordingly
if (SpeechRecognition != null) {
  Button = <Mic />
  speechRecog = true;
}
else {
  Button = <Send />;
  speechRecog = false;
}
class MessageComposer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      text: '',
      start: false,
      stop: false,
      loading: false
    };
    if(props.dream!==''){
      this.state= {text: 'dream '+ props.dream}
    }
  }

  onStart = () => {
    this.setState({ start: true, stop: false, loading: true})
  }

  onEnd = () => {
    this.setState({ start: false, stop: false, loading: false})
  }
  onError = () => {
    speechRecog = false;
  }
  onResult = ({ finalTranscript }) => {
    const result = finalTranscript
    console.log(result);

    this.setState({ start: false, stop: false, loading: false})
    Actions.createMessage(result, this.props.threadID);
    Button = <Mic />

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
        {this.state.loading ?
        <div style={style}>
        <ReactLoading style={loadingStyle} type='bubbles' color='#607d8b' />
        </div>
        : <IconButton
          iconStyle={{fill:UserPreferencesStore.getTheme()==='light'?'#607D8B':'#fff',
          marginTop:'6px'}}
          onTouchTap={this._onClickButton.bind(this)}
          style={style}>
          {Button}
        </IconButton>}
      </div>
    );
  }

  _onClickButton(){
    if(this.state.text === ''){
      if(speechRecog){
      this.setState({ start: true, loading: true})
      }
      else {
        this.setState({ start: false, loading: false})
      }
    }
    else{
      let text = this.state.text.trim();
      if (text) {
      let EnterAsSend = UserPreferencesStore.getEnterAsSend();
      if(!EnterAsSend){
        text = text.split('\n').join(' ');
      }
      Actions.createMessage(text, this.props.threadID);
    }
    if(speechRecog){
      Button = <Mic />
    }
    this.setState({text: ''});
    }
   }

  _onChange(event, value) {
    if(speechRecog){
    if(event.target.value !== ''){
      Button = <Send />
    }
    else{
      Button = <Mic />
    }
    }
    else{
      Button = <Send />
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
          Actions.createMessage(text, this.props.threadID);
        }
        this.setState({text: ''});
        if(speechRecog){
          Button = <Mic />
        }
      }
    }
  }

};

MessageComposer.propTypes = {
  threadID: PropTypes.string.isRequired,
  dream: PropTypes.string,
  textarea: PropTypes.string
};

export default MessageComposer;

import * as Actions from '../../actions/';
import React,{Component} from 'react';
import PropTypes from 'prop-types';
import Send from 'material-ui/svg-icons/content/send';
import Mic from 'material-ui/svg-icons/av/mic';
import UserPreferencesStore from '../../stores/UserPreferencesStore';
import IconButton from 'material-ui/IconButton';
import injectTapEventPlugin from 'react-tap-event-plugin';
import VoiceRecognition from './VoiceRecognition';
import Dialog from 'material-ui/Dialog';
injectTapEventPlugin();

let ENTER_KEY_CODE = 13;
const style = {
    mini: true,
    top: '4px',
    right:'3px',
    position: 'absolute',
};
const customContentStyle = {
  width: '100%',
  maxWidth: 'none',
  textAlign : 'center',
  background: '#fff',
};
const iconStyles = {
  display: 'inline-block',
  color: '#ccc',
  fill: 'currentcolor',
  height: '70px',
  width: '70px',
  userSelect: 'none',
  transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
  marginTop: '36px'
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
      open: false,
      result:''
    };
    if(props.dream!==''){
      this.state= {text: 'dream '+ props.dream}
    }
  }

  onStart = () => {
    this.setState({ start: true, stop: false, open:true})
  }

  onEnd = () => {
    this.setState({ start: false, stop: false, open: false})
  }
  onResult = ({finalTranscript }) => {
    let result = finalTranscript;
    this.setState({ result:result});
    setTimeout(()=>this.setState({ start: false, stop: false, open:false}),400);
    Actions.createMessage(result, this.props.threadID);
    setTimeout(()=>this.setState({result: ''}), 500);
    Button = <Mic />
  }

  componentDidMount(){
    this.nameInput.focus();
  }

  render() {
    return (
      <div>
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
          iconStyle={{fill:UserPreferencesStore.getTheme()==='light'?'#607D8B':'#fff',
          marginTop:'6px'}}
          onTouchTap={this._onClickButton.bind(this)}
          style={style}>
          {Button}
        </IconButton>
      </div>
        <Dialog
          modal={true}
          open={this.state.open}
          contentStyle={customContentStyle}
        >
          <div className='mic-container'>
          <Mic style={iconStyles}/>
          </div>
          <h1 className='voice-output'>
          {this.state.result !=='' ? this.state.result :
          'Speak Now...'}
          </h1>
        </Dialog>
        </div>
    );
  }

  _onClickButton(){
    if(this.state.text === ''){
      if(speechRecog){
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

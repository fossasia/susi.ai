import * as Actions from '../../actions/';
import React,{Component} from 'react';
import PropTypes from 'prop-types';
import SpeechRecognition from 'react-speech-recognition';
import Send from 'material-ui/svg-icons/content/send';
import Mic from 'material-ui/svg-icons/av/mic';
import UserPreferencesStore from '../../stores/UserPreferencesStore';
import IconButton from 'material-ui/IconButton';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

let ENTER_KEY_CODE = 13;
let Button = <Mic />
const style = {
    mini: true,
    top: '4px',
    right:'3px',
    position: 'absolute',
};

class MessageComposer extends Component {

  constructor(props) {
    super(props);
    this.state = {text: '',speech: false};

    if(props.dream!==''){
      this.state= {text: 'dream '+ props.dream}
    }
  }
  componentDidMount(){
    this.nameInput.focus();
  }


  render() {

    const {
      transcript,
      resetTranscript,
      browserSupportsSpeechRecognition,
      recognition } = this.props

    if (!browserSupportsSpeechRecognition) {
      return null
    }

    if(this.state.speech) {
      return(
        <div className="message-composer" >
            <textarea readOnly
              value={transcript}
              placeholder="Say a message and hit Send button" />
              <IconButton
                iconStyle={{fill:UserPreferencesStore.getTheme()==='light'?'#607D8B':'#fff',
                marginTop:'6px'}}
                onTouchTap={()=>{
                    this.handleToUpdate(transcript);
                    resetTranscript();
                    recognition.abort();
                  }}
                style={style}>
                <Send />
              </IconButton>
        </div>);
    }
    return (
      <div className="message-composer" >
        <textarea
          autoFocus="true"
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
    );
  }

  handleToUpdate(someArg){
    let text = someArg.trim();
    if (text) {
      Actions.createMessage(text, this.props.threadID);
    }
    Button = <Mic />
    this.setState({speech:false});
    }

  _onClickButton(){
    if(this.state.text==='') {
      this.setState({speech: true});
      Button = <Send />
    }
    else {
      let text = this.state.text.trim();
      if (text) {
        Actions.createMessage(text, this.props.threadID);
      }
    this.setState({text: '',speech: false});
    Button = <Mic />
    }
  }

  _onChange(event, value) {
    this.setState({text: event.target.value});
    Button = <Send />
  }

  _onKeyDown(event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      event.preventDefault();
      let text = this.state.text.trim();
      if (text) {
        Actions.createMessage(text, this.props.threadID);
      }
      this.setState({text: '',speech: false});
      Button = <Mic />
    }
  }
};

MessageComposer.propTypes = {
  threadID: PropTypes.string.isRequired,
  dream: PropTypes.string,
  textarea: PropTypes.string,
  // Props injected by SpeechRecognition
  recognition: PropTypes.object,
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  browserSupportsSpeechRecognition: PropTypes.bool,
};

export default SpeechRecognition(MessageComposer);

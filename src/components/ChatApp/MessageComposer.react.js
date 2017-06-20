import * as Actions from '../../actions/';
import React,{Component} from 'react';
import PropTypes from 'prop-types';
import Send from 'material-ui/svg-icons/content/send';
import UserPreferencesStore from '../../stores/UserPreferencesStore';
import IconButton from 'material-ui/IconButton';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

let ENTER_KEY_CODE = 13;

const style = {
    mini: true,
    top: '4px',
    right:'3px',
    position: 'absolute',
};

class MessageComposer extends Component {

  constructor(props) {
    super(props);
    this.state = {text: ''};
    if(props.dream!==''){
      this.state= {text: 'dream '+ props.dream}
    }
  }
  componentDidMount(){
    this.nameInput.focus();
  }
  render() {
    return (
      <div className="message-composer" >
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
          <Send />
        </IconButton>
      </div>
    );
  }

  _onClickButton(){
    let text = this.state.text.trim();
    if (text) {
      Actions.createMessage(text, this.props.threadID);
    }
    this.setState({text: ''});
  }

  _onChange(event, value) {
    this.setState({text: event.target.value});
  }

  _onKeyDown(event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      event.preventDefault();
      let text = this.state.text.trim();
      if (text) {
        Actions.createMessage(text, this.props.threadID);
      }
      this.setState({text: ''});
    }
  }


};

MessageComposer.propTypes = {
  threadID: PropTypes.string.isRequired,
  dream: PropTypes.string,
  textarea: PropTypes.string
};

export default MessageComposer;

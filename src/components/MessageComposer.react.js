
import * as Actions from '../actions';
import React,{Component} from 'react';
import { PropTypes } from 'prop-types';
import Send from 'material-ui/svg-icons/content/send';
import SettingStore from '../stores/SettingStore';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

let ENTER_KEY_CODE = 13;

const style = {
    mini: true,
    top: '1px',
    right: '5px',
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
      <div className="message-composer">
        <textarea
          name="message"
          value={this.state.text}
          onChange={this._onChange.bind(this)}
          onKeyDown={this._onKeyDown.bind(this)}
          ref={(textarea)=> { this.nameInput = textarea; }}
          placeholder="Type a message..."
        />
        <FloatingActionButton
          backgroundColor={SettingStore.getTheme()?'#607D8B':'#19314B'}
          onTouchTap={this._onClickButton.bind(this)}
          style={style}>
          <Send />
        </FloatingActionButton>
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
  dream: PropTypes.string
};

export default MessageComposer;

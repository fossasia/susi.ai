
import * as Actions from '../actions';
import React,{Component} from 'react';
import { PropTypes } from 'prop-types';

let ENTER_KEY_CODE = 13;

class MessageComposer extends Component {

  constructor(props) {
    super(props);
    this.state = {text: ''};
  }
  componentDidMount(){
    this.nameInput.focus();
  }
  render() {
    return (
      <textarea
        className="message-composer"
        name="message"
        value={this.state.text}
        onChange={this._onChange.bind(this)}
        onKeyDown={this._onKeyDown.bind(this)}
        ref={(textarea)=> { this.nameInput = textarea; }}
        placeholder="Type a message..."
      />
    );
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
  threadID: PropTypes.string.isRequired
};

export default MessageComposer;

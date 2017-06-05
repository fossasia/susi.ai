import React,{Component} from 'react';
import { PropTypes } from 'prop-types';
import MessageListItem from './MessageListItem.react';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import ExitIcon from 'material-ui/svg-icons/action/exit-to-app';
import UpIcon from 'material-ui/svg-icons/navigation/arrow-upward';
import DownIcon from 'material-ui/svg-icons/navigation/arrow-downward';
import * as Actions from '../actions';
import $ from 'jquery';

function getMessageListItem(msgRefs,messages,markID) {
  return messages.map((message)=>{
    return (
      <MessageListItem
        key={message.id}
        message={message}
        markID={markID}
        ref={(ref)=>{ msgRefs[message.id] = ref;}}
      />
    );
  });
}

function searchMsgs(messages,matchString){
  let markingData = {
    allmsgs : [],
    markedIDs  :[]
  };
  messages.forEach((msg,id)=>{
    let orgMsgText = msg.text;
    let msgCopy = $.extend(true, {}, msg);
    if(orgMsgText){
      let msgText = orgMsgText.toLowerCase();
      let match = msgText.indexOf(matchString);
      if(match !== -1){
        msgCopy.mark = matchString;
        markingData.markedIDs.unshift(msgCopy.id);
      }
    }
    markingData.allmsgs.push(msgCopy);
  });
  return markingData;
}

class SearchSection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      markedMsgs: this.props.messages,
      markedIDs: [],
      scrollLimit: 0,
      scrollIndex: -1,
      scrollID: null
    };
    this.msgRefs = {};
  }

  componentDidMount() {
    this._scrollToBottom();
  }

  componentWillMount() {
    if (this.props.theme) {
      document.body.className = 'white-body';
    }
    else {
      document.body.className = 'dark-body';
    }
  }

  render() {
    let markID = this.state.scrollID;
    let markedMessages = this.state.markedMsgs;
    let messageListItems = getMessageListItem(this.msgRefs,
                                  markedMessages,markID,this.state,this.node);
    let topBackground = this.props.theme ? '' : 'dark';
    return (
      <div className={topBackground}>
        <header className="message-thread-heading">
          <nav>
          	<IconButton tooltip="SVG Icon" iconStyle={{fill: 'white'}}
              onTouchTap={this._onClickPrev.bind(this)}>
              <UpIcon />
            </IconButton>
            <IconButton tooltip="SVG Icon" iconStyle={{fill: 'white'}}
              onTouchTap={this._onClickRecent.bind(this)}>
              <DownIcon />
            </IconButton>
            <TextField hintText="Search..." inputStyle={{color:'white'}}
            hintStyle={{color:'white'}}
            onChange={e => this._searchMsg(e)} />
            <IconButton tooltip="SVG Icon" iconStyle={{fill: 'white'}}
              onTouchTap={this._onClickExit.bind(this)}>
              <ExitIcon />
            </IconButton>
          </nav>
        </header>
        <div className="message-pane">
          <div className="message-section">
            <ul
              className="message-list"
              ref={(c) => { this.messageList = c; }}>
              {messageListItems}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  componentDidUpdate() {
    if(this.state.scrollIndex === -1){
      this._scrollToBottom();
    }
    else{
      // let markedIDs = this.state.markedIDs;
      // let limit = this.state.scrollLimit;
      // let ul = this.messageList;
      // if(markedIDs && ul && limit > 0){
      //   let id = markedIDs[this.state.scrollIndex];
      //   let match = this.msgRefs[id];
      //   const domNode = ReactDOM.findDOMNode(match);
      //   domNode.scrollIntoView();
      // }
    }
  }

  _onClickPrev(){
    let newIndex = this.state.scrollIndex + 1;
    let indexLimit = this.state.scrollLimit;
    let markedIDs = this.state.markedIDs;
    let ul = this.messageList;
    if(markedIDs && ul && newIndex < indexLimit){
      let currState = this.state;
      currState.scrollIndex = newIndex;
      currState.scrollID = markedIDs[newIndex];
      this.setState(currState);
    }
  }

  _onClickRecent(){
    let newIndex = this.state.scrollIndex - 1;
    let markedIDs = this.state.markedIDs;
    let ul = this.messageList;
    if(markedIDs && ul && newIndex >= 0 ){
      let currState = this.state;
      currState.scrollIndex = newIndex;
      currState.scrollID = markedIDs[newIndex];
      this.setState(currState);
    }
  }

  _scrollToBottom() {
    let ul = this.messageList;
    if (ul) {
      ul.scrollTop = ul.scrollHeight;
    }
  }

  _onClickExit(){
    Actions.ToggleSearch(!this.state.search);
  }

  _searchMsg(e) {
    let matchString = e.target.value.trim();
    matchString = matchString.toLowerCase();
    let messages = this.props.messages;
    let markingData = searchMsgs(messages,matchString);
    if(matchString){
      this.setState({
        markedMsgs:markingData.allmsgs,
        markedIDs:markingData.markedIDs,
        scrollLimit: markingData.markedIDs.length,
        scrollIndex: 0,
        scrollID: markingData.markedIDs[0]
      });
    }
    else{
      this.setState({
        markedMsgs:markingData.allmsgs,
        markedIDs:markingData.markedIDs,
        scrollLimit: markingData.markedIDs.length,
        scrollIndex: -1,
        scrollID: null
      });
    }
  }
};

SearchSection.propTypes = {
  messages: PropTypes.array,
  theme: PropTypes.bool
};

export default SearchSection;

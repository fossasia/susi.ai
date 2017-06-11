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
import AppBar from 'material-ui/AppBar';
import ScrollArea from 'react-scrollbar';

function getMessageListItem(messages,markID) {
  return messages.map((message)=>{
    return (
      <MessageListItem
        key={message.id}
        message={message}
        markID={markID}
      />
    );
  });
}

function searchMsgs(messages,matchString){
  let markingData = {
    allmsgs : [],
    markedIDs  :[],
    markedIndices :[],
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
        markingData.markedIndices.unshift(id);
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
      markedIndices: [],
      scrollLimit: 0,
      scrollIndex: -1,
      scrollID: null
    };
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
    let messageListItems = getMessageListItem(
                                  markedMessages,markID);
    let topBackground = this.props.theme ? '' : 'dark';
    var backgroundCol;
    if (topBackground === 'dark') {
      backgroundCol = '#19324c';
    }
    else {
      backgroundCol = '#607d8b';

    }

    const searchField = (
      <TextField hintText="Search..." inputStyle={{color:'white'}}
      hintStyle={{color:'white'}}
      onChange={e => this._searchMsg(e)}
     />
    );
    const searchButton = (
    <IconButton tooltip="Back" iconStyle={{fill: 'white'}}
      onTouchTap={this._onClickExit.bind(this)}>
      <ExitIcon />
    </IconButton>
    );
    const scrollSearchButtons = (
      <div>
        <IconButton tooltip="Previous" iconStyle={{fill: 'white'}}
          onTouchTap={this._onClickPrev.bind(this)}>
          <UpIcon />
        </IconButton>
        <IconButton tooltip="Next" iconStyle={{fill: 'white'}}
          onTouchTap={this._onClickRecent.bind(this)}>
          <DownIcon />
        </IconButton>
      </div>
    );
    return (
      <div className={topBackground}>
        <header className="message-thread-heading">
          <AppBar
            title={searchField}
            iconElementLeft={scrollSearchButtons}
            iconElementRight={searchButton}
            style={{ background: backgroundCol }}
            className="app-bar"
          />
        </header>
        <div className="message-pane">
          <div className="message-section">
            <ul
              className="message-list"
              ref={(c) => { this.messageList = c; }}>
              <ScrollArea
                ref={(ref) => { this.scrollarea = ref; }}>
              {messageListItems}
            </ScrollArea>
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
      let markedIDs = this.state.markedIDs;
      let markedIndices = this.state.markedIndices;
      let limit = this.state.scrollLimit;
      let ul = this.messageList;
      if(markedIDs && ul && limit > 0){
        let currentID = markedIndices[this.state.scrollIndex];
        this.scrollarea.content.childNodes[currentID].scrollIntoView();
      }
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
        markedIndices:markingData.markedIndices,
        scrollLimit: markingData.markedIDs.length,
        scrollIndex: 0,
        scrollID: markingData.markedIDs[0]
      });
    }
    else{
      this.setState({
        markedMsgs:markingData.allmsgs,
        markedIDs:markingData.markedIDs,
        markedIndices:markingData.markedIndices,
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

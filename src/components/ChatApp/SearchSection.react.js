import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MessageListItem from './MessageListItem.react';
import TextField from 'material-ui/TextField';
import ExitIcon from 'material-ui/svg-icons/action/exit-to-app';
import UpIcon from 'material-ui/svg-icons/navigation/arrow-upward';
import DownIcon from 'material-ui/svg-icons/navigation/arrow-downward';
import * as Actions from '../../actions/';
import $ from 'jquery';
import AppBar from 'material-ui/AppBar';
import ScrollArea from 'react-scrollbar';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconButton from 'material-ui/IconButton';
import Popover from 'material-ui/Popover';
import Toggle from 'material-ui/Toggle';
import UserPreferencesStore from '../../stores/UserPreferencesStore';

function getMessageListItem(messages, markID) {
  return messages.map((message) => {
    return (
      <MessageListItem
        key={message.id}
        message={message}
        markID={markID}
      />
    );
  });
}

function searchMsgs(messages, matchString, isCaseSensitive) {
  let markingData = {
    allmsgs: [],
    markedIDs: [],
    markedIndices: [],
  };
  messages.forEach((msg, id) => {
    let orgMsgText = msg.text;
    let msgCopy = $.extend(true, {}, msg);
    let msgText = orgMsgText;
    if (orgMsgText) {
      if (!isCaseSensitive) {
        matchString = matchString.toLowerCase();
        msgText = msgText.toLowerCase();
      }
      let match = msgText.indexOf(matchString);
      if (match !== -1) {
        msgCopy.mark = {
          matchText: matchString,
          isCaseSensitive: isCaseSensitive
        };
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
      scrollID: null,
      caseSensitive: false,
      open: false,
      searchText:'',
      currTheme: UserPreferencesStore.getTheme(),
    };
    this.handleOptions = this.handleOptions.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount() {
    this._scrollToBottom();
  }

  componentWillMount() {
    switch(this.state.currTheme){
      case 'light':{
        document.body.className = 'white-body';
        break;
      }
      case 'dark':{
        document.body.className = 'dark-body';
        break;
      }
      default: {
          // do nothing
      }
    }
  }

  render() {

    const toggleStyles = {
      toggle: {
        margin: '2px',
        width: '160px',
        height: '30px'
      }
    };

    let markID = this.state.scrollID;
    let markedMessages = this.state.markedMsgs;
    let messageListItems = getMessageListItem(
                                  markedMessages,markID);
    let topBackground = this.state.currTheme;
    var backgroundCol;
    switch(topBackground){
      case 'light':{
        backgroundCol = '#607d8b';
        break;
      }
      case 'dark':{
        backgroundCol =  '#19324c';
        break;
      }
      default: {
          // do nothing
      }
    }

    const searchField = (
      <div style={{ lineHeight: '46px' }}>
        <TextField
          className="search"
          hintText="Search..."
          inputStyle={{ color: 'white' }}
          hintStyle={{ color: 'white' }}
          onChange={e => this._searchMsg(e)}
          value={this.state.searchText}
          style={{ marginTop: '-4px' }}
        />
      </div>
    );

    const Options = (
      <div style={{ marginTop: '-8px' }}>
        <IconButton
          tooltip="Back"
          iconStyle={{ fill: 'white' }}
          onTouchTap={this._onClickExit.bind(this)}>
          <ExitIcon />
        </IconButton>
        <IconButton
          tooltip="Options"
          iconStyle={{ fill: 'white' }}
          onTouchTap={this.handleOptions}>
          <MoreVertIcon />
        </IconButton>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={this.handleRequestClose}
        >
          <Toggle
            label="Case Sensitive"
            style={toggleStyles.toggle}
            labelPosition="right"
            onToggle={this.handleToggle}
            toggled={this.state.caseSensitive}
          />
        </Popover>
      </div>
    );

    const scrollSearchButtons = (
      <div style={{ marginTop: '-8px' }}>
        <IconButton
          tooltip="Previous"
          iconStyle={{ fill: 'white' }}
          onTouchTap={this._onClickPrev.bind(this)}>
          <UpIcon />
        </IconButton>
        <IconButton
          tooltip="Recent"
          iconStyle={{ fill: 'white' }}
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
            iconElementRight={Options}
            style={{ background: backgroundCol, height: '46px' }}
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
    if (this.state.scrollIndex === -1
      || this.state.scrollIndex === null) {
      this._scrollToBottom();
    }
    else {
      let markedIDs = this.state.markedIDs;
      let markedIndices = this.state.markedIndices;
      let limit = this.state.scrollLimit;
      let ul = this.messageList;
      if (markedIDs && ul && limit > 0) {
        let currentID = markedIndices[this.state.scrollIndex];
        this.scrollarea.content.childNodes[currentID].scrollIntoView();
      }
    }
  }

  _onClickPrev() {
    let newIndex = this.state.scrollIndex + 1;
    let indexLimit = this.state.scrollLimit;
    let markedIDs = this.state.markedIDs;
    let ul = this.messageList;
    if (markedIDs && ul && newIndex < indexLimit) {
      let currState = this.state;
      currState.scrollIndex = newIndex;
      currState.scrollID = markedIDs[newIndex];
      this.setState(currState);
    }
  }

  handleOptions(event) {
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }

  handleToggle(event, isInputChecked) {
    this.setState({
      markedMsgs: this.props.messages,
      markedIDs: [],
      markedIndices: [],
      scrollLimit: 0,
      scrollIndex: -1,
      scrollID: null,
      caseSensitive: isInputChecked,
      open: true,
      searchText: ''
    });
  }

  handleRequestClose() {
    this.setState({
      open: false,
    });
  };

  _onClickRecent() {
    let newIndex = this.state.scrollIndex - 1;
    let markedIDs = this.state.markedIDs;
    let ul = this.messageList;
    if (markedIDs && ul && newIndex >= 0) {
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

  _onClickExit() {
    Actions.ToggleSearch(!this.state.search);
  }

  _searchMsg(e) {
    let matchString = e.target.value;
    let messages = this.props.messages;
    let markingData = searchMsgs(messages, matchString, this.state.caseSensitive);
    if (matchString) {
      this.setState({
        markedMsgs: markingData.allmsgs,
        markedIDs: markingData.markedIDs,
        markedIndices: markingData.markedIndices,
        scrollLimit: markingData.markedIDs.length,
        scrollIndex: 0,
        scrollID: markingData.markedIDs[0],
        caseSensitive: this.state.caseSensitive,
        open: false,
        searchText: matchString
      });
    }
    else {
      this.setState({
        markedMsgs: markingData.allmsgs,
        markedIDs: markingData.markedIDs,
        markedIndices: markingData.markedIndices,
        scrollLimit: markingData.markedIDs.length,
        scrollIndex: -1,
        scrollID: null,
        caseSensitive: this.state.caseSensitive,
        open: false,
        searchText: ''
      });
    }
  }
};

SearchSection.propTypes = {
  messages: PropTypes.array,
};

export default SearchSection;

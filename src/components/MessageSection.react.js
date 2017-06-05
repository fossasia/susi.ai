import MessageComposer from './MessageComposer.react';
import MessageListItem from './MessageListItem.react';
import SearchSection from './SearchSection.react';
import MessageStore from '../stores/MessageStore';
import HistoryStore from '../stores/HistoryStore';
import React, { Component } from 'react';
import ThreadStore from '../stores/ThreadStore';
import * as Actions from '../actions';
import SettingStore from '../stores/SettingStore';
import SearchIcon from 'material-ui/svg-icons/action/search';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

function getStateFromStores() {
  return {
    messages: MessageStore.getAllForCurrentThread(),
    thread: ThreadStore.getCurrent(),
    darkTheme: SettingStore.getTheme(),
    search: SettingStore.getSearchMode(),
    history: HistoryStore.getAllForCurrentThread(),
    showHistory: SettingStore.getHistoryMode()
  };
}

function getMessageListItem(message) {
  return (
    <MessageListItem
      key={message.id}
      message={message}
    />
  );
}

function getAllWithHistory(messages,history){
  let allmsgs = history.concat(messages);
  allmsgs.sort((a, b) => {
    if (a.date < b.date) {
      return -1;
    } else if (a.date > b.date) {
      return 1;
    }
    return 0;
  });
  return allmsgs;
}

export default class MessageSection extends Component {

  constructor(props) {
    super(props);
    this.state = getStateFromStores();
  }

  componentDidMount() {
    this._scrollToBottom();
    MessageStore.addChangeListener(this._onChange.bind(this));
    ThreadStore.addChangeListener(this._onChange.bind(this));
    SettingStore.addChangeListener(this._onChange.bind(this));
  }

  componentWillUnmount() {
    MessageStore.removeChangeListener(this._onChange.bind(this));
    ThreadStore.removeChangeListener(this._onChange.bind(this));
    SettingStore.removeChangeListener(this._onChange.bind(this));
  }

  themeChanger(event) {
    Actions.themeChanged(!this.state.darkTheme);
  }

  toggleHistory(){
    Actions.ToggleHistory();
  }

  componentWillMount() {
    SettingStore.on('change', () => {
      this.setState({
        darkTheme: SettingStore.getTheme()
      })
      if (!this.state.darkTheme) {
        document.body.className = 'white-body';
      }
      else {
        document.body.className = 'dark-body';
      }
    })
  }
  render() {
    let topBackground = this.state.darkTheme ? '' : 'dark';
    var backgroundCol;
    if (topBackground === 'dark') {
      backgroundCol = '#19324c';
    }
    else {
      backgroundCol = '#607d8b';

    }
    let allMsgs = this.state.messages;
    let toggleHistoryOption = 'Show History';
    if(this.state.showHistory){
      allMsgs = getAllWithHistory(this.state.messages,this.state.history);
      toggleHistoryOption = 'Hide History';
    }
    let messageListItems = allMsgs.map(getMessageListItem);
    if (this.state.thread) {
      if(!this.state.search){
        const Logged = (props) => (
            <IconMenu
              {...props}
              iconButtonElement={
                <IconButton iconStyle={{fill: 'white'}}>
                  <MoreVertIcon />
                </IconButton>
              }
              targetOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
              <MenuItem primaryText='Change Theme'
                        onClick={() => { change() }} />
              <MenuItem primaryText={toggleHistoryOption}
                       onClick={() => { ToggleHistory() }} />
            </IconMenu>
          );

        Logged.muiName = 'IconMenu';

        const rightButtons = (
          <div>
            <IconButton tooltip='SVG Icon' iconStyle={{fill: 'white'}}
              onTouchTap={this._onClickSearch.bind(this)}>
              <SearchIcon />
            </IconButton>
            <Logged />
          </div>);
        return (
          <div className={topBackground}>
            <header className='message-thread-heading' >
              <AppBar
                title={this.state.thread.name}
                iconElementLeft={<IconButton></IconButton>}
                iconElementRight={rightButtons}
                style={{ background: backgroundCol }}
                className="app-bar"
              />
            </header>

            <div className='message-pane'>
              <div className='message-section'>
                <ul
                  className='message-list'
                  ref={(c) => { this.messageList = c; }}>
                  {messageListItems}
                </ul>
                <div className='compose'>
                  <MessageComposer
                    threadID={this.state.thread.id}
                    theme={this.state.darkTheme} />
                </div>
              </div>
            </div>
          </div>
        );
      }
      if(this.state.search){
        return (
          <SearchSection messages={this.state.messages}
            theme={this.state.darkTheme}
          />
        );
      }
    }

    return <div className='message-section'></div>;
  }

  componentDidUpdate() {
    if (this.state.darkTheme) {
      document.body.className = 'white-body';
    }
    else {
      document.body.className = 'dark-body';
    }
    this._scrollToBottom();
  }

  _scrollToBottom() {
    let ul = this.messageList;
    if (ul) {
      ul.scrollTop = ul.scrollHeight;
    }
  }

  _onClickSearch(){
    Actions.ToggleSearch();
  }

  /**
   * Event handler for 'change' events coming from the MessageStore
   */
  _onChange() {
    this.setState(getStateFromStores());
  }

};

function change() {
  let messageSection = new MessageSection();
  messageSection.themeChanger();
}

function ToggleHistory(){
  let messageSection = new MessageSection();
  messageSection.toggleHistory();
}

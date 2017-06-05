import MessageComposer from './MessageComposer.react';
import MessageListItem from './MessageListItem.react';
import SearchSection from './SearchSection.react';
import MessageStore from '../stores/MessageStore';
import React, { Component } from 'react';
import ThreadStore from '../stores/ThreadStore';
import * as Actions from '../actions';
import SettingStore from '../stores/SettingStore';
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui/svg-icons/action/search';

function getStateFromStores() {
  return {
    messages: MessageStore.getAllForCurrentThread(),
    thread: ThreadStore.getCurrent(),
    darkTheme: SettingStore.getTheme(),
    search: SettingStore.getSearchMode()
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

    let messageListItems = this.state.messages.map(getMessageListItem);
    if (this.state.thread) {
      if(!this.state.search){
        return (
          <div className={topBackground}>
            <header className='message-thread-heading' >
              <nav>
                <h1>{this.state.thread.name}</h1>
                <IconButton tooltip="SVG Icon" iconStyle={{fill: 'white'}}
                  onTouchTap={this._onClickSearch.bind(this)}>
                  <SearchIcon />
                </IconButton>
                <div className='theme-button'
                 onClick={this.themeChanger.bind(this)}>
                 Change Theme
                </div>
              </nav>
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
            theme={this.state.darkTheme} />
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


import MessageComposer from './MessageComposer.react';
import MessageListItem from './MessageListItem.react';
import MessageStore from '../stores/MessageStore';
import React, { Component } from 'react';
import ThreadStore from '../stores/ThreadStore';
import * as Actions from '../actions';
import SettingStore from '../stores/SettingStore';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

function getStateFromStores() {
  return {
    messages: MessageStore.getAllForCurrentThread(),
    thread: ThreadStore.getCurrent(),
    darkTheme: SettingStore.getTheme()
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
  }

  componentWillUnmount() {
    MessageStore.removeChangeListener(this._onChange.bind(this));
    ThreadStore.removeChangeListener(this._onChange.bind(this));
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
    var backgroundCol;
    if (topBackground === 'dark') {
      backgroundCol = '#19324c';
    }
    else {
      backgroundCol = '#607d8b';

    }
    let messageListItems = this.state.messages.map(getMessageListItem);
    if (this.state.thread) {
      return (
        <div className={topBackground}>
          <header className='message-thread-heading' >
            <AppBar
              title={this.state.thread.name}
              iconElementLeft={<IconButton></IconButton>}
              iconElementRight={<Logged />}
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

    return <div className='message-section'></div>;
  }

  componentDidUpdate() {
    this._scrollToBottom();
  }

  _scrollToBottom() {
    let ul = this.messageList;
    if (ul) {
      ul.scrollTop = ul.scrollHeight;
    }
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
const Logged = (props) => (
  <IconMenu
    {...props}
    iconButtonElement={
      <IconButton><MoreVertIcon /></IconButton>
    }
    targetOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
  >
    <MenuItem primaryText="Change Theme" onClick={() => { change() }} />

  </IconMenu>
);

Logged.muiName = 'IconMenu';

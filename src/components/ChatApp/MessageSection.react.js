import MessageComposer from './MessageComposer.react';
import MessageListItem from './MessageListItem.react';
import SearchSection from './SearchSection.react';
import Settings from './Settings.react';
import MessageStore from '../../stores/MessageStore';
import React, { Component } from 'react';
import ThreadStore from '../../stores/ThreadStore';
import * as Actions from '../../actions';
import SettingStore from '../../stores/SettingStore';
import SearchIcon from 'material-ui/svg-icons/action/search';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import ArrowDropLeft from 'material-ui/svg-icons/navigation/arrow-back';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';
import loadingGIF from '../images/loading.gif';
import Cookies from 'universal-cookie';
import Login from '../Auth/Login/Login.react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

const cookies = new Cookies();

function getStateFromStores() {
  return {
    messages: MessageStore.getAllForCurrentThread(),
    thread: ThreadStore.getCurrent(),
    darkTheme: SettingStore.getTheme(),
    search: SettingStore.getSearchMode(),
    showLoading: MessageStore.getLoadStatus(),
    open: false,
    showSettings: false
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


function getLoadingGIF() {
  let messageContainerClasses = 'message-container SUSI';
  const LoadingComponent = (
    <li className='message-list-item'>
      <section className={messageContainerClasses}>
        <img src={loadingGIF}
          style={{ height: '10px', width: 'auto' }}
          alt='please wait..' />
      </section>
    </li>
  );
  return LoadingComponent;
}

const urlPropsQueryConfig = {
  dream: { type: UrlQueryParamTypes.string }
};

let Logged = (props) => (
  <IconMenu
    {...props}
    iconButtonElement={
      <IconButton iconStyle={{ fill: 'white' }}><MoreVertIcon /></IconButton>
    }
    targetOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
  >
  </IconMenu>
)
class MessageSection extends Component {

  static propTypes = {
    dream: PropTypes.string
  }

  static defaultProps = {
    dream: ''
  }

  state = {
    open: false
  };

  constructor(props) {
    super(props);
    this.state = getStateFromStores();
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({
      open: false,
      showSettings: false
    });
  };

  handleSettings = () => {
    this.setState({showSettings: true});
  }

  componentDidMount() {
    this._scrollToBottom();
    MessageStore.addChangeListener(this._onChange.bind(this));
    ThreadStore.addChangeListener(this._onChange.bind(this));
    SettingStore.addChangeListener(this._onChange.bind(this));
    // Check Logged in
    if (cookies.get('loggedIn')) {
      Logged = (props) => (
        <IconMenu
          {...props}
          iconButtonElement={
            <IconButton iconStyle={{ fill: 'white' }}>
              <MoreVertIcon /></IconButton>
          }
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        >
          <MenuItem primaryText="Settings"
            onClick={this.handleSettings} />
          <MenuItem primaryText="Chat Anonymously"
            containerElement={<Link to="/logout" />} />
          <MenuItem primaryText="Logout"
            containerElement={<Link to="/logout" />} />
            <MenuItem
              primaryText="Change Theme"
              leftIcon={<ArrowDropLeft />}
              menuItems={[
                <MenuItem
                  key="light"
                  primaryText="Light Theme"
                  onClick={() => { changeLight() }} />,
                <MenuItem
                  key="dark"
                  primaryText="Dark Theme"
                  onClick={() => {changeDark() }} />
                ]}
              />
        </IconMenu>)
      return <Logged />
    }
    // If Not Logged In
    Logged = (props) => (
      <IconMenu
        {...props}
        iconButtonElement={
          <IconButton iconStyle={{ fill: 'white' }}>
            <MoreVertIcon /></IconButton>
        }
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuItem primaryText="Login" onTouchTap={this.handleOpen} />
        <MenuItem primaryText="Sign Up"
          containerElement={<Link to="/signup" />} />
        <MenuItem
          primaryText="Change Theme"
          leftIcon={<ArrowDropLeft />}
          menuItems={[
            <MenuItem
              key="light"
              primaryText="Light Theme"
              onClick={() => { changeLight() }} />,
            <MenuItem
              key="dark"
              primaryText="Dark Theme"
              onClick={() => {changeDark() }} />
            ]}
          />
      </IconMenu>)

    return <Logged />
  }

  componentWillUnmount() {
    MessageStore.removeChangeListener(this._onChange.bind(this));
    ThreadStore.removeChangeListener(this._onChange.bind(this));
    SettingStore.removeChangeListener(this._onChange.bind(this));
  }

  themeChangerLight(event) {
    if(!this.state.darkTheme){
      Actions.themeChanged(!this.state.darkTheme);
    }
  }

  themeChangerDark(event) {
    if(this.state.darkTheme){
      Actions.themeChanged(!this.state.darkTheme);
    }
  }

  componentWillMount() {

    if (this.props.location) {
      if (this.props.location.state) {
        if (this.props.location.state.hasOwnProperty('showLogin')) {
          let showLogin = this.props.location.state.showLogin;
          this.setState({ open: showLogin });
        }
      }
    }

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

    const bodyStyle = {
      'padding': 0
    }
    const {
      dream
    } = this.props;

    let topBackground = this.state.darkTheme ? '' : 'dark';
    var backgroundCol;
    if (topBackground === 'dark') {
      backgroundCol = '#19324c';
    }
    else {
      backgroundCol = '#607d8b';

    }
    const actions = <RaisedButton
      label="Cancel"
      backgroundColor={
        SettingStore.getTheme() ? '#607D8B' : '#19314B'}
      labelColor="#fff"
      width='200px'
      keyboardFocused={true}
      onTouchTap={this.handleClose}
    />;

    let messageListItems = this.state.messages.map(getMessageListItem);
    if (this.state.thread) {
      if (!this.state.search) {
        const rightButtons = (
          <div>
            <IconButton tooltip="Search" iconStyle={{ fill: 'white' }}
              onTouchTap={this._onClickSearch.bind(this)}>
              <SearchIcon />
            </IconButton>
            <Logged />
          </div>);
        return (
          <div className={topBackground}>
            <header className='message-thread-heading' >
              <AppBar
                iconElementLeft={<IconButton></IconButton>}
                iconElementRight={rightButtons}
                style={{ backgroundColor: backgroundCol }}
                className="app-bar"
              />
            </header>

            <div className='message-pane'>
              <div className='message-section'>
                <ul
                  className='message-list'
                  ref={(c) => { this.messageList = c; }}>
                  {messageListItems}
                  {this.state.showLoading && getLoadingGIF()}
                </ul>
                <div className='compose'>
                  <MessageComposer
                    threadID={this.state.thread.id}
                    theme={this.state.darkTheme}
                    dream={dream} />
                </div>
              </div>
            </div>
            <Dialog
            className='dialogStyle'
              actions={actions}
              modal={false}
              open={this.state.open}
              autoScrollBodyContent={true}
              bodyStyle={bodyStyle}
              contentStyle={{width: '35%',minWidth: '300px'}}
              onRequestClose={this.handleClose}>
              <Login {...this.props} />
            </Dialog>
            <Dialog
              actions={actions}
              modal={false}
              open={this.state.showSettings}
              autoScrollBodyContent={true}
              bodyStyle={bodyStyle}
              onRequestClose={this.handleClose}>
              <div>
                <Settings {...this.props} />
              </div>
            </Dialog>
          </div>
        );
      }
      if (this.state.search) {
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

  _onClickSearch() {
    Actions.ToggleSearch();
  }

  /**
   * Event handler for 'change' events coming from the MessageStore
   */
  _onChange() {
    this.setState(getStateFromStores());
  }

};
function changeLight() {
  let messageSection = new MessageSection();
  messageSection.themeChangerLight();
}
function changeDark() {
  let messageSection = new MessageSection();
  messageSection.themeChangerDark();
}


Logged.muiName = 'IconMenu';

MessageSection.propTypes = {
  location: PropTypes.object,
};

export default addUrlProps({ urlPropsQueryConfig })(MessageSection);

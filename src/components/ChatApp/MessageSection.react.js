import MessageComposer from './MessageComposer.react';
import MessageListItem from './MessageListItem.react';
import SearchSection from './SearchSection.react';
import Settings from './Settings.react';
import MessageStore from '../../stores/MessageStore';
import React, { Component } from 'react';
import ThreadStore from '../../stores/ThreadStore';
import * as Actions from '../../actions/';
import SettingStore from '../../stores/SettingStore';
import UserPreferencesStore from '../../stores/UserPreferencesStore';
import SearchIcon from 'material-ui/svg-icons/action/search';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
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
import { CirclePicker } from 'react-color';
import HardwareComponent from './HardwareComponent';
const cookies = new Cookies();

function getStateFromStores() {
  return {
    messages: MessageStore.getAllForCurrentThread(),
    thread: ThreadStore.getCurrent(),
    currTheme: UserPreferencesStore.getTheme(),
    search: SettingStore.getSearchMode(),
    showLoading: MessageStore.getLoadStatus(),
    open: false,
    showSettings: false,
    showThemeChanger: false,
    showHardware: false,
    header: UserPreferencesStore.getTheme()==='light' ? '#607D8B' : '#19314B',
    pane: '',
    textarea: '',
    composer:'',
    body:''
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
      <IconButton
      iconStyle={{ fill: 'white' }}><MoreVertIcon /></IconButton>
    }
    targetOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
  >
  </IconMenu>
)


class MessageSection extends Component {

  static propTypes = {
    dream: PropTypes.string
  };

  static defaultProps = {
    dream: ''
  };

  state = {
    open: false
  };

  constructor(props) {
    super(props);
    this.state = getStateFromStores();
  }

  handleColorChange = (name,color) => {
    // Current Changes
  }

  handleChangeComplete = (name, color) => {
     // Send these Settings to Server
     let state = this.state;
     if(name === 'header'){
       state.header = color.hex;
     }
     else if(name === 'body'){
       state.body= color.hex;
       document.body.style.setProperty('background', color.hex);
     }
     else if(name ===  'pane') {
       state.pane = color.hex;
     }
     else if(name === 'composer'){
       state.composer = color.hex;

     }
     else if(name === 'textarea') {
       state.textarea = color.hex;

     }
     this.setState(state);
  }

  handleOpen = () => {
    this.setState({ open: true });
  }

  handleClose = () => {
    this.setState({
      open: false,
      showSettings: false,
      showThemeChanger: false,
      showHardware: false
    });
  }

  handleThemeChanger = () => {
    this.setState({showThemeChanger: true});
  }

  handleSettings = () => {
    this.setState({showSettings: true});
  }

  handleHardware = () => {
    this.setState({showHardware: true});
  }

  changeTheme = (newTheme) => {
    if(this.state.currTheme !== newTheme){
      let headerColor = '';
      switch(newTheme){
        case 'light': {
            headerColor = '#607d8b';
            break;
        }
        case 'dark': {
            headerColor = '#19324c';
            break;
        }
        default: {
            // do nothing
        }
      }
      this.setState({header: headerColor});
      Actions.themeChanged(newTheme);
    }
  }

  implementSettings = (values) => {
    this.setState({showSettings: false});
    this.changeTheme(values.theme);
    // Actions.setDefaultServer(values.server);
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
          <MenuItem primaryText="Custom Theme"
            key="custom"
            onClick={this.handleThemeChanger} />
          <MenuItem primaryText="Connect to SUSI Hardware"
            onClick={this.handleHardware} />
          <MenuItem primaryText="Chat Anonymously"
            containerElement={<Link to="/logout" />} />
          <MenuItem primaryText="Logout"
            containerElement={<Link to="/logout" />} />
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
        <MenuItem primaryText="Settings"
          onClick={this.handleSettings} />
        <MenuItem primaryText="Connect to SUSI Hardware"
          onClick={this.handleHardware} />
        <MenuItem primaryText="Login" onTouchTap={this.handleOpen} />
        <MenuItem primaryText="Sign Up"
          containerElement={<Link to="/signup" />} />
      </IconMenu>)
    return <Logged />
  }

  componentWillUnmount() {
    MessageStore.removeChangeListener(this._onChange.bind(this));
    ThreadStore.removeChangeListener(this._onChange.bind(this));
    SettingStore.removeChangeListener(this._onChange.bind(this));
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

    UserPreferencesStore.on('change', () => {
      this.setState({
        currTheme: UserPreferencesStore.getTheme()
      })
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
    })
  }

  render() {

    const bodyStyle = {
      'padding': 0,
      textAlign: 'center'
    }
    const {
      dream
    } = this.props;

    var backgroundCol;
    let topBackground = this.state.currTheme;
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

    const actions = <RaisedButton
      label="Cancel"
      backgroundColor={
        UserPreferencesStore.getTheme()==='light' ? '#607D8B' : '#19314B'}
      labelColor="#fff"
      width='200px'
      keyboardFocused={true}
      onTouchTap={this.handleClose}
    />;

    const componentsList = [
      {'id':1, 'component':'header', 'name': 'Header'},
      {'id':2, 'component': 'pane', 'name': 'Message Pane'},
      {'id':3, 'component':'body', 'name': 'Body'},
      {'id':4, 'component':'composer', 'name': 'Composer'},
      {'id':5, 'component':'textarea', 'name': 'Textarea'}
    ];

    const components = componentsList.map((component) => {
        return <div key={component.id} className='circleChoose'>
                  <h4>Change color of {component.name}:</h4>
                  <CirclePicker  color={component} width={'100%'}
        onChangeComplete={ this.handleChangeComplete.bind(this,component.component) }
        onChange={this.handleColorChange.bind(this,component.id)}>
        </CirclePicker></div>
    })

    var body = this.state.body;
    var pane = this.state.pane;
    var composer = this.state.composer;

    let messageListItems = this.state.messages.map(getMessageListItem);
    if (this.state.thread) {
      if (!this.state.search) {
        const rightButtons = (
          <div style={{marginTop: '-7px'}}>
            <IconButton tooltip="Search"
            iconStyle={{ fill: 'white' }}
            onTouchTap={this._onClickSearch.bind(this)}>
              <SearchIcon />
            </IconButton>
            <Logged />
          </div>);
        return (
          <div className={topBackground} style={{background:body}}>
            <header className='message-thread-heading'
            style={{ backgroundColor: backgroundCol }}>
              <AppBar
                iconElementLeft={<IconButton></IconButton>}
                iconElementRight={rightButtons}
                className="app-bar"
                style={{ backgroundColor: backgroundCol,
                height: '46px' }}
                titleStyle={{height:'46px'}}
              />
            </header>

            <div className='message-pane'>
              <div className='message-section'>
                <ul
                  className='message-list'
                  ref={(c) => { this.messageList = c; }}
                  style={{background:pane}}>
                  {messageListItems}
                  {this.state.showLoading && getLoadingGIF()}
                </ul>
                <div className='compose' style={{background:composer}}>
                  <MessageComposer
                    threadID={this.state.thread.id}
                    dream={dream}
                    textarea={this.state.textarea} />
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
                <Settings {...this.props}
                  onSettingsSubmit={this.implementSettings} />
              </div>
            </Dialog>
            <Dialog
              actions={actions}
              modal={false}
              open={this.state.showHardware}
              autoScrollBodyContent={true}
              bodyStyle={bodyStyle}
              onRequestClose={this.handleClose}>
              <div>
                <HardwareComponent {...this.props} />
              </div>
            </Dialog>
            <Dialog
              actions={actions}
              modal={false}
              open={this.state.showThemeChanger}
              autoScrollBodyContent={true}
              bodyStyle={bodyStyle}
              contentStyle={{width: '35%',minWidth: '300px'}}
              onRequestClose={this.handleClose}>
              <div className='settingsComponents'>
                {components}
              </div>
            </Dialog>
          </div>
        );
      }
      if (this.state.search) {
        return (
          <SearchSection messages={this.state.messages}
            theme={this.state.currTheme}
          />
        );
      }
    }

    return <div className='message-section'></div>;
  }

  componentDidUpdate() {
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

Logged.muiName = 'IconMenu';

MessageSection.propTypes = {
  location: PropTypes.object,
};

export default addUrlProps({ urlPropsQueryConfig })(MessageSection);

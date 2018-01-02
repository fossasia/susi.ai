import MessageComposer from '../MessageComposer.react';
import Snackbar from 'material-ui/Snackbar';
import MessageListItem from '../MessageListItem/MessageListItem.react';
import MessageStore from '../../../stores/MessageStore';
import React, { Component } from 'react';
import ThreadStore from '../../../stores/ThreadStore';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import PropTypes from 'prop-types';
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';
import loadingGIF from '../../../images/loading.gif';
import DialogSection from './DialogSection';
import RaisedButton from 'material-ui/RaisedButton';
import { CirclePicker } from 'react-color';
import $ from 'jquery';
import { Scrollbars } from 'react-custom-scrollbars';
import TopBar from '../TopBar.react';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import NavigateDown from 'material-ui/svg-icons/navigation/expand-more';
import * as Actions from '../../../actions/';
import Translate from '../../Translate/Translate.react';
import Cookies from 'universal-cookie';


const cookies=new Cookies();

function getStateFromStores() {
  var themeValue=[];
  var backgroundValue = [];
  // get Theme data from server
  if(UserPreferencesStore.getThemeValues()){
    themeValue=UserPreferencesStore.getThemeValues().split(',');
  }

  if(UserPreferencesStore.getBackgroundImage()){
    backgroundValue=UserPreferencesStore.getBackgroundImage().split(',');
  }
  return {
    SnackbarOpen: false,
    SnackbarOpenBackground: false,
    messages: MessageStore.getAllForCurrentThread(),
    thread: ThreadStore.getCurrent(),
		currTheme: UserPreferencesStore.getTheme(),
		tour:true,
    search: false,
    showLoading: MessageStore.getLoadStatus(),
    showLogin: false,
    openForgotPassword:false,
    showSignUp: false,
    showThemeChanger: false,
    showHardwareChangeDialog: false,
    showHardware: false,
    showServerChangeDialog: false,
    header: themeValue.length>5?'#'+themeValue[0]:'#4285f4',
    pane: themeValue.length>5?'#'+themeValue[1]:'#f5f4f6',
    body: themeValue.length>5?'#'+themeValue[2]:'#fff',
    composer: themeValue.length>5?'#'+themeValue[3]:'#f5f4f6',
    textarea:  themeValue.length>5?'#'+themeValue[4]:'#fff',
    button: themeValue.length>5? '#'+themeValue[5]:'#4285f4',
    bodyBackgroundImage : backgroundValue.length>1 ? backgroundValue[0] : '',
    snackopen: false,
    snackMessage: 'It seems you are offline!',
    SnackbarOpenSearchResults:false,
    messageBackgroundImage : backgroundValue.length>1 ? backgroundValue[1] : '',
    showScrollBottom: false,
    searchState: {
      markedMsgs: [],
      markedIDs: [],
      markedIndices: [],
      scrollLimit: 0,
      scrollIndex: -1,
      scrollID: null,
      caseSensitive: false,
      open: false,
      searchText:'',
    }
  };
}

function getMessageListItem(messages, showLoading, markID) {
  // markID indicates search mode on
  if(markID){
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

  // Get message ID waiting for server response
  let latestUserMsgID = null;
  if(showLoading && messages){
    let msgCount = messages.length;
    if(msgCount>0){
      let latestUserMsg = messages[msgCount-1];
      latestUserMsgID = latestUserMsg.id;
    }
  }
  // return the list of messages
  return messages.map((message) => {
    return (
      <MessageListItem
        key={message.id}
        message={message}
        latestUserMsgID={latestUserMsgID}
      />
    );
  });
}

// markdown search results
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

class MessageSection extends Component {
  static propTypes = {
    dream: PropTypes.string
  };

  static defaultProps = {
    dream: ''
  };

  state = {
		showLogin: false
  };

  constructor(props) {
    super(props);
    this.state = getStateFromStores();
    this.customTheme={
      'header':this.state.header.substring(1),
      'pane':this.state.pane.substring(1),
      'body':this.state.body.substring(1),
      'composer':this.state.composer.substring(1),
      'textarea':this.state.textarea.substring(1),
      'button':this.state.button.substring(1)

    };
	}


  handleColorChange = (name,color) => {
    // Current Changes
  }
  // Add Image as a background image
  handleChangeBodyBackgroundImage = (backImage) => {
    this.setState({bodyBackgroundImage:backImage});
  }

  handleChangeMessageBackgroundImage = (backImage) => {
    this.setState({messageBackgroundImage:backImage});
  }

  // get the selected custom colour
  handleChangeComplete = (name, color) => {
    this.setState({currTheme : 'custom'})
    let currSettings = UserPreferencesStore.getPreferences();
    let settingsChanged = {};
    if(currSettings.Theme !=='custom'){
      settingsChanged.theme = 'custom';
      Actions.settingsChanged(settingsChanged);
    }
     // Send these Settings to Server
     let state = this.state;

     if(name === 'header'){
       state.header = color.hex;
       this.customTheme.header=state.header.substring(1);
     }
     else if(name === 'body'){
       state.body= color.hex;
       this.customTheme.body=state.body.substring(1);

     }
     else if(name ===  'pane'){
       state.pane = color.hex;
       this.customTheme.pane=state.pane.substring(1);

     }
     else if(name === 'composer'){
       state.composer = color.hex;
       this.customTheme.composer=state.composer.substring(1);

     }
     else if(name === 'textarea'){
       state.textarea = color.hex;
       this.customTheme.textarea=state.textarea.substring(1);

     }
      else if(name === 'button'){
       state.button = color.hex;
       this.customTheme.button=state.button.substring(1);
      }
     this.setState(state);
       document.body.style.setProperty('background-color', this.state.body);

  }

  // Open Login Dialog
  handleOpen = () => {
    this.setState({
      showLogin: true,
      showSignUp: false,
      openForgotPassword: false
    });
    this.child.closeOptions();
  }

  // Open Sign Up Dialog
  handleSignUp = () => {
    this.setState({
      showSignUp: true,
      showLogin: false
    });
    this.child.closeOptions();
  }


  handleRemoveUrlBody = () => {
    if(!this.state.bodyBackgroundImage){
      this.setState({SnackbarOpenBackground: true});
      setTimeout(() => {
         this.setState({
             SnackbarOpenBackground: false
         });
     }, 2500);
    }
    else{
      this.setState({
        bodyBackgroundImage: ''
      });
    }
  }

  handleRemoveUrlMessage = () => {
    if(!this.state.messageBackgroundImage){
      this.setState({SnackbarOpenBackground: true});
      setTimeout(() => {
         this.setState({
             SnackbarOpenBackground: false
         });
     }, 2500);
    }
    else{
      this.setState({
        messageBackgroundImage:''
      });
    }
  }

  handleRemoveUrlBody = () => {
    if(!this.state.bodyBackgroundImage){
      this.setState({SnackbarOpenBackground: true});
      setTimeout(() => {
         this.setState({
             SnackbarOpenBackground: false
         });
     }, 2500);
    }
    else{
      this.setState({
        bodyBackgroundImage: ''
      });
      this.handleChangeBodyBackgroundImage('');
    }
  }

  handleRemoveUrlMessage = () => {
    if(!this.state.messageBackgroundImage){
      this.setState({SnackbarOpenBackground: true});
      setTimeout(() => {
         this.setState({
             SnackbarOpenBackground: false
         });
     }, 2500);
    }
    else{
      this.setState({
        messageBackgroundImage:''
      });
    }
  }
  // Close all dialog boxes
  handleClose = () => {
    var prevThemeSettings=this.state.prevThemeSettings;
    this.setState({
      showLogin: false,
      showSignUp: false,
      showThemeChanger: false,
			openForgotPassword: false,
    });

    if(prevThemeSettings && prevThemeSettings.hasOwnProperty('currTheme') && prevThemeSettings.currTheme==='custom'){
      this.setState({
        currTheme:prevThemeSettings.currTheme,
        body:prevThemeSettings.bodyColor,
        header:prevThemeSettings.TopBarColor,
        composer:prevThemeSettings.composerColor,
        pane:prevThemeSettings.messagePane,
        textarea:prevThemeSettings.textArea,
        button:prevThemeSettings.buttonColor,
        bodyBackgroundImage:prevThemeSettings.bodyBackgroundImage,
        messageBackgroundImage:prevThemeSettings.messageBackgroundImage,
      })
    }
    else{
      // default theme
      this.setState({
        prevThemeSettings:null,
        body : '#fff',
        header : '#4285f4',
        composer : '#f3f2f4',
        pane : '#f3f2f4',
        textarea: '#fff',
        button: '#4285f4',
      });
      let customData='';
      Object.keys(this.customTheme).forEach((key) => {
        customData=customData+this.customTheme[key]+','
      });

      let settingsChanged = {};
      settingsChanged.theme = 'light';
      settingsChanged.customThemeValue = customData;
      if(this.state.bodyBackgroundImage || this.state.messageBackgroundImage) {
          settingsChanged.backgroundImage = this.state.bodyBackgroundImage + ',' + this.state.messageBackgroundImage;
      }
      Actions.settingsChanged(settingsChanged);
      this.setState({currTheme : 'light'})
      this.setState({
        showLogin: false,
        showSignUp: false,
        showThemeChanger: false,
        openForgotPassword: false,
      });
    }
  }
	handleCloseTour = ()=>{
    this.setState({
      showLogin: false,
      showSignUp: false,
      showThemeChanger: false,
			openForgotPassword: false,
			tour:false
		});
		cookies.set('visited', true, { path: '/' });

	}
  // Save Custom Theme settings on server
  saveThemeSettings = () => {
    let customData='';
    Object.keys(this.customTheme).forEach((key) => {
      customData=customData+this.customTheme[key]+','
    });

    let settingsChanged = {};
    settingsChanged.theme = 'custom';
    settingsChanged.customThemeValue = customData;
    if(this.state.bodyBackgroundImage || this.state.messageBackgroundImage) {
        settingsChanged.backgroundImage = this.state.bodyBackgroundImage + ',' + this.state.messageBackgroundImage;
    }
    Actions.settingsChanged(settingsChanged);
    this.setState({currTheme : 'custom'})
    this.setState({
      showLogin: false,
      showSignUp: false,
      showThemeChanger: false,
      openForgotPassword: false,
    });
  }

  handleRestoreDefaultThemeClick = () => {
    this.setState({
      showLogin: false,
      showSignUp: false,
      showThemeChanger: false,
      openForgotPassword: false,
    });
    this.applyLightTheme();
  }

  applyLightTheme = () =>{
    this.setState({
      prevThemeSettings:null,
      body : '#fff',
      header : '#4285f4',
      composer : '#f3f2f4',
      pane : '#f3f2f4',
      textarea: '#fff',
      button: '#4285f4',
      currTheme : 'light'
    });
    let customData='';
    Object.keys(this.customTheme).forEach((key) => {
      customData=customData+this.customTheme[key]+','
    });

    let settingsChanged = {};
    settingsChanged.theme = 'light';
    settingsChanged.customThemeValue = customData;
    if(this.state.bodyBackgroundImage || this.state.messageBackgroundImage) {
        settingsChanged.backgroundImage = this.state.bodyBackgroundImage + ',' + this.state.messageBackgroundImage;
    }
    Actions.settingsChanged(settingsChanged);
  }

  handleThemeChanger = () => {
    this.setState({showThemeChanger: true});
    // save the previous theme settings
    if(this.state.currTheme==='light'){
      // remove the previous custom theme memory
      this.applyLightTheme();
    }
    var prevThemeSettings={};
    var state=this.state;
    prevThemeSettings.currTheme=state.currTheme;
    if(state.currTheme==='custom'){
      prevThemeSettings.bodyColor = state.body;
      prevThemeSettings.TopBarColor = state.header;
      prevThemeSettings.composerColor = state.composer;
      prevThemeSettings.messagePane = state.pane;
      prevThemeSettings.textArea = state.textarea;
      prevThemeSettings.buttonColor= state.button;
      prevThemeSettings.bodyBackgroundImage=state.bodyBackgroundImage;
      prevThemeSettings.messageBackgroundImage=state.messageBackgroundImage;
    }
    this.setState({prevThemeSettings});
    this.child.closeOptions();
  }

  // Show forgot password dialog
  forgotPasswordChanged = () => {
    this.setState({
        showLogin:false,
        openForgotPassword: true
    });
    this.child.closeOptions();
  }

  handleActionTouchTap = () => {
    this.setState({
      SnackbarOpen: false,
    });
    switch(this.state.currTheme){
      case 'light': {
          this.settingsChanged({
            Theme: 'dark'
          });
          break;
      }
      case 'dark': {
          this.settingsChanged({
            Theme: 'light'
          });
          break;
      }
      default: {
          // do nothing
      }
    }
  }

  handleRequestClose = () => {
    this.setState({
      SnackbarOpen: false,
    });
  }

  // Executes on search text changes
  searchTextChanged = (event) => {
    let matchString = event.target.value;
    let messages = this.state.messages;
    let markingData = searchMsgs(messages, matchString,
                              this.state.searchState.caseSensitive);
    // to make the snackbar hide by default
    this.setState({
      SnackbarOpenSearchResults: false
    })
    if(matchString){
      let searchState = {
        markedMsgs: markingData.allmsgs,
        markedIDs: markingData.markedIDs,
        markedIndices: markingData.markedIndices,
        scrollLimit: markingData.markedIDs.length,
        scrollIndex: 0,
        scrollID: markingData.markedIDs[0],
        caseSensitive: this.state.searchState.caseSensitive,
        open: false,
        searchText: matchString
      };
      if(markingData.markedIDs.length===0 && matchString.trim().length>0){
        // if no Messages are marked(i.e no result) and the search query is not empty
        this.setState({
          SnackbarOpenSearchResults: true
        })
      }
      this.setState({
        searchState: searchState
      });
    }
    else {
      let searchState = {
        markedMsgs: markingData.allmsgs,
        markedIDs: markingData.markedIDs,
        markedIndices: markingData.markedIndices,
        scrollLimit: markingData.markedIDs.length,
        scrollIndex: -1,
        scrollID: null,
        caseSensitive: this.state.searchState.caseSensitive,
        open: false,
        searchText: ''
      }
      this.setState({
        searchState: searchState
      });
    }
  }

  componentDidMount() {
    this._scrollToBottom();
    MessageStore.addChangeListener(this._onChange.bind(this));
    ThreadStore.addChangeListener(this._onChange.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
    window.addEventListener('online', this.handleOnline.bind(this));

    // let state=this.state;
  }

  // Show a snackbar If user offline
  handleOffline() {
    this.setState({
      snackopen: true,
      snackMessage: 'It seems you are offline!'
    })
  }

  // Show a snackbar If user online
  handleOnline() {
    this.setState({
      snackopen: true,
      snackMessage: 'Welcome back!'
    })
  }

  // Scroll to bottom feature goes here
  onScroll = () => {
    let scrollarea = this.scrollarea;
    if(scrollarea){
      let scrollValues = scrollarea.getValues();
      if(scrollValues.top === 1){
        this.setState({
          showScrollBottom: false,
        });
      }
      else if(!this.state.showScrollBottom){
        this.setState({
          showScrollBottom: true,
        });
      }
    }
  }

  componentWillUnmount() {
    MessageStore.removeChangeListener(this._onChange.bind(this));
		ThreadStore.removeChangeListener(this._onChange.bind(this));

  }

  componentWillMount() {


    if (this.props.location) {
      if (this.props.location.state) {
        if (this.props.location.state.hasOwnProperty('showLogin')) {
          let showLogin = this.props.location.state.showLogin;
          this.setState({ showLogin: showLogin });
        }
      }
    }

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

  invertColorTextArea =() => {

    // get the text are code
    var hex = this.state.textarea;
    hex = hex.slice(1);

    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);

    return (r * 0.299 + g * 0.587 + b * 0.114) > 186
        ? '#000000'
        : '#FFFFFF';
}


  render() {
    var bodyColor;
    var TopBarColor;
    var composerColor;
    var messagePane;
    var textArea;
    var buttonColor;
		var textColor;

    switch(this.state.currTheme){
      case 'custom':{
        bodyColor = this.state.body;
        TopBarColor = this.state.header;
        composerColor = this.state.composer;
        messagePane = this.state.pane;
        textArea = this.state.textarea;
        textColor= this.invertColorTextArea();
        buttonColor= this.state.button;
        break;
      }
      case 'light':{
        bodyColor = '#fff';
        TopBarColor = '#4285f4';
        composerColor = '#f3f2f4';
        messagePane = '#f3f2f4';
        textArea = '#fff';
        buttonColor = '#4285f4';
        break;
      }
      default:{
        break;
      }
    }
    document.body.style.setProperty('background-color', bodyColor);
    document.body.style.setProperty('background-image', 'url("'+this.state.bodyBackgroundImage+'")');
    document.body.style.setProperty('background-repeat', 'no-repeat');
    document.body.style.setProperty('background-size', 'cover');

    const bodyStyle = {
      padding: 0,
      textAlign: 'center',
    }

    const {
      dream
    } = this.props;

    const scrollBottomStyle = {
      button : {
        float: 'right',
        marginRight: '5px',
        marginBottom: '10px',
        boxShadow:'none',
      },
      backgroundColor: '#fcfcfc',
      icon : {
        fill: UserPreferencesStore.getTheme()==='light' ? '#90a4ae' : '#7eaaaf'
      }
    }

    var backgroundCol;
    let topBackground = this.state.currTheme;
    switch(topBackground){
      case 'light':{
        backgroundCol = '#4285f4';
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
      label={<Translate text="Cancel" />}
      backgroundColor={
        UserPreferencesStore.getTheme()==='light' ? '#4285f4' : '#19314B'}
      labelColor="#fff"
      width='200px'
      keyboardFocused={true}
      onTouchTap={this.handleClose}
    />;


  const customSettingsDone = <div>
    <RaisedButton
      label={<Translate text="Save" />}
      backgroundColor={buttonColor}
      labelColor="#fff"
      width='200px'
      keyboardFocused={true}
      onTouchTap={this.saveThemeSettings}
      style={{margin:'0 5px'}}
    />
    <RaisedButton
      label={<Translate text="Reset" />}
      backgroundColor={buttonColor}
      labelColor="#fff"
      width='200px'
      keyboardFocused={true}
      onTouchTap={this.handleRestoreDefaultThemeClick}
      style={{margin:'0 5px'}}
    />
    </div>;
    // Custom Theme feature Component
    const componentsList = [
      {'id':1, 'component':'header', 'name': 'Header'},
      {'id':2, 'component': 'pane', 'name': 'Message Pane'},
      {'id':3, 'component':'body', 'name': 'Body'},
      {'id':4, 'component':'composer', 'name': 'Composer'},
      {'id':5, 'component':'textarea', 'name': 'Textarea'},
      {'id':6, 'component':'button', 'name': 'Button'}
    ];

    const components = componentsList.map((component) => {
        return <div key={component.id} className='circleChoose'>
                  <h4><Translate text="Color of"/> <Translate text={component.name}/>:</h4>
        <CirclePicker  color={component} width={'100%'}
          colors={['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
        '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#607d8b',
        '#0f0f0f','#ffffff',]}
          onChangeComplete={ this.handleChangeComplete.bind(this,
          component.component) }
          onChange={this.handleColorChange.bind(this,component.id)}>
        </CirclePicker>

        <TextField
          name="backgroundImg"
          style={{display:component.component==='body'?'block':'none'}}
          onChange={
            (e,value)=>
            this.handleChangeBodyBackgroundImage(value) }
          value={this.state.bodyBackgroundImage}
          floatingLabelText={<Translate text="Body Background Image URL" />} />
            <RaisedButton
                name="removeBackgroundBody"
                key={'RemoveBody'}
                label={<Translate text="Remove URL" />}
                style={{
                  display:component.component==='body'?'block':'none',
                  width: '150px'
                }}
                backgroundColor={buttonColor}
                labelColor="#fff"
                keyboardFocused={true}
                onTouchTap={this.handleRemoveUrlBody} />
        <TextField
              name="messageImg"
              style={{display:component.component==='pane'?'block':'none'}}
              onChange={
                (e,value)=>
                this.handleChangeMessageBackgroundImage(value) }
              value={this.state.messageBackgroundImage}
              floatingLabelText={<Translate text="Message Background Image URL"/>} />
        <RaisedButton
              name="removeBackgroundMessage"
              key={'RemoveMessage'}
              label={<Translate text="Remove URL" />}
              style={{
                display:component.component==='pane'?'block':'none',
                width: '150px'
              }}
              backgroundColor={buttonColor}
              labelColor="#fff"
              keyboardFocused={true}
              onTouchTap={this.handleRemoveUrlMessage} />

        </div>
    })

    let speechOutput = UserPreferencesStore.getSpeechOutput();
    let speechOutputAlways = UserPreferencesStore.getSpeechOutputAlways();

    var body = this.state.body;

    let messageListItems = [];
    if(this.state.search){
      let markID = this.state.searchState.scrollID;
      let markedMessages = this.state.searchState.markedMsgs;
      messageListItems = getMessageListItem(markedMessages,false,markID);
    }
    else{
      messageListItems = getMessageListItem(this.state.messages,
                                            this.state.showLoading);
    }

    if (this.state.thread) {

    const messageBackgroundStyles = { backgroundColor: messagePane,
                    backgroundImage: `url(${this.state.messageBackgroundImage})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '100% 100%'
                    }
        return (
          <div className={topBackground} style={{background:body}}>
            <header className='message-thread-heading'
            style={{ backgroundColor: backgroundCol }}>
              <TopBar
                header={TopBarColor}
                {...this.props}
                ref={instance => { this.child = instance; }}
                handleThemeChanger={this.handleThemeChanger}
                handleOpen={this.handleOpen}
                handleSignUp={this.handleSignUp}
                handleOptions={this.handleOptions}
                handleRequestClose={this.handleRequestClose}
                handleToggle={this.handleToggle}
                searchTextChanged={this.searchTextChanged}
                _onClickSearch={this._onClickSearch}
                _onClickExit={this._onClickExit}
                _onClickRecent={this._onClickRecent}
                _onClickPrev={this._onClickPrev}
                search={this.state.search}
                searchState={this.state.searchState}
              />
            </header>
            {!this.state.search ? (
            <div>
            <div className='message-pane'>
              <div className='message-section'>
                <ul
                  className='message-list'
                  ref={(c) => { this.messageList = c; }}
                  style={messageBackgroundStyles}>
                  <Scrollbars
                    ref={(ref) => { this.scrollarea = ref; }}
                    autoHide
                    onScroll={this.onScroll}
                    autoHideTimeout={1000}
                    autoHideDuration={200}>
                    {messageListItems}
                    {this.state.showLoading && getLoadingGIF()}
                  </Scrollbars>
                </ul>
                {this.state.showScrollBottom &&
                  <div className='scrollBottom'>
                    <FloatingActionButton mini={true}
                      style={scrollBottomStyle.button}
                      backgroundColor={scrollBottomStyle.backgroundColor}
                      iconStyle={scrollBottomStyle.icon}
                      onTouchTap={this.forcedScrollToBottom}>
                      <NavigateDown />
                    </FloatingActionButton>
                  </div>
                }
                <div className='compose' style={{backgroundColor:composerColor}}>
                  <MessageComposer
                    focus={true}
                    threadID={this.state.thread.id}
                    dream={dream}
                    textarea={textArea}
                    textcolor={textColor}
                    speechOutput={speechOutput}
                    speechOutputAlways={speechOutputAlways}
                    micColor={this.state.button} />
                </div>
              </div>
            </div>
            {/*  All Dialogs are handled by this components */}
            <DialogSection
              {...this.props}
              openLogin={this.state.showLogin}
              openSignUp={this.state.showSignUp}
              openForgotPassword={this.state.openForgotPassword}
              openThemeChanger={this.state.showThemeChanger}
              ThemeChangerComponents={components}
              bodyStyle={bodyStyle}
              actions={actions}
              handleSignUp={this.handleSignUp}
              customSettingsDone={customSettingsDone}
							onRequestClose={()=>this.handleClose}
							onRequestCloseTour={()=>this.handleCloseTour}
              onSaveThemeSettings={()=>this.handleSaveTheme}
              onLoginSignUp={()=>this.handleOpen}
							onForgotPassword={()=>this.forgotPasswordChanged}
							tour={!cookies.get('visited')}

							 />
            </div>)
             : (
             <div className='message-pane'>
               <div className='message-section'>
                 <ul
                   className="message-list"
                   ref={(c) => { this.messageList = c; }}
                    style={this.messageBackgroundStyle}>

                   <Scrollbars
                      autoHide
                      autoHideTimeout={1000}
                      autoHideDuration={200}
                      ref={(ref) => { this.scrollarea = ref; }}>
                       {messageListItems}
                   </Scrollbars>

                 </ul>
                 <div className='compose' style={{backgroundColor:composerColor}}>
                  <MessageComposer
                    focus={false}
                    threadID={this.state.thread.id}
                    dream={dream}
                    textarea={textArea}
                    textcolor={textColor}
                    speechOutput={speechOutput}
                    speechOutputAlways={speechOutputAlways}
                    micColor={this.state.button} />
                </div>
               </div>
             </div>
             )}
             <Snackbar
               open={this.state.SnackbarOpenBackground}
               message={<Translate text='Please enter a valid URL first'/>}
               autoHideDuration={4000}
             />
             <Snackbar
               open={this.state.SnackbarOpen}
               message={<Translate text='Theme Changed'/>}
               action="undo"
               autoHideDuration={4000}
               onActionTouchTap={this.handleActionTouchTap}
               onRequestClose={this.handleRequestClose}
             />
             <Snackbar
              autoHideDuration={4000}
              open={this.state.snackopen}
              message={<Translate text={this.state.snackMessage} />}
              />
              <Snackbar
               autoHideDuration={4000}
               open={this.state.SnackbarOpenSearchResults && !this.state.snackopen}
               message={<Translate text='No Results!' />}
               />
           </div>
         );
     }

     return <div className='message-section'></div>;
   }

  componentDidUpdate() {
    switch (this.state.currTheme) {
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

    if(this.state.search){
      if (this.state.searchState.scrollIndex === -1
        || this.state.searchState.scrollIndex === null) {
        this._scrollToBottom();
      }
      else {
        let markedIDs = this.state.searchState.markedIDs;
        let markedIndices = this.state.searchState.markedIndices;
        let limit = this.state.searchState.scrollLimit;
        let ul = this.messageList;
        if (markedIDs && ul && limit > 0) {
          let currentID = markedIndices[this.state.searchState.scrollIndex];
          this.scrollarea.view.childNodes[currentID].scrollIntoView();
        }
      }
    }
    else{
      this._scrollToBottom();
    }
  }

  _scrollToBottom = () => {
    let ul = this.scrollarea;
    if (ul && !this.state.showScrollBottom) {
      ul.scrollTop(ul.getScrollHeight());
    }
  }

  forcedScrollToBottom = () => {
    let ul = this.scrollarea;
    if (ul) {
      ul.scrollTop(ul.getScrollHeight());
    }
  }

_onClickPrev = () => {
  let newIndex = this.state.searchState.scrollIndex + 1;
  let indexLimit = this.state.searchState.scrollLimit;
  let markedIDs = this.state.searchState.markedIDs;
  let ul = this.messageList;
  if (markedIDs && ul && newIndex < indexLimit) {
    let currState = this.state.searchState;
    currState.scrollIndex = newIndex;
    currState.scrollID = markedIDs[newIndex];
    this.setState({
      searchState: currState
    });
  }
}

_onClickRecent = () => {
  let newIndex = this.state.searchState.scrollIndex - 1;
  let markedIDs = this.state.searchState.markedIDs;
  let ul = this.messageList;
  if (markedIDs && ul && newIndex >= 0) {
    let currState = this.state.searchState;
    currState.scrollIndex = newIndex;
    currState.scrollID = markedIDs[newIndex];
    this.setState({
      searchState: currState
    });
  }
}

_onClickSearch = () => {
  let searchState = this.state.searchState;
  searchState.markedMsgs = this.state.messages;
  this.setState({
    search: true,
    searchState: searchState,
  });
}

_onClickExit = () => {
  let searchState = this.state.searchState;
  searchState.searchText = '';
  this.setState({
    search: false,
    searchState: searchState,
  });
}

handleOptions = (event) => {
  event.preventDefault();
  let searchState = this.state.searchState;
  searchState.open = true;
  searchState.anchorEl = event.currentTarget;
  this.setState({
    searchState: searchState,
  });
}

handleToggle = (event, isInputChecked) => {
  let searchState = {
    markedMsgs: this.state.messages,
    markedIDs: [],
    markedIndices: [],
    scrollLimit: 0,
    scrollIndex: -1,
    scrollID: null,
    caseSensitive: isInputChecked,
    open: true,
    searchText: ''
  }
  this.setState({
    searchState: searchState
  });
}

handleRequestClose = () => {
  let searchState = this.state.searchState;
  searchState.open = false;
  this.setState({
    searchState: searchState,
  });
};

/**
 * Event handler for 'change' events coming from the MessageStore
 */
_onChange() {
  this.setState(getStateFromStores());
}

};


MessageSection.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object
};

export default addUrlProps({ urlPropsQueryConfig })(MessageSection);

import MessageComposer from '../MessageComposer.react';
import MessageListItem from '../MessageListItem/MessageListItem.react';
import MessageStore from '../../../stores/MessageStore';
import React, { Component } from 'react';
import ThreadStore from '../../../stores/ThreadStore';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import PropTypes from 'prop-types';
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';
import loadingGIF from '../../../images/loading.gif';
import DialogSection from './DialogSection';
import $ from 'jquery';
import { Scrollbars } from 'react-custom-scrollbars';
import TopBar from '../TopBar.react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import NavigateDown from 'material-ui/svg-icons/navigation/expand-more';
import NavigateUp from 'material-ui/svg-icons/navigation/expand-less';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

function getStateFromStores() {
  var themeValue = [];
  var backgroundValue = [];
  // get Theme data from server
  if (UserPreferencesStore.getThemeValues()) {
    themeValue = UserPreferencesStore.getThemeValues().split(',');
  }

  if (UserPreferencesStore.getBackgroundImage()) {
    backgroundValue = UserPreferencesStore.getBackgroundImage().split(',');
  }
  return {
    player: [],
    messages: MessageStore.getAllForCurrentThread(),
    thread: ThreadStore.getCurrent(),
    currTheme: UserPreferencesStore.getTheme(),
    tour: true,
    search: false,
    showLoading: MessageStore.getLoadStatus(),
    showHardwareChangeDialog: false,
    showHardware: false,
    openShare: false,
    showServerChangeDialog: false,
    header: themeValue.length > 5 ? '#' + themeValue[0] : '#4285f4',
    pane: themeValue.length > 5 ? '#' + themeValue[1] : '#f5f4f6',
    body: themeValue.length > 5 ? '#' + themeValue[2] : '#fff',
    composer: themeValue.length > 5 ? '#' + themeValue[3] : '#f5f4f6',
    textarea: themeValue.length > 5 ? '#' + themeValue[4] : '#fff',
    button: themeValue.length > 5 ? '#' + themeValue[5] : '#4285f4',
    bodyBackgroundImage: backgroundValue.length > 1 ? backgroundValue[0] : '',
    messageBackgroundImage:
      backgroundValue.length > 1 ? backgroundValue[1] : '',
    showScrollBottom: false,
    showScrollTop: false,
    searchState: {
      markedMsgs: [],
      markedIDs: [],
      markedIndices: [],
      scrollLimit: 0,
      scrollIndex: -1,
      scrollID: null,
      caseSensitive: false,
      open: false,
      searchIndex: 0,
      searchText: '',
    },
  };
}

function getMessageListItem(messages, showLoading, addYouTube, markID) {
  // markID indicates search mode on
  if (markID) {
    return messages.map(message => {
      return (
        <MessageListItem
          key={message.id}
          message={message}
          markID={markID}
          playerAdd={addYouTube}
        />
      );
    });
  }

  // Get message ID waiting for server response
  let latestUserMsgID = null;
  if (showLoading && messages) {
    let msgCount = messages.length;
    if (msgCount > 0) {
      let latestUserMsg = messages[msgCount - 1];
      latestUserMsgID = latestUserMsg.id;
    }
  }

  let latestMessage = messages[messages.length - 1];

  // return the list of messages
  return messages.map(message => {
    if (message !== latestMessage) {
      return (
        <MessageListItem
          key={message.id}
          message={message}
          latestUserMsgID={latestUserMsgID}
          latestMessage={false}
          playerAdd={addYouTube}
        />
      );
    }
    return (
      <MessageListItem
        key={message.id}
        message={message}
        latestUserMsgID={latestUserMsgID}
        latestMessage={true}
        playerAdd={addYouTube}
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
          isCaseSensitive: isCaseSensitive,
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
    <li className="message-list-item">
      <section className={messageContainerClasses}>
        <img
          src={loadingGIF}
          style={{ height: '10px', width: 'auto' }}
          alt="please wait.."
        />
      </section>
    </li>
  );
  return LoadingComponent;
}

const urlPropsQueryConfig = {
  dream: { type: UrlQueryParamTypes.string },
};

class MessageSection extends Component {
  static propTypes = {
    dream: PropTypes.string,
    location: PropTypes.object,
    history: PropTypes.object,
    openSnackBar: PropTypes.func,
    closeSnackBar: PropTypes.func,
  };

  static defaultProps = {
    dream: '',
  };

  constructor(props) {
    super(props);
    this.state = getStateFromStores();
    this.customTheme = {
      header: this.state.header.substring(1),
      pane: this.state.pane.substring(1),
      body: this.state.body.substring(1),
      composer: this.state.composer.substring(1),
      textarea: this.state.textarea.substring(1),
      button: this.state.button.substring(1),
    };
  }

  pauseAllVideos = () => {
    this.state.player.forEach(event => {
      try {
        if (event.target.getPlayerState() === 1) {
          event.target.pauseVideo();
        }
      } catch (error) {
        // do nothing,
      }
    });
  };

  handleShare = () => {
    this.setState({ openShare: true });
  };
  handleShareClose = () => {
    console.log(this.state.openShare);
    this.setState({ openShare: false });
  };
  addYouTube = playerNew => {
    this.pauseAllVideos();
    this.setState(prevState => ({ player: [...prevState.player, playerNew] }));
  };

  handleShare = () => {
    this.setState({ openShare: true });
  };
  handleShareClose = () => {
    console.log(this.state.openShare);
    this.setState({ openShare: false });
  };
  handleCloseTour = () => {
    this.setState({
      tour: false,
    });
    cookies.set('visited', true, { path: '/' });
  };

  // Executes on search text changes
  searchTextChanged = event => {
    let matchString = event.target.value;
    let messages = this.state.messages;
    let markingData = searchMsgs(
      messages,
      matchString,
      this.state.searchState.caseSensitive,
    );

    if (matchString) {
      let searchState = {
        markedMsgs: markingData.allmsgs,
        markedIDs: markingData.markedIDs,
        markedIndices: markingData.markedIndices,
        scrollLimit: markingData.markedIDs.length,
        scrollIndex: 0,
        scrollID: markingData.markedIDs[0],
        caseSensitive: this.state.searchState.caseSensitive,
        open: false,
        searchIndex: 1,
        searchText: matchString,
      };
      if (markingData.markedIDs.length === 0 && matchString.trim().length > 0) {
        searchState.searchIndex = 0;
        this.props.openSnackBar({
          snackBarMessage: 'No Results!',
        });
      }
      this.setState({
        searchState,
      });
    } else {
      let searchState = {
        markedMsgs: markingData.allmsgs,
        markedIDs: markingData.markedIDs,
        markedIndices: markingData.markedIndices,
        scrollLimit: 0,
        scrollIndex: -1,
        scrollID: null,
        caseSensitive: this.state.searchState.caseSensitive,
        open: false,
        searchIndex: 0,
        searchText: '',
      };
      this.setState({
        searchState: searchState,
      });
    }
  };

  componentDidMount() {
    switch (this.state.currTheme) {
      case 'light': {
        document.body.className = 'white-body';
        break;
      }
      case 'dark': {
        document.body.className = 'dark-body';
        break;
      }
      default: {
        // do nothing
      }
    }

    UserPreferencesStore.on('change', () => {
      this.setState({
        currTheme: UserPreferencesStore.getTheme(),
      });
      switch (this.state.currTheme) {
        case 'light': {
          document.body.className = 'white-body';
          break;
        }
        case 'dark': {
          document.body.className = 'dark-body';
          break;
        }
        default: {
          // do nothing
        }
      }
    });

    this._scrollToBottom();
    MessageStore.addChangeListener(this._onChange);
    ThreadStore.addChangeListener(this._onChange);
  }

  // Scroll to bottom feature goes here
  onScroll = () => {
    let scrollarea = this.scrollarea;
    if (scrollarea) {
      let scrollValues = scrollarea.getValues();
      if (scrollValues.top === 1) {
        this.setState({
          showScrollBottom: false,
        });
      } else if (scrollValues.top === 0) {
        this.setState({
          showScrollTop: false,
          showScrollBottom: true,
        });
      } else {
        this.setState({
          showScrollBottom: true,
          showScrollTop: true,
        });
      }
    }
  };

  renderThumb = ({ style, ...props }) => {
    const finalThumbStyle = {
      ...style,
      cursor: 'pointer',
      borderRadius: 'inherit',
      backgroundColor: 'rgba(200, 200, 200, 0.4)',
    };

    return <div style={finalThumbStyle} {...props} />;
  };

  componentWillUnmount() {
    MessageStore.removeChangeListener(this._onChange);
    ThreadStore.removeChangeListener(this._onChange);
  }

  invertColorTextArea = () => {
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

    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';
  };

  render() {
    var bodyColor;
    var TopBarColor;
    var composerColor;
    var messagePane;
    var textArea;
    // eslint-disable-next-line
    var buttonColor;
    var textColor;

    switch (this.state.currTheme) {
      case 'custom': {
        bodyColor = this.state.body;
        TopBarColor = this.state.header;
        composerColor = this.state.composer;
        messagePane = this.state.pane;
        textArea = this.state.textarea;
        textColor = this.invertColorTextArea();
        buttonColor = this.state.button;
        break;
      }
      case 'light': {
        bodyColor = '#fff';
        TopBarColor = '#4285f4';
        composerColor = '#f3f2f4';
        messagePane = '#f3f2f4';
        textArea = '#fff';
        buttonColor = '#4285f4';
        break;
      }
      default: {
        break;
      }
    }
    document.body.style.setProperty(
      'background-color',
      this.state.currTheme === 'dark' ? 'rgb(0, 0, 18)' : bodyColor,
    );
    document.body.style.setProperty(
      'background-image',
      'url("' + this.state.bodyBackgroundImage + '")',
    );
    document.body.style.setProperty('background-repeat', 'no-repeat');
    document.body.style.setProperty('background-size', 'cover');

    const { dream } = this.props;

    const scrollBottomStyle = {
      button: {
        float: 'right',
        marginRight: '5px',
        marginBottom: '10px',
        boxShadow: 'none',
      },
      backgroundColor: '#fcfcfc',
      icon: {
        fill:
          UserPreferencesStore.getTheme() === 'light' ? '#90a4ae' : '#000000',
      },
    };

    const scrollTopStyle = {
      button: {
        float: 'left',
        marginLeft: '5px',
        marginTop: '10px',
        boxShadow: 'none',
      },
      backgroundColor: '#fcfcfc',
      icon: {
        fill:
          UserPreferencesStore.getTheme() === 'light' ? '#90a4ae' : '#000000',
      },
    };

    var backgroundCol;
    let topBackground = this.state.currTheme;
    switch (topBackground) {
      case 'light': {
        backgroundCol = '#4285f4';
        break;
      }
      case 'dark': {
        backgroundCol = '#19324c';
        break;
      }
      default: {
        // do nothing
      }
    }

    let speechOutput = UserPreferencesStore.getSpeechOutput();
    let speechOutputAlways = UserPreferencesStore.getSpeechOutputAlways();

    var body = this.state.body;

    let messageListItems = [];
    if (this.state.search) {
      let markID = this.state.searchState.scrollID;
      let markedMessages = this.state.searchState.markedMsgs;
      messageListItems = getMessageListItem(
        markedMessages,
        false,
        this.addYouTube,
        markID,
      );
    } else {
      messageListItems = getMessageListItem(
        this.state.messages,
        this.state.showLoading,
        this.addYouTube,
      );
    }

    if (this.state.thread) {
      const messageBackgroundStyles = {
        backgroundColor: messagePane,
        backgroundImage: `url(${this.state.messageBackgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
      };
      return (
        <div className={topBackground} style={{ background: body }}>
          <header
            className="message-thread-heading"
            style={{ backgroundColor: backgroundCol }}
          >
            <TopBar
              header={TopBarColor}
              {...this.props}
              ref={instance => {
                this.child = instance;
              }}
              handleOptions={this.handleOptions}
              openShare={this.openShare}
              handleShare={this.handleShare}
              handleShareClose={this.handleShareClose}
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

          <div>
            <div className="message-pane">
              <div className="message-section">
                <ul
                  className="message-list"
                  ref={c => {
                    this.messageList = c;
                  }}
                  style={messageBackgroundStyles}
                >
                  <Scrollbars
                    renderThumbHorizontal={this.renderThumb}
                    renderThumbVertical={this.renderThumb}
                    ref={ref => {
                      this.scrollarea = ref;
                    }}
                    autoHide
                    onScroll={this.onScroll}
                    autoHideTimeout={1000}
                    autoHideDuration={200}
                  >
                    {messageListItems}
                    {!this.state.search &&
                      this.state.showLoading &&
                      getLoadingGIF()}
                  </Scrollbars>
                </ul>
                {this.state.showScrollTop && (
                  <div>
                    <FloatingActionButton
                      mini={true}
                      style={scrollTopStyle.button}
                      backgroundColor={bodyColor}
                      iconStyle={scrollTopStyle.icon}
                      onTouchTap={this.forcedScrollToTop}
                    >
                      <NavigateUp />
                    </FloatingActionButton>
                  </div>
                )}
                {this.state.showScrollBottom && (
                  <div className="scrollBottom">
                    <FloatingActionButton
                      mini={true}
                      style={scrollBottomStyle.button}
                      backgroundColor={bodyColor}
                      iconStyle={scrollBottomStyle.icon}
                      onTouchTap={this.forcedScrollToBottom}
                    >
                      <NavigateDown />
                    </FloatingActionButton>
                  </div>
                )}
                <div
                  className="compose"
                  style={{ backgroundColor: composerColor }}
                >
                  <MessageComposer
                    focus={!this.state.search}
                    threadID={this.state.thread.id}
                    dream={dream}
                    textarea={textArea}
                    textcolor={textColor}
                    speechOutput={speechOutput}
                    speechOutputAlways={speechOutputAlways}
                    micColor={this.state.button}
                  />
                </div>
              </div>
            </div>
            {/*  All Dialogs are handled by this components */}
            {!this.state.search ? (
              <DialogSection
                {...this.props}
                openShare={this.state.openShare}
                handleShareClose={this.handleShareClose}
                onRequestCloseTour={() => this.handleCloseTour}
                tour={!cookies.get('visited')}
              />
            ) : null}
          </div>
        </div>
      );
    }

    return <div className="message-section" />;
  }

  componentDidUpdate() {
    switch (this.state.currTheme) {
      case 'light': {
        document.body.className = 'white-body';
        break;
      }
      case 'dark': {
        document.body.className = 'dark-body';
        break;
      }
      default: {
        // do nothing
      }
    }

    if (this.state.search) {
      if (
        this.state.searchState.scrollIndex === -1 ||
        this.state.searchState.scrollIndex === null
      ) {
        this._scrollToBottom();
      } else {
        let markedIDs = this.state.searchState.markedIDs;
        let markedIndices = this.state.searchState.markedIndices;
        let limit = this.state.searchState.scrollLimit;
        let ul = this.messageList;
        if (markedIDs && ul && limit > 0) {
          let currentID = markedIndices[this.state.searchState.scrollIndex];
          this.scrollarea.view.childNodes[currentID].scrollIntoView();
        }
      }
    } else {
      this._scrollToBottom();
    }
  }

  _scrollToBottom = () => {
    let ul = this.scrollarea;
    if (ul && !this.state.showScrollBottom) {
      ul.scrollTop(ul.getScrollHeight());
    }
  };

  forcedScrollToBottom = () => {
    let ul = this.scrollarea;
    if (ul) {
      ul.scrollTop(ul.getScrollHeight());
      this.setState({
        showScrollTop: true,
      });
    }
  };

  forcedScrollToTop = () => {
    let ul = this.scrollarea;
    ul.scrollTop(0);
  };

  _onClickPrev = () => {
    let newIndex = this.state.searchState.scrollIndex + 1;
    let newSearchCount = this.state.searchState.searchIndex + 1;
    let indexLimit = this.state.searchState.scrollLimit;
    let markedIDs = this.state.searchState.markedIDs;
    let ul = this.messageList;
    if (newSearchCount > indexLimit) {
      newSearchCount = 1;
      newIndex = 0;
    }

    if (markedIDs && ul && newIndex < indexLimit && newIndex >= 0) {
      let currState = this.state.searchState;
      currState.scrollIndex = newIndex;
      currState.searchIndex = newSearchCount;
      currState.scrollID = markedIDs[newIndex];
      this.setState({
        searchState: currState,
      });
    }
    if (markedIDs && ul && newIndex === 0) {
      let currState = this.state.searchState;
      newIndex = indexLimit;
      currState.scrollIndex = newIndex;
      currState.searchIndex = 1;
    }
    if (markedIDs && ul && newIndex < 0) {
      let currState = this.state.searchState;
      newIndex = indexLimit;
      currState.scrollIndex = newIndex;
      currState.searchIndex = 1;
      newIndex = this.state.searchState.scrollIndex + 1;
      newSearchCount = this.state.searchState.searchIndex + 1;
      markedIDs = this.state.searchState.markedIDs;
      indexLimit = this.state.searchState.scrollLimit;
      ul = this.messageList;
      if (newSearchCount <= 0) {
        newSearchCount = indexLimit;
      }
      if (markedIDs && ul && newIndex >= 0) {
        currState = this.state.searchState;
        currState.scrollIndex = newIndex;
        currState.searchIndex = newSearchCount;
        currState.scrollID = markedIDs[newIndex];
        this.setState({
          searchState: currState,
        });
      }
    }
  };

  _onClickRecent = () => {
    let newIndex = this.state.searchState.scrollIndex - 1;
    let newSearchCount = this.state.searchState.searchIndex - 1;
    let markedIDs = this.state.searchState.markedIDs;
    let indexLimit = this.state.searchState.scrollLimit;
    let ul = this.messageList;
    if (newSearchCount <= 0) {
      newSearchCount = indexLimit;
    }
    if (markedIDs && ul && newIndex >= 0) {
      let currState = this.state.searchState;
      currState.scrollIndex = newIndex;
      currState.searchIndex = newSearchCount;
      currState.scrollID = markedIDs[newIndex];
      this.setState({
        searchState: currState,
      });
    }
    if (markedIDs && ul && newIndex === 0) {
      let currState = this.state.searchState;
      newIndex = 0;
      currState.scrollIndex = newIndex;
      currState.searchIndex = 1;
    }
    if (markedIDs && ul && newIndex < 0) {
      let currState = this.state.searchState;
      newIndex = indexLimit;
      currState.scrollIndex = newIndex;
      currState.searchIndex = 1;
      newIndex = this.state.searchState.scrollIndex - 1;
      newSearchCount = this.state.searchState.searchIndex - 1;
      markedIDs = this.state.searchState.markedIDs;
      indexLimit = this.state.searchState.scrollLimit;
      ul = this.messageList;
      if (newSearchCount <= 0) {
        newSearchCount = indexLimit;
      }
      if (markedIDs && ul && newIndex >= 0) {
        currState = this.state.searchState;
        currState.scrollIndex = newIndex;
        currState.searchIndex = newSearchCount;
        currState.scrollID = markedIDs[newIndex];
        this.setState({
          searchState: currState,
        });
      }
    }
  };

  _onClickSearch = () => {
    let searchState = this.state.searchState;
    searchState.markedMsgs = this.state.messages;
    this.props.closeSnackBar();
    this.setState({
      search: true,
      searchState: searchState,
    });
  };

  _onClickExit = () => {
    let searchState = this.state.searchState;
    searchState.searchText = '';
    searchState.searchIndex = 0;
    searchState.scrollLimit = 0;
    this.props.closeSnackBar();
    this.setState({
      search: false,
      searchState: searchState,
    });
  };

  handleOptions = event => {
    event.preventDefault();
    let searchState = this.state.searchState;
    searchState.open = true;
    searchState.anchorEl = event.currentTarget;
    this.setState({
      searchState: searchState,
    });
  };

  handleToggle = (event, isInputChecked) => {
    let searchTextPrev = this.state.searchState.searchText;
    let searchState = {
      markedMsgs: this.state.messages,
      markedIDs: [],
      markedIndices: [],
      scrollLimit: 0,
      scrollIndex: -1,
      scrollID: null,
      caseSensitive: isInputChecked,
      open: true,
      searchText: searchTextPrev,
    };
    this.setState({
      searchState: searchState,
    });
  };

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
  _onChange = () => {
    let array = this.state.player;
    this.setState(getStateFromStores());
    this.setState({ player: array });
  };
}

export default addUrlProps({ urlPropsQueryConfig })(MessageSection);

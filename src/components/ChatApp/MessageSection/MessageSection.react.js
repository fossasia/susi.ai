import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';
import CircularProgress from 'material-ui/CircularProgress';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import NavigateDown from 'material-ui/svg-icons/navigation/expand-more';
import NavigateUp from 'material-ui/svg-icons/navigation/expand-less';
import TopBar from '../TopBar.react';
import MessageComposer from '../MessageComposer.react';
import loadingGIF from '../../../images/loading.gif';
import MessageListItem from '../MessageListItem/MessageListItem.react';
import DialogSection from './DialogSection';
import { searchMessages } from '../../../utils/searchMessages';
import { bindActionCreators } from 'redux';
import uiActions from '../../../redux/actions/ui';

const styles = {
  scrollBottomStyle: {
    button: {
      float: 'right',
      marginRight: '5px',
      marginBottom: '10px',
      boxShadow: 'none',
    },
    backgroundColor: '#fcfcfc',
  },
  scrollTopStyle: {
    button: {
      float: 'left',
      marginLeft: '5px',
      marginTop: '10px',
      boxShadow: 'none',
    },
    backgroundColor: '#fcfcfc',
  },
  messageBackgroundStyles: {
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
  },
};

const urlPropsQueryConfig = {
  dream: { type: UrlQueryParamTypes.string },
};

class MessageSection extends Component {
  static propTypes = {
    dream: PropTypes.string,
    location: PropTypes.object,
    history: PropTypes.object,
    speechOutput: PropTypes.bool,
    speechOutputAlways: PropTypes.bool,
    theme: PropTypes.string,
    customThemeValue: PropTypes.object,
    messages: PropTypes.array,
    messagesByID: PropTypes.object,
    loadingHistory: PropTypes.bool,
    loadingReply: PropTypes.bool,
    openSnackBar: PropTypes.func,
    closeSnackBar: PropTypes.func,
    backgroundImage: PropTypes.string,
    messageBackgroundImage: PropTypes.string,
    actions: PropTypes.object,
  };

  static defaultProps = {
    dream: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      player: [],
      search: false,
      showLoading: false,
      showScrollBottom: false,
      showScrollTop: false,
      searchState: {
        markedMessagesByID: {},
        markedIDs: [],
        markedIndices: [],
        scrollLimit: 0,
        scrollIndex: -1,
        scrollID: null,
        caseSensitive: false,
        searchIndex: 0,
        searchText: '',
      },
    };
  }

  componentDidUpdate(prevProps) {
    const { search, searchState } = this.state;
    const { messages } = this.props;
    if (search) {
      if (searchState.scrollIndex === -1 || searchState.scrollIndex === null) {
        this.scrollToBottom();
      } else {
        const markedIDs = searchState.markedIDs;
        const markedIndices = searchState.markedIndices;
        const limit = searchState.scrollLimit;
        const ul = this.messageList;
        if (markedIDs && ul && limit > 0) {
          const currentID = markedIndices[searchState.scrollIndex];
          this.scrollarea.view.childNodes[currentID].scrollIntoView();
        }
      }
    } else if (prevProps.messages.length !== messages.length) {
      this.scrollToBottom();
    }
  }

  pauseAllVideos = () => {
    const { player } = this.state;
    player.forEach(event => {
      try {
        if (event.target.getPlayerState() === 1) {
          event.target.pauseVideo();
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  addYouTube = newPlayer => {
    this.pauseAllVideos();
    this.setState(prevState => ({ player: [...prevState.player, newPlayer] }));
  };

  onScroll = () => {
    const { showScrollBottom, showScrollTop } = this.state;
    if (this.scrollarea) {
      let scrollValues = this.scrollarea.getValues();
      if (scrollValues.top >= 1) {
        this.setState({
          showScrollTop: true,
          showScrollBottom: false,
        });
      } else if (scrollValues.top === 0) {
        this.setState({
          showScrollTop: false,
          showScrollBottom: true,
        });
      } else if (!(showScrollBottom && showScrollTop)) {
        this.setState({
          showScrollBottom: true,
          showScrollTop: true,
        });
      }
    }
  };

  scrollToBottom = () => {
    const scrollBar = this.scrollarea;
    if (scrollBar) {
      scrollBar.view.scroll({
        top: scrollBar.getScrollHeight(),
        behavior: 'smooth',
      });
    }
  };

  scrollToTop = () => {
    const scrollBar = this.scrollarea;
    if (scrollBar) {
      scrollBar.view.scroll({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  searchTextChanged = event => {
    const { messages, messagesByID, actions } = this.props;
    let { searchState } = this.state;
    const searchText = event.target.value;
    actions.closeSnackBar();
    if (searchText.trim()) {
      const markingData = searchMessages(
        messages,
        messagesByID,
        searchText,
        searchState.caseSensitive,
      );
      const { markedMessagesByID, markedIDs, markedIndices } = markingData;
      searchState = {
        markedMessagesByID: markedMessagesByID,
        markedIDs: markedIDs,
        markedIndices: markedIndices,
        scrollLimit: markedIDs.length,
        scrollIndex: 0,
        scrollID: markedIDs[0],
        caseSensitive: searchState.caseSensitive,
        searchIndex: 1,
        searchText: searchText,
      };
      if (markedIDs.length === 0 && searchText.trim()) {
        // if no Messages are marked(i.e no result) and the search query is not empty
        actions.openSnackBar({
          snackBarMessage: 'No result found!',
          snackBarDuration: 3000,
        });
      }
    } else {
      searchState = {
        markedMessagesByID: messagesByID,
        markedIDs: [],
        markedIndices: [],
        scrollLimit: 0,
        scrollIndex: -1,
        scrollID: null,
        caseSensitive: searchState.caseSensitive,
        searchIndex: 0,
        searchText: '',
      };
    }
    this.setState({
      searchState,
    });
  };

  previousSearchItem = () => {
    const { searchState } = this.state;
    let newIndex = searchState.scrollIndex + 1;
    let newSearchCount = searchState.searchIndex + 1;
    let indexLimit = searchState.scrollLimit;
    let markedIDs = searchState.markedIDs;
    let ul = this.messageList;
    if (newSearchCount <= 0) {
      newSearchCount = indexLimit;
    }

    if (markedIDs && ul && newIndex < indexLimit) {
      let currState = searchState;
      currState.scrollIndex = newIndex;
      currState.searchIndex = newSearchCount;
      currState.scrollID = markedIDs[newIndex];
      this.setState({
        searchState: currState,
      });
    }
    if (markedIDs && ul && newIndex === 0) {
      let currState = searchState;
      newIndex = indexLimit;
      currState.scrollIndex = newIndex;
      currState.searchIndex = 1;
    }
    if (markedIDs && ul && newIndex < 0) {
      let currState = searchState;
      newIndex = indexLimit;
      currState.scrollIndex = newIndex;
      currState.searchIndex = 1;
      newIndex = searchState.scrollIndex + 1;
      newSearchCount = searchState.searchIndex + 1;
      markedIDs = searchState.markedIDs;
      indexLimit = searchState.scrollLimit;
      ul = this.messageList;
      if (newSearchCount <= 0) {
        newSearchCount = indexLimit;
      }
      if (markedIDs && ul && newIndex >= 0) {
        currState = searchState;
        currState.scrollIndex = newIndex;
        currState.searchIndex = newSearchCount;
        currState.scrollID = markedIDs[newIndex];
        this.setState({
          searchState: currState,
        });
      }
    }
  };

  nextSearchItem = () => {
    const { searchState } = this.state;
    let newIndex = searchState.scrollIndex - 1;
    let newSearchCount = searchState.searchIndex - 1;
    let markedIDs = searchState.markedIDs;
    let indexLimit = searchState.scrollLimit;
    let ul = this.messageList;
    if (newSearchCount <= 0) {
      newSearchCount = indexLimit;
    }
    if (markedIDs && ul && newIndex >= 0) {
      let currState = searchState;
      currState.scrollIndex = newIndex;
      currState.searchIndex = newSearchCount;
      currState.scrollID = markedIDs[newIndex];
      this.setState({
        searchState: currState,
      });
    }
    if (markedIDs && ul && newIndex === 0) {
      let currState = searchState;
      newIndex = indexLimit;
      currState.scrollIndex = newIndex;
      currState.searchIndex = 1;
    }
    if (markedIDs && ul && newIndex < 0) {
      let currState = searchState;
      newIndex = indexLimit;
      currState.scrollIndex = newIndex;
      currState.searchIndex = 1;
      newIndex = searchState.scrollIndex - 1;
      newSearchCount = searchState.searchIndex - 1;
      markedIDs = searchState.markedIDs;
      indexLimit = searchState.scrollLimit;
      ul = this.messageList;
      if (newSearchCount <= 0) {
        newSearchCount = indexLimit;
      }
      if (markedIDs && ul && newIndex >= 0) {
        currState = searchState;
        currState.scrollIndex = newIndex;
        currState.searchIndex = newSearchCount;
        currState.scrollID = markedIDs[newIndex];
        this.setState({
          searchState: currState,
        });
      }
    }
  };

  openSearch = () => {
    let { searchState } = this.state;
    const { messagesByID, actions } = this.props;
    searchState.markedMessagesByID = messagesByID;
    actions.closeSnackBar();
    this.setState({
      search: true,
      searchState,
    });
  };

  exitSearch = () => {
    let { searchState } = this.state;
    const { actions } = this.props;
    searchState.searchText = '';
    searchState.searchIndex = 0;
    searchState.scrollLimit = 0;
    actions.closeSnackBar();
    this.setState({
      search: false,
      searchState,
    });
  };

  getMessageListItem = (
    messages,
    messagesByID,
    showLoading,
    addYouTube,
    markID,
  ) => {
    // markID indicates search mode on
    if (markID) {
      return messages.map(id => {
        return (
          <MessageListItem
            key={id}
            message={messagesByID[id]}
            markID={markID}
            addYouTube={addYouTube}
          />
        );
      });
    }

    // Get message ID waiting for server response
    let latestUserMsgID = null;
    if (showLoading && messages) {
      latestUserMsgID = messages[messages.length - 1];
    }

    const latestMessageID = messages[messages.length - 1];

    // return the list of messages
    return messages.map(id => {
      if (id !== latestMessageID) {
        return (
          <MessageListItem
            key={id}
            message={messagesByID[id]}
            latestUserMsgID={latestUserMsgID}
            latestMessage={false}
            addYouTube={addYouTube}
          />
        );
      }
      return (
        <MessageListItem
          key={id}
          message={messagesByID[id]}
          latestUserMsgID={latestUserMsgID}
          latestMessage={true}
          addYouTube={addYouTube}
        />
      );
    });
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

  getLoadingGIF = () => {
    const LoadingComponent = (
      <li className="message-list-item">
        <section className="message-container SUSI">
          <img
            src={loadingGIF}
            style={{ height: '10px', width: 'auto' }}
            alt="please wait.."
          />
        </section>
      </li>
    );
    return LoadingComponent;
  };

  render() {
    const {
      dream,
      speechOutput,
      speechOutputAlways,
      theme,
      customThemeValue,
      messages,
      messagesByID,
      loadingHistory,
      backgroundImage,
      messageBackgroundImage,
      loadingReply,
    } = this.props;
    const { search, searchState, showScrollTop, showScrollBottom } = this.state;
    const {
      scrollBottomStyle,
      scrollTopStyle,
      messageBackgroundStyles,
    } = styles;

    const {
      header,
      pane,
      body,
      composer,
      textarea,
      button,
      textColor,
    } = customThemeValue;

    document.body.style.setProperty(
      'background-color',
      theme === 'dark' ? 'rgb(0, 0, 18)' : body,
    );
    document.body.style.setProperty(
      'background-image',
      `url("${backgroundImage}")`,
    );

    let messageListItems = [];
    if (search) {
      const markID = searchState.scrollID;
      const markedMessagesByID = searchState.markedMessagesByID;
      messageListItems = this.getMessageListItem(
        messages,
        markedMessagesByID,
        false,
        this.addYouTube,
        markID,
      );
    } else {
      messageListItems = this.getMessageListItem(
        messages,
        messagesByID,
        loadingReply,
        this.addYouTube,
        null,
      );
    }

    return (
      <div className={theme} style={{ background: body }}>
        <header>
          <TopBar
            header={header}
            {...this.props}
            ref={instance => {
              this.child = instance;
            }}
            searchTextChanged={this.searchTextChanged}
            openSearch={this.openSearch}
            exitSearch={this.exitSearch}
            nextSearchItem={this.nextSearchItem}
            previousSearchItem={this.previousSearchItem}
            search={search}
            searchState={searchState}
          />
        </header>

        <div>
          <div className="message-pane">
            <div className="message-section">
              {loadingHistory ? (
                <div className="loader-container">
                  <CircularProgress size={64} />
                </div>
              ) : (
                <div>
                  <ul
                    className="message-list"
                    ref={c => {
                      this.messageList = c;
                    }}
                    style={{
                      ...messageBackgroundStyles,
                      backgroundColor: pane,
                      backgroundImage: `url(${messageBackgroundImage})`,
                    }}
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
                      {!search && loadingReply && this.getLoadingGIF()}
                    </Scrollbars>
                  </ul>
                  {showScrollTop && (
                    <div>
                      <FloatingActionButton
                        mini={true}
                        style={scrollTopStyle.button}
                        backgroundColor={body}
                        iconStyle={{
                          fill: theme === 'light' ? '#90a4ae' : '#000000',
                        }}
                        onClick={this.scrollToTop}
                      >
                        <NavigateUp />
                      </FloatingActionButton>
                    </div>
                  )}
                  {showScrollBottom && (
                    <div className="scrollBottom">
                      <FloatingActionButton
                        mini={true}
                        style={scrollBottomStyle.button}
                        backgroundColor={body}
                        iconStyle={{
                          fill: theme === 'light' ? '#90a4ae' : '#000000',
                        }}
                        onClick={this.scrollToBottom}
                      >
                        <NavigateDown />
                      </FloatingActionButton>
                    </div>
                  )}
                </div>
              )}
              <div className="compose" style={{ backgroundColor: composer }}>
                <MessageComposer
                  focus={!search}
                  dream={dream}
                  textarea={textarea}
                  textcolor={textColor}
                  speechOutput={speechOutput}
                  speechOutputAlways={speechOutputAlways}
                  micColor={button}
                />
              </div>
            </div>
          </div>
          {/*  Tour Dialog is handled by this components */}
          {!search ? <DialogSection /> : null}
        </div>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    ...store.messages,
    ...store.settings,
    modalProps: store.ui.modalProps,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(addUrlProps({ urlPropsQueryConfig })(MessageSection));

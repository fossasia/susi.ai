import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';
import CircularLoader from '../../shared/CircularLoader';
import Fab from '@material-ui/core/Fab';
import NavigateDown from '@material-ui/icons/ExpandMore';
import NavigateUp from '@material-ui/icons/ExpandLess';
import TopBar from '../TopBar.react';
import MessageComposer from '../MessageComposer.react';
import loadingGIF from '../../../images/loading.gif';
import MessageListItem from '../MessageListItem/MessageListItem.react';
import { searchMessages } from '../../../utils/searchMessages';
import { bindActionCreators } from 'redux';
import uiActions from '../../../redux/actions/ui';
import styled from 'styled-components';
import getCustomThemeColors from '../../../utils/colors';
import MessageBubble from '../MessageListItem/MessageBubbleStyle';

const MessageList = styled.div`
  background: ${props => props.pane};
  position: fixed;
  top: 3rem;
  left: 0;
  bottom: 4.6rem;
  right: 0;
  width: 100vw;
  max-width: 44rem;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0;
  margin: 0 auto;
  height: auto;
  background-image: ${props => `url(${props.messageBackgroundImage})`};
  background-repeat: 'no-repeat';
  background-size: '100% 100%';
`;

const ScrollBottomFab = styled(Fab)`
  float: right;
  margin-right: 0.4rem;
  margin-bottom: 0.5rem;
  box-shadow: none;
  background-color: ${props => props.backgroundColor};
  border: 0.45px solid darkgray;
`;

const ScrollTopFab = styled(Fab)`
  float: left;
  margin-left: 0.4rem;
  margin-top: 0.5rem;
  box-shadow: none;
  background-color: ${props => props.backgroundColor};
  border: 0.45px solid darkgray;
`;

const MessageComposeContainer = styled.div`
  position: fixed;
  bottom: 0;
  margin: 0;
  border: none;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  box-shadow: 0 -1px 4px 0 rgba(0, 0, 0, 0.12);
  z-index: 2;
  transform: translate3d(0140px, 0);
  transition: transform 0.25s cubic-bezier(0, 0, 0.3, 1) 0.3s;
  pointer-events: auto;
  opacity: 1;
  width: 100vw;
  max-width: 44rem;
  overflow-x: hidden;
  overflow-y: hidden;
  background: ${props => props.backgroundColor};
  color: ${props => (props.theme === 'dark' ? 'white' : 'black')};
  min-height: 4.625rem;
`;

const MessageSectionContainer = styled.div`
  position: fixed;
  top: 2.875rem;
  left: 0;
  bottom: 0;
  right: 0;
  margin: 0 auto;
  width: 100vw;
  max-width: 44rem;
  overflow-x: hidden;
  overflow-y: hidden;
  box-shadow: 0 0.1875rem 0.375rem rgba(0, 0, 0, 0.16),
    0 3px 6px rgba(0, 0, 0, 0.23);
`;

const ScrollBottomContainer = styled.div`
  position: fixed;
  margin: 0;
  border: none;
  width: 100vw;
  max-width: 43.75rem;
  bottom: 4.7rem;
  overflow-x: hidden;
  overflow-y: hidden;
`;

const MessageContainer = styled.li`
  display: flex;
  margin: 0.3125rem;
  overflow-wrap: break-word;
`;

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
    messages: PropTypes.array,
    messagesByID: PropTypes.object,
    loadingHistory: PropTypes.bool,
    loadingReply: PropTypes.bool,
    openSnackBar: PropTypes.func,
    closeSnackBar: PropTypes.func,
    backgroundImage: PropTypes.string,
    messageBackgroundImage: PropTypes.string,
    actions: PropTypes.object,
    customThemeValues: PropTypes.object,
    accessToken: PropTypes.string,
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
    const { messages, accessToken } = this.props;
    if (search) {
      if (searchState.scrollIndex === -1 || searchState.scrollIndex === null) {
        this.scrollToBottom();
      } else {
        const markedIDs = searchState.markedIDs;
        const markedIndices = searchState.markedIndices;
        const limit = searchState.scrollLimit;
        const ul = this.messageList;
        if (markedIDs && ul && limit > 0) {
          const currentID = markedIndices[searchState.searchIndex - 1];
          this.scrollarea.view.childNodes[currentID].scrollIntoView();
        }
      }
    } else if (prevProps.messages.length !== messages.length) {
      this.scrollToBottom();
    }

    if (accessToken !== prevProps.accessToken) {
      this.exitSearch();
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
    if (newIndex > indexLimit) {
      newIndex = 1;
    }
    let markedIDs = searchState.markedIDs;
    let ul = this.messageList;
    if (newSearchCount <= 0) {
      newSearchCount = indexLimit;
    }

    if (markedIDs && ul && newIndex <= indexLimit) {
      let currState = searchState;
      currState.scrollIndex = newIndex;
      currState.searchIndex = newSearchCount;
      currState.scrollID = markedIDs[newIndex];
      this.setState({
        searchState: currState,
      });
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
      <MessageContainer>
        <MessageBubble author={'SUSI'}>
          <img
            src={loadingGIF}
            style={{ height: '10px', width: 'auto' }}
            alt="please wait.."
          />
        </MessageBubble>
      </MessageContainer>
    );
    return LoadingComponent;
  };

  render() {
    const {
      dream,
      speechOutput,
      speechOutputAlways,
      theme,
      messages,
      messagesByID,
      loadingHistory,
      backgroundImage,
      messageBackgroundImage,
      loadingReply,
      customThemeValues,
    } = this.props;
    const {
      header,
      pane,
      body,
      composer,
      button,
      textarea,
    } = getCustomThemeColors({ theme, customThemeValues });
    const { search, searchState, showScrollTop, showScrollBottom } = this.state;

    document.body.style.setProperty('background-color', body);
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
            searchTextChanged={this.searchTextChanged}
            openSearch={this.openSearch}
            exitSearch={this.exitSearch}
            nextSearchItem={this.nextSearchItem}
            previousSearchItem={this.previousSearchItem}
            search={search}
            searchState={searchState}
          />
        </header>
        <MessageSectionContainer>
          {loadingHistory ? (
            <CircularLoader height={38} />
          ) : (
            <div>
              <MessageList
                ref={c => {
                  this.messageList = c;
                }}
                pane={pane}
                messageBackgroundImage={messageBackgroundImage}
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
              </MessageList>
              {showScrollTop && (
                <ScrollTopFab
                  size="small"
                  backgroundcolor={body}
                  color={theme === 'light' ? 'inherit' : 'secondary'}
                  onClick={this.scrollToTop}
                >
                  <NavigateUp />
                </ScrollTopFab>
              )}
              {showScrollBottom && (
                <ScrollBottomContainer>
                  <ScrollBottomFab
                    size="small"
                    backgroundcolor={body}
                    color={theme === 'light' ? 'inherit' : 'secondary'}
                    onClick={this.scrollToBottom}
                  >
                    <NavigateDown />
                  </ScrollBottomFab>
                </ScrollBottomContainer>
              )}
            </div>
          )}
          <MessageComposeContainer backgroundColor={composer} theme={theme}>
            <MessageComposer
              focus={!search}
              dream={dream}
              speechOutput={speechOutput}
              speechOutputAlways={speechOutputAlways}
              micColor={button}
              textarea={textarea}
              exitSearch={this.exitSearch}
            />
          </MessageComposeContainer>
        </MessageSectionContainer>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    ...store.messages,
    ...store.settings,
    ...store.app,
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

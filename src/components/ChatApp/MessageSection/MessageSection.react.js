import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';
import CircularLoader from '../../shared/CircularLoader';
import Fab from '@material-ui/core/Fab';
import NavigateDown from '@material-ui/icons/ExpandMore';
import NavigateUp from '@material-ui/icons/ExpandLess';
import MessageComposer from '../MessageComposer.react';
import loadingGIF from '../../../images/loading.gif';
import MessageListItem from '../MessageListItem/MessageListItem.react';
import ExpandingSearchField from '../SearchField.react';
import { searchMessages } from '../../../utils/searchMessages';
import { bindActionCreators } from 'redux';
import uiActions from '../../../redux/actions/ui';
import skillActions from '../../../redux/actions/skill';
import messageActions from '../../../redux/actions/messages';
import { getAllUserMessages } from '../../../utils/messageFilter';
import { createMessagePairArray } from '../../../utils/formatMessage';
import styled, { keyframes } from 'styled-components';
import getCustomThemeColors from '../../../utils/colors';
import MessageBubble from '../MessageListItem/MessageBubbleStyle';
import _Close from '@material-ui/icons/Close';
import _FullScreen from '@material-ui/icons/Fullscreen';
import _FullScreenExit from '@material-ui/icons/FullscreenExit';
import { IconButton as _IconButton } from '@material-ui/core';
import ToolTip from '../../shared/ToolTip';

const MessageList = styled.div`
  background: ${props => props.pane};
  position: ${props => (props.showChatPreview ? 'inherit' : 'fixed')};
  top: 3rem;
  left: 0;
  bottom: 4.6rem;
  right: 0;
  width: ${props => (props.showChatPreview ? '376px' : '100vw')};
  max-width: 44rem;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0;
  margin: ${props => (props.showChatPreview ? '0px' : '0 auto')};
  height: ${props =>
    props.showChatPreview ? props.height - 270 + 'px' : 'auto'};
  background-image: ${props => `url(${props.messageBackgroundImage})`};
  background-repeat: 'no-repeat';
  background-size: '100% 100%';
  max-height: ${props => (props.showChatPreview ? '593px' : 'auto')};
  box-shadow: rgba(0, 0, 0, 0.16) 0px 0.1875rem 0.375rem,
    rgba(0, 0, 0, 0.23) 0px 3px 6px;
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
  position: ${props => (props.showChatPreview ? 'absolute' : 'fixed')};
  bottom: 0;
  margin: 0;
  border: none;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  box-shadow: 0 -1px 4px 0 rgba(0, 0, 0, 0.12);
  transform: translate3d(0140px, 0);
  transition: transform 0.25s cubic-bezier(0, 0, 0.3, 1) 0.3s;
  pointer-events: auto;
  opacity: 1;
  width: ${props => (props.showChatPreview ? '376px' : '100vw')};
  max-width: 44rem;
  overflow-x: hidden;
  overflow-y: hidden;
  background: ${props => props.backgroundColor};
  color: ${props => (props.theme === 'dark' ? 'white' : 'black')};
  min-height: 4.625rem;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 0.1875rem 0.375rem,
    rgba(0, 0, 0, 0.23) 0px 3px 6px;
`;

const MessageSectionContainer = styled.div`
  position: ${props => (props.showChatPreview ? 'absolute' : 'relative')};
  left: ${props => (props.showChatPreview ? '-75px' : '0px')};
  bottom: 0;
  right: 0;
  height: ${props =>
    props.showChatPreview ? props.height - 160 + 'px' : 'auto'};
  margin: ${props => (props.showChatPreview ? '0px' : '0 auto')};
  width: ${props => (props.showChatPreview ? '376px' : '100vw')};
  max-width: 44rem;
  overflow-x: hidden;
  overflow-y: hidden;
  max-height: ${props => (props.showChatPreview ? '704px' : 'auto')};
  box-shadow: ${props =>
    props.showChatPreview
      ? 'rgba(0, 0, 0, 0.16) 0px 0.1875rem 0.375rem,rgba(0, 0, 0, 0.23) 0px 3px 6px'
      : '0px'};
  border-radius: ${props => (props.showChatPreview ? '4px' : '0px')};
`;

const ScrollBottomContainer = styled.div`
  position: fixed;
  margin: 0;
  border: none;
  width: ${props => (props.showChatPreview ? '376px' : '100vw')};
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

const img = '/customAvatars/0.png';

const SUSILauncherButton = styled.div`
  background-image: url(${img});
  width: 60px;
  height: 60px;
  float: right;
  background-size: 60px;
  border-radius: 50%;
  margin: -1px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.15);
  right: 0;
  background-position: 50%;
  background-repeat: no-repeat;
  cursor: pointer;
  bottom: 15px;
  :after {
    content: '';
    position: absolute;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: #2ecc71;
    bottom: 1px;
    right: -1px;
  }
`;

const launcherFrameAppearKeyframe = keyframes`
0% {
  opacity: 0;
  -webkit-transform: scale(.5);
  transform: scale(.5)
}
to {
  opacity: 1;
  -webkit-transform: scale(1);
  transform: scale(1)
}
`;

const SUSILauncherWrapper = styled.div`
  width: 60px;
  background-size: 60px;
  float: right;
  margin-right: 0%;
  margin-top: 15px;
  border-radius: 5em;
  cursor: pointer;
  position: absolute;
  transition: transform .15s ease-in-out, box-shadow .15s ease-in-out;
  transform: translateY(150px);
  animation: ${launcherFrameAppearKeyframe} .25s ease forwards
  padding: 0;
  height: auto;
  :hover {
    box-shadow: 0 4px 42px 0 rgba(0, 0, 0, .25);
  }
`;

const SUSILauncherContainer = styled.div`
  margin-left: 240px;
`;

const Close = styled(_Close)`
  fill: #fff;
`;

const FullScreen = styled(_FullScreen)`
  fill: #fff;
`;

const FullScreenExit = styled(_FullScreenExit)`
  fill: #fff;
`;

const ActionBar = styled.div`
  width: auto;
  height: 48px;
  background-color: #4285f4;
  padding: ${props =>
    props.showFullScreenChat ? '0.5rem 1rem' : '0.3rem 0.5rem'};
  top: 0px;
  display: flex;
  color: #fff;
  align-items: center;
  font-size: 1rem;
  justify-content: space-between;
  background: ${props => props.headerColor};
`;

const ChatBubbleContainer = styled.div`
  position: fixed;
  top: ${props => props.height - 95 + 'px'};
  right: ${props => (props.width < 1100 ? '80px' : '100px')};
`;

const IconButton = styled(_IconButton)`
  padding: 3.5px;
  color: #fff;
`;

const CustomIconButton = styled(_IconButton)`
  padding: 3.5px;
  color: #fff;
  display: ${props => (props.width < 500 ? 'none' : 'inline')};
`;

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
    customThemeValue: PropTypes.object,
    accessToken: PropTypes.string,
    mode: PropTypes.string, // From UI Reducer for chat
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
      width: window.innerWidth,
      height: window.innerHeight,
      hasScrolled: false,
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

  componentDidMount = async () => {
    const { actions } = this.props;
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    try {
      let { payload } = await actions.getHistoryFromServer();
      let messagePairArray = await createMessagePairArray(payload);
      await actions.initializeMessageStore(messagePairArray);
      const { messagesByID, messages } = this.props;
      this.userMessageHistory = getAllUserMessages(
        messages,
        messagesByID,
        'REVERSE',
      );
      this.scrollarea && this.scrollarea.scrollToBottom();
    } catch (error) {
      actions.initializeMessageStoreFailed();
      console.log(error);
    }
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateWindowDimensions);
  };

  updateWindowDimensions = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  componentDidUpdate(prevProps) {
    const { search, searchState, hasScrolled } = this.state;
    const { messages, accessToken, mode } = this.props;
    if (search && !hasScrolled) {
      if (searchState.scrollIndex === -1 || searchState.scrollIndex === null) {
        this.scrollarea && this.scrollarea.scrollToBottom();
      } else {
        const markedIDs = searchState.markedIDs;
        const markedIndices = searchState.markedIndices;
        const limit = searchState.scrollLimit;
        const ul = this.messageList;
        if (markedIDs && ul && limit > 0 && !hasScrolled) {
          const currentID = markedIndices[searchState.searchIndex - 1];
          this.scrollarea.view.childNodes[currentID].scrollIntoView();
        }
      }
    } else if (
      prevProps.messages.length !== messages.length ||
      prevProps.mode !== mode
    ) {
      this.scrollarea && this.scrollarea.scrollToBottom();
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
    this.scrollToBottom();
    this.setState(prevState => ({ player: [...prevState.player, newPlayer] }));
  };

  onScroll = () => {
    const { showScrollBottom, showScrollTop, search } = this.state;
    if (this.scrollarea) {
      let scrollValues = this.scrollarea.getValues();
      if (scrollValues.top === 0) {
        this.setState({
          showScrollTop: false,
          showScrollBottom: true,
        });
      } else if (!(showScrollBottom && showScrollTop)) {
        this.setState({
          showScrollBottom: true,
          showScrollTop: true,
        });
      } else if (
        scrollValues.scrollHeight - Math.ceil(scrollValues.scrollTop) ===
        scrollValues.clientHeight
      ) {
        this.setState({
          showScrollBottom: false,
          showScrollTop: true,
        });
      }
      if (search) {
        this.setState({
          hasScrolled: true,
        });
      }
    }
  };

  scrollToBottom = (type = 'smooth') => {
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
        hasScrolled: false,
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
        hasScrolled: false,
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
          hasScrolled: false,
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
    pauseAllVideos,
    markID,
  ) => {
    // markID indicates search mode on
    const { mode } = this.props;
    if (markID) {
      return messages.map(id => {
        return (
          <MessageListItem
            key={id}
            message={messagesByID[id]}
            markID={markID}
            addYouTube={addYouTube}
            pauseAllVideos={pauseAllVideos}
            showChatPreview={mode === 'preview'}
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
      return (
        <MessageListItem
          key={id}
          message={messagesByID[id]}
          latestUserMsgID={latestUserMsgID}
          latestMessage={id === latestMessageID}
          addYouTube={addYouTube}
          pauseAllVideos={pauseAllVideos}
          showChatPreview={mode === 'preview'}
          scrollBottom={this.scrollToBottom}
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

  componentWillUnmount() {
    document.body.style.setProperty('background-color', 'white');
  }

  openFullScreen = () => {
    const { actions } = this.props;
    actions.setChatMode({
      mode: 'fullScreen',
    });
  };

  openPreview = () => {
    const { actions } = this.props;
    actions.setChatMode({
      mode: 'preview',
    });
    actions.closeModal();
  };

  toggleChat = () => {
    const { mode, actions } = this.props;
    this.exitSearch();
    actions.setChatMode({
      mode: mode === 'minimize' ? 'preview' : 'minimize',
    });
  };

  handleClose = () => {
    const { actions } = this.props;
    actions.setChatMode({
      mode: 'minimize',
    });
    actions.closeModal();
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
      messageBackgroundImage,
      loadingReply,
      customThemeValue,
      mode,
    } = this.props;

    const {
      header,
      pane,
      body,
      composer,
      button,
      textarea,
    } = getCustomThemeColors({
      theme,
      customThemeValue,
    });
    const {
      search,
      searchState,
      showScrollTop,
      showScrollBottom,
      width,
      height,
    } = this.state;

    let messageListItems = [];
    if (search) {
      const markID = searchState.scrollID;
      const markedMessagesByID = searchState.markedMessagesByID;
      messageListItems = this.getMessageListItem(
        messages,
        markedMessagesByID,
        false,
        this.addYouTube,
        this.pauseAllVideos,
        markID,
      );
    } else {
      messageListItems = this.getMessageListItem(
        messages,
        messagesByID,
        loadingReply,
        this.addYouTube,
        this.pauseAllVideos,
        null,
      );
    }

    const actionBar = (
      <ActionBar
        headerColor={header}
        showFullScreenChat={mode === 'fullScreen'}
      >
        <div>Chat with SUSI.AI</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {searchState && (
            <ExpandingSearchField
              searchText={searchState.searchText}
              searchIndex={searchState.searchIndex}
              open={search}
              searchCount={searchState.scrollLimit}
              onTextChange={this.searchTextChanged}
              activateSearch={this.openSearch}
              exitSearch={this.exitSearch}
              scrollRecent={this.nextSearchItem}
              scrollPrev={this.previousSearchItem}
            />
          )}
          <CustomIconButton width={width}>
            {mode === 'fullScreen' ? (
              <ToolTip title="Exit full screen">
                <FullScreenExit onClick={this.openPreview} />
              </ToolTip>
            ) : (
              <ToolTip title="Full screen">
                <FullScreen onClick={this.openFullScreen} />
              </ToolTip>
            )}
          </CustomIconButton>
          <IconButton
            onClick={mode === 'fullScreen' ? this.handleClose : this.toggleChat}
          >
            <ToolTip title="Close">
              <Close />
            </ToolTip>
          </IconButton>
        </div>
      </ActionBar>
    );

    const messageSection = (
      <MessageSectionContainer
        showChatPreview={mode === 'preview'}
        height={height}
      >
        {loadingHistory ? (
          <CircularLoader height={38} />
        ) : (
          <div>
            {mode === 'preview' && actionBar}
            <MessageList
              ref={c => {
                this.messageList = c;
              }}
              pane={pane}
              messageBackgroundImage={messageBackgroundImage}
              showChatPreview={mode === 'preview'}
              height={height}
            >
              <Scrollbars
                style={{ height: '97%' }}
                renderThumbHorizontal={this.renderThumb}
                renderThumbVertical={this.renderThumb}
                ref={ref => {
                  this.scrollarea = ref;
                }}
                onScroll={this.onScroll}
                autoHide={false}
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
        <MessageComposeContainer
          backgroundColor={composer}
          theme={theme}
          showChatPreview={mode === 'preview'}
        >
          <MessageComposer
            focus={!search}
            dream={dream}
            speechOutput={speechOutput}
            speechOutputAlways={speechOutputAlways}
            micColor={button}
            textarea={textarea}
            exitSearch={this.exitSearch}
            showChatPreview={mode === 'preview'}
          />
        </MessageComposeContainer>
      </MessageSectionContainer>
    );

    const ChatBubble = (
      <ChatBubbleContainer className="chatbubble" height={height} width={width}>
        {mode === 'preview' ? messageSection : null}
        {mode !== 'fullScreen' ? (
          <SUSILauncherContainer>
            <SUSILauncherWrapper
              onClick={width < 500 ? this.openFullScreen : this.toggleChat}
            >
              <SUSILauncherButton data-tip="Toggle Launcher" />
            </SUSILauncherWrapper>
          </SUSILauncherContainer>
        ) : null}
      </ChatBubbleContainer>
    );

    return (
      <Fragment>
        {mode === 'fullScreen' ? (
          <Fragment>
            {actionBar}
            {messageSection}
          </Fragment>
        ) : (
          ChatBubble
        )}
      </Fragment>
    );
  }
}

function mapStateToProps(store) {
  return {
    ...store.messages,
    ...store.settings,
    ...store.app,
    ...store.ui,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...uiActions, ...skillActions, ...messageActions },
      dispatch,
    ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(addUrlProps({ urlPropsQueryConfig })(MessageSection));

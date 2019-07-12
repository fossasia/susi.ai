import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';
import CircularLoader from '../../shared/CircularLoader';
import Fab from '@material-ui/core/Fab';
import NavigateDown from '@material-ui/icons/ExpandMore';
import NavigateUp from '@material-ui/icons/ExpandLess';
import NavigationBar from '../../NavigationBar';
import MessageComposer from '../MessageComposer.react';
import loadingGIF from '../../../images/loading.gif';
import MessageListItem from '../MessageListItem/MessageListItem.react';
import { searchMessages } from '../../../utils/searchMessages';
import { bindActionCreators } from 'redux';
import uiActions from '../../../redux/actions/ui';
import styled, { keyframes } from 'styled-components';
import getCustomThemeColors from '../../../utils/colors';
import MessageBubble from '../MessageListItem/MessageBubbleStyle';
import _Close from '@material-ui/icons/Close';
import _FullScreen from '@material-ui/icons/Fullscreen';
import _FullScreenExit from '@material-ui/icons/FullscreenExit';

const MessageList = styled.div`
  background: ${props => props.pane};
  position: ${props => (props.showChatBubble ? 'inherit' : 'fixed')};
  top: 3rem;
  left: 0;
  bottom: 4.6rem;
  right: 0;
  width: ${props => (props.showChatBubble ? '376px' : '100vw')};
  max-width: 44rem;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0;
  margin: ${props => (props.showChatBubble ? '0px' : '0 auto')};
  height: ${props =>
    props.showChatBubble ? props.height - 270 + 'px' : 'auto'};
  background-image: ${props => `url(${props.messageBackgroundImage})`};
  background-repeat: 'no-repeat';
  background-size: '100% 100%';
  max-height: ${props => (props.showChatBubble ? '593px' : 'auto')};
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
  position: ${props => (props.showChatBubble ? 'absolute' : 'fixed')};
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
  width: ${props => (props.showChatBubble ? '376px' : '100vw')};
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
  position: ${props => (props.showChatBubble ? 'absolute' : 'relative')};
  left: ${props => (props.showChatBubble ? '-75px' : '0px')};
  bottom: 0;
  right: 0;
  height: ${props =>
    props.showChatBubble ? props.height - 160 + 'px' : 'auto'};
  margin: ${props => (props.showChatBubble ? '0px' : '0 auto')};
  width: ${props => (props.showChatBubble ? '376px' : '100vw')};
  max-width: 44rem;
  overflow-x: hidden;
  overflow-y: hidden;
  max-height: ${props => (props.showChatBubble ? '704px' : 'auto')};
  box-shadow: ${props =>
    props.showChatBubble
      ? 'rgba(0, 0, 0, 0.16) 0px 0.1875rem 0.375rem,rgba(0, 0, 0, 0.23) 0px 3px 6px'
      : '0px'};
`;

const ScrollBottomContainer = styled.div`
  position: fixed;
  margin: 0;
  border: none;
  width: ${props => (props.showChatBubble ? '376px' : '100vw')};
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
  fill: white;
  cursor: pointer;
  margin: 0px 4px;
`;

const FullScreen = styled(_FullScreen)`
  fill: white;
  cursor: pointer;
  display: ${props => (props.width < 500 ? 'none' : 'inline')};
`;

const FullScreenExit = styled(_FullScreenExit)`
  fill: white;
  cursor: pointer;
  display: ${props => (props.width < 500 ? 'none' : 'inline')};
`;

const ActionBar = styled.div`
  width: auto;
  height: ${props => (props.fullScreenChat ? '48px' : '40px')};
  background-color: #696969;
  padding: ${props => (props.fullScreenChat ? '12px 0px' : '10px 0px')};
  text-align: right;
  top: 0px;
`;

const ChatBubbleContainer = styled.div`
  position: fixed;
  top: ${props => props.height - 95 + 'px'};
  right: ${props => (props.width < 1100 ? '80px' : '100px')};
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
    customThemeValues: PropTypes.object,
    accessToken: PropTypes.string,
    showChatBubble: PropTypes.bool, // From ChatApp Component present in App.js
    chatBubble: PropTypes.string, // From UI Reducer
    fullScreenChat: PropTypes.bool,
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

  componentDidMount = () => {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
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
    const { showChatBubble } = this.props;
    if (markID) {
      return messages.map(id => {
        return (
          <MessageListItem
            key={id}
            message={messagesByID[id]}
            markID={markID}
            addYouTube={addYouTube}
            showChatBubble={showChatBubble}
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
            showChatBubble={showChatBubble}
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
          showChatBubble={showChatBubble}
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
    actions.handleChatBubble({
      chatBubble: 'minimised',
    });
    actions.openModal({
      modalType: 'chatBubble',
      fullScreenChat: true,
    });
  };

  closeFullScreen = () => {
    const { actions } = this.props;
    actions.handleChatBubble({
      chatBubble: 'full',
    });
    actions.closeModal();
  };

  toggleChat = () => {
    const { actions, chatBubble } = this.props;
    actions.handleChatBubble({
      chatBubble: chatBubble === 'bubble' ? 'full' : 'bubble',
    });
  };

  handleClose = () => {
    const { actions } = this.props;
    actions.handleChatBubble({ chatBubble: 'bubble' });
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
      customThemeValues,
      showChatBubble,
      chatBubble,
      fullScreenChat,
    } = this.props;
    const {
      header,
      pane,
      body,
      composer,
      button,
      textarea,
    } = getCustomThemeColors({ theme, customThemeValues });
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

    const actionBar = (
      <ActionBar fullScreenChat={fullScreenChat}>
        {fullScreenChat !== undefined ? (
          <FullScreenExit onClick={this.closeFullScreen} width={width} />
        ) : (
          <FullScreen onClick={this.openFullScreen} width={width} />
        )}
        <Close onClick={fullScreenChat ? this.handleClose : this.toggleChat} />
      </ActionBar>
    );

    const messageSection = (
      <MessageSectionContainer showChatBubble={showChatBubble} height={height}>
        {loadingHistory ? (
          <CircularLoader height={38} />
        ) : (
          <div>
            {fullScreenChat ? null : actionBar}
            <MessageList
              ref={c => {
                this.messageList = c;
              }}
              pane={pane}
              messageBackgroundImage={messageBackgroundImage}
              showChatBubble={showChatBubble}
              height={height}
            >
              <Scrollbars
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
          showChatBubble={showChatBubble}
        >
          <MessageComposer
            focus={!search}
            dream={dream}
            speechOutput={speechOutput}
            speechOutputAlways={speechOutputAlways}
            micColor={button}
            textarea={textarea}
            exitSearch={this.exitSearch}
            showChatBubble={showChatBubble}
          />
        </MessageComposeContainer>
      </MessageSectionContainer>
    );

    const Chat = (
      <ChatBubbleContainer className="chatbubble" height={height} width={width}>
        {chatBubble === 'full' ? messageSection : null}
        {chatBubble !== 'minimised' ? (
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

    const navigationBar = (
      <NavigationBar
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
    );

    return (
      <div>
        {showChatBubble === undefined && fullScreenChat === undefined ? (
          <div>
            {navigationBar}
            {messageSection}
          </div>
        ) : null}
        {showChatBubble ? Chat : null}
        {fullScreenChat ? actionBar : null}
        {fullScreenChat ? messageSection : null}
      </div>
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
    actions: bindActionCreators(uiActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(addUrlProps({ urlPropsQueryConfig })(MessageSection));

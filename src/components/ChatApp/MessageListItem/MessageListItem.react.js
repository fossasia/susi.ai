import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../../../redux/actions/messages';
import { generateMessageBubble } from './generateMessageBubbleUtil';

class MessageListItem extends React.Component {
  static propTypes = {
    message: PropTypes.object,
    markID: PropTypes.string,
    latestMessage: PropTypes.bool,
    latestUserMsgID: PropTypes.string,
    addYouTube: PropTypes.func,
    speechRate: PropTypes.number,
    speechPitch: PropTypes.number,
    ttsLanguage: PropTypes.string,
    actions: PropTypes.object,
    userGeoData: PropTypes.object,
    showChatBubble: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      play: false,
      width: this.props.showChatBubble ? 234 : 384,
      height: this.props.showChatBubble ? 168 : 240,
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
    const { showChatBubble } = this.props;
    this.setState({
      width:
        window.innerWidth > 488 && showChatBubble === undefined ? 384 : 234,
      height:
        window.innerWidth > 488 && showChatBubble === undefined ? 240 : 168,
    });
  };

  onYouTubePlayerReady = event => {
    const { addYouTube } = this.props;
    addYouTube(event);
  };

  // Triggered when the voice player is started
  onTextToSpeechStart = () => {
    this.setState({ play: true });
  };

  // Triggered when the voice player has finished
  onTextToSpeechEnd = () => {
    const { actions } = this.props;
    actions.resetMessageVoice();
    this.setState({ play: false });
  };

  getUserGeoData = () => {
    this.props.actions.getUserGeoData();
  };

  render() {
    const {
      message,
      latestUserMsgID = '',
      markID,
      ttsLanguage,
      speechPitch,
      speechRate,
      latestMessage,
      userGeoData,
    } = this.props;
    const { width, height } = this.state;
    return generateMessageBubble(
      message,
      latestUserMsgID,
      markID,
      ttsLanguage,
      speechPitch,
      speechRate,
      latestMessage,
      width,
      height,
      userGeoData,
      this.onTextToSpeechStart,
      this.onTextToSpeechEnd,
      this.onYouTubePlayerReady,
      this.getUserGeoData,
    );
  }
}

function mapStateToProps(store) {
  const { speechRate, speechPitch, ttsLanguage } = store.settings;
  const { userGeoData } = store.messages;
  return {
    speechRate,
    speechPitch,
    ttsLanguage,
    userGeoData,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MessageListItem);

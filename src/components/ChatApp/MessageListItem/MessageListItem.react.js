import React from 'react';
import PropTypes from 'prop-types';
import Emojify from 'react-emojione';
import TextHighlight from 'react-text-highlight';
import { AllHtmlEntities } from 'html-entities';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  imageParse,
  processText,
  renderTiles,
  drawMap,
  drawTable,
  renderMessageFooter,
  renderAnchor,
} from './helperFunctions.react.js';
import actions from '../../../redux/actions/messages';
import VoicePlayer from './VoicePlayer';
import { injectIntl } from 'react-intl';
import YouTube from 'react-youtube';
import { getDefaultMapData } from '../../../apis';

// Format Date for internationalization
const PostDate = injectIntl(({ date, intl }) => (
  <span
    title={intl.formatDate(date, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    })}
  >
    {intl.formatDate(date, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    })}
  </span>
));

const entities = new AllHtmlEntities();

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
    resetMessageVoice: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      play: false,
      width: 384,
      height: 234,
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
      width: window.innerWidth > 488 ? 384 : 234,
      height: window.innerWidth > 488 ? 240 : 168,
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
    const { resetMessageVoice } = this.props.actions;
    resetMessageVoice();
    this.setState({ play: false });
  };

  generateDateBubble(message) {
    return (
      <div className="message-list-item">
        <section className="container-date">
          <div className="message-text">
            <PostDate date={message.date} />
          </div>
        </section>
      </div>
    );
  }

  generateGifBubble(
    action,
    index,
    messageContainerClasses,
    gifSource,
    message,
    latestUserMsgID,
    showFeedback,
  ) {
    return (
      <div className="message-list-item" key={action + index}>
        <section className={messageContainerClasses}>
          <div className="message-text">
            <iframe src={gifSource} frameBorder="0" allowFullScreen />
          </div>
          {renderMessageFooter(message, latestUserMsgID, showFeedback)}
        </section>
      </div>
    );
  }

  generateAnswerBubble(
    action,
    index,
    messageContainerClasses,
    replacedText,
    message,
    latestUserMsgID,
    showFeedback,
  ) {
    return (
      <div className="message-list-item" key={action + index}>
        <section className={messageContainerClasses}>
          <div className="message-text">{replacedText}</div>
          {renderMessageFooter(message, latestUserMsgID, showFeedback)}
        </section>
      </div>
    );
  }

  generateAnchorBubble(
    action,
    index,
    messageContainerClasses,
    text,
    link,
    message,
    latestUserMsgID,
    showFeedback,
  ) {
    return (
      <div className="message-list-item" key={action + index}>
        <section className={messageContainerClasses}>
          <div className="message-text">{renderAnchor(text, link)}</div>
          {renderMessageFooter(message, latestUserMsgID, showFeedback)}
        </section>
      </div>
    );
  }

  generateMapBubble(
    action,
    index,
    messageContainerClasses,
    replacedText,
    mapAnchor,
    mymap,
    message,
    latestUserMsgID,
    showFeedback,
  ) {
    return (
      <div className="message-list-item" key={action + index}>
        <section className={messageContainerClasses} style={{ width: '80%' }}>
          <div className="message-text">{replacedText}</div>
          <div>{mapAnchor}</div>
          <br />
          <div>{mymap}</div>
          {renderMessageFooter(message, latestUserMsgID, showFeedback)}
        </section>
      </div>
    );
  }

  generateTableBubble(
    action,
    index,
    messageContainerClasses,
    table,
    message,
    latestUserMsgID,
    showFeedback,
  ) {
    return (
      <div className="message-list-item" key={action + index}>
        <section className={messageContainerClasses}>
          <div>
            <div className="message-text">{table}</div>
          </div>
          {renderMessageFooter(message, latestUserMsgID, showFeedback)}
        </section>
      </div>
    );
  }

  generateVideoBubble(
    action,
    index,
    height,
    width,
    identifier,
    messageContainerClasses,
    latestMessage,
    message,
    latestUserMsgID,
    showFeedback,
  ) {
    return (
      <div
        className="message-list-item"
        key={action + index}
        style={{
          height: height + 56,
        }}
      >
        <section className={messageContainerClasses}>
          <YouTube
            videoId={identifier}
            opts={{
              height: height,
              width: width,
              playerVars: {
                autoplay: latestMessage ? 1 : 0,
              },
            }}
            onReady={this.onYouTubePlayerReady}
          />
          {renderMessageFooter(message, latestUserMsgID, showFeedback)}
        </section>
      </div>
    );
  }

  generateAudioBubble(
    action,
    index,
    messageContainerClasses,
    src,
    message,
    latestUserMsgID,
    showFeedback,
  ) {
    return (
      <div className="message-list-item" key={action + index}>
        <section className={messageContainerClasses}>
          <div className="message-text">
            <iframe src={src} frameBorder="0" allowFullScreen />
          </div>
          {renderMessageFooter(message, latestUserMsgID, showFeedback)}
        </section>
      </div>
    );
  }

  generateWebSearchRssBubble(action, index, data) {
    let sliderClass = 'swipe-rss-websearch';
    if (window.matchMedia('only screen and (max-width: 768px)').matches) {
      // for functionality on screens smaller than 768px
      sliderClass = '';
    }
    return (
      <div className={sliderClass} key={action + index}>
        {renderTiles(data)}
      </div>
    );
  }

  generateMessageBubble(
    message,
    latestUserMsgID,
    markID,
    ttsLanguage,
    speechPitch,
    speechRate,
  ) {
    if (message && message.type === 'date') {
      return this.generateDateBubble(message);
    }

    const stringWithLinks = message ? message.text : '';

    let replacedText = '';
    let markMsgID = markID;
    if (message && message.hasOwnProperty('mark') && markMsgID) {
      let matchString = message.mark.searchText;
      let isCaseSensitive = message.mark.isCaseSensitive;
      if (stringWithLinks) {
        let htmlText = entities.decode(stringWithLinks);
        let imgText = imageParse(htmlText);
        let markedText = [];
        let matchStringarr = [];
        matchStringarr.push(matchString);
        imgText.forEach((part, key) => {
          if (typeof part === 'string') {
            if (message.id === markMsgID) {
              markedText.push(
                <TextHighlight
                  key={key}
                  highlight={matchString}
                  text={part}
                  markTag="em"
                  caseSensitive={isCaseSensitive}
                />,
              );
            } else {
              markedText.push(
                <TextHighlight
                  key={key}
                  highlight={matchString}
                  text={part}
                  caseSensitive={isCaseSensitive}
                />,
              );
            }
          } else {
            markedText.push(part);
          }
        });
        replacedText = <Emojify>{markedText}</Emojify>;
      }
    } else if (stringWithLinks) {
      replacedText = processText(stringWithLinks);
    }
    let messageContainerClasses = '';
    if (message) {
      messageContainerClasses = 'message-container ' + message.authorName;
    }
    if (message && message.hasOwnProperty('response')) {
      if (Object.keys(message.response).length > 0) {
        const answer = message.response.answers[0];
        let actions = message.actions;
        let listItems = [];
        let mapIndex = actions.indexOf('map');

        let mapAnchor = null;
        if (actions.indexOf('map') > -1) {
          if (actions.indexOf('anchor')) {
            const anchorIndex = actions.indexOf('anchor');
            const link = answer.actions[anchorIndex].link;
            const text = answer.actions[anchorIndex].text;
            mapAnchor = renderAnchor(text, link);
          }
          actions = ['map'];
        }

        let noResultsFound = false;

        actions.forEach((action, index) => {
          let showFeedback = actions[actions.length - 1] === action;
          switch (action) {
            case 'answer': {
              if (
                actions.indexOf('rss') > -1 ||
                actions.indexOf('websearch') > -1
              ) {
                showFeedback = true;
              }
              if (answer.data[0].type === 'gif') {
                let gifSource = answer.data[0].embed_url;
                listItems.push(
                  this.generateGifBubble(
                    action,
                    index,
                    messageContainerClasses,
                    gifSource,
                    message,
                    latestUserMsgID,
                    showFeedback,
                  ),
                );
              } else {
                listItems.push(
                  this.generateAnswerBubble(
                    action,
                    index,
                    messageContainerClasses,
                    replacedText,
                    message,
                    latestUserMsgID,
                    showFeedback,
                  ),
                );
              }
              break;
            }
            case 'anchor': {
              const { link, text } = answer.actions[index];
              listItems.push(
                this.generateAnchorBubble(
                  action,
                  index,
                  messageContainerClasses,
                  text,
                  link,
                  message,
                  latestUserMsgID,
                  showFeedback,
                ),
              );
              break;
            }
            case 'map': {
              let { latitude, longitude, zoom } = answer.actions[mapIndex];
              latitude = parseFloat(latitude);
              longitude = parseFloat(longitude);
              zoom = parseFloat(zoom);
              let mymap;
              if (isNaN(latitude) || isNaN(longitude)) {
                getDefaultMapData()
                  .then(response => {
                    mymap = drawMap(
                      response.latitude,
                      response.longitude,
                      zoom,
                    );
                    listItems.push(
                      this.generateMapBubble(
                        action,
                        index,
                        messageContainerClasses,
                        replacedText,
                        mapAnchor,
                        mymap,
                        message,
                        latestUserMsgID,
                        showFeedback,
                      ),
                    );
                  })
                  .catch(error => {
                    console.log(error);
                    mymap = 'Map not found!';
                  });
              } else {
                mymap = drawMap(latitude, longitude, zoom);
              }
              listItems.push(
                this.generateMapBubble(
                  action,
                  index,
                  messageContainerClasses,
                  replacedText,
                  mapAnchor,
                  mymap,
                  message,
                  latestUserMsgID,
                  showFeedback,
                ),
              );
              break;
            }
            case 'table': {
              let { columns, count } = answer.actions[index];
              let table = drawTable(columns, answer.data, count);
              listItems.push(
                this.generateTableBubble(
                  action,
                  index,
                  messageContainerClasses,
                  table,
                  message,
                  latestUserMsgID,
                  showFeedback,
                ),
              );
              break;
            }
            case 'video_play': {
              const { identifier } = answer.actions[index];
              const { latestMessage } = this.props;
              const { width, height } = this.state;
              listItems.push(
                this.generateVideoBubble(
                  action,
                  index,
                  height,
                  width,
                  identifier,
                  messageContainerClasses,
                  latestMessage,
                  message,
                  latestUserMsgID,
                  showFeedback,
                ),
              );
              break;
            }
            case 'audio_play': {
              let identifierType = answer.actions[index].identifier_type;
              const { identifier } = answer.actions[index];
              const src = `https://www.${identifierType}.com/embed/${identifier}?autoplay=1`;
              listItems.push(
                this.generateAudioBubble(
                  action,
                  index,
                  messageContainerClasses,
                  src,
                  message,
                  latestUserMsgID,
                  showFeedback,
                ),
              );
              break;
            }
            case 'rss': {
              const { rssResults } = message;
              if (rssResults.length === 0) {
                noResultsFound = true;
              }
              listItems.push(
                this.generateWebSearchRssBubble(action, index, rssResults),
              );
              break;
            }
            case 'websearch': {
              const { websearchresults } = message;
              if (websearchresults.length === 0) {
                noResultsFound = true;
              }
              listItems.push(
                this.generateWebSearchRssBubble(
                  action,
                  index,
                  websearchresults,
                ),
              );
              break;
            }
            default:
          }
        });

        if (noResultsFound && message.text === 'I found this on the web:') {
          listItems.splice(0, 1);
        }

        // Only set voice Outputs for text responses
        let voiceOutput;
        if (message.text) {
          // Remove all hyper links
          voiceOutput = message.text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
        } else {
          voiceOutput = '';
        }

        let locale = document.documentElement.getAttribute('lang');
        if (!locale) {
          locale = ttsLanguage;
        }

        return (
          <div>
            {listItems}
            {message.voice && (
              <VoicePlayer
                play
                text={voiceOutput}
                rate={speechRate}
                pitch={speechPitch}
                lang={message.lang ? message.lang : locale}
                onStart={this.onStart}
                onEnd={this.onEnd}
              />
            )}
          </div>
        );
      }
    }

    return (
      <div className="message-list-item">
        <section className={messageContainerClasses}>
          <div className="message-text">{replacedText}</div>
          {renderMessageFooter(message, latestUserMsgID, true)}
        </section>
      </div>
    );
  }

  render() {
    const {
      message,
      latestUserMsgID = '',
      markID,
      ttsLanguage,
      speechPitch,
      speechRate,
    } = this.props;
    return this.generateMessageBubble(
      message,
      latestUserMsgID,
      markID,
      ttsLanguage,
      speechPitch,
      speechRate,
    );
  }
}

function mapStateToProps(store) {
  const { speechRate, speechPitch, ttsLanguage } = store.settings;
  return {
    speechRate,
    speechPitch,
    ttsLanguage,
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

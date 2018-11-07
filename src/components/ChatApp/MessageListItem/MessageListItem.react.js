import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import YouTube from 'react-youtube';
import Emojify from 'react-emojione';
import TextHighlight from 'react-text-highlight';
import { AllHtmlEntities } from 'html-entities';
import $ from 'jquery';
import {
  imageParse,
  processText,
  renderTiles,
  drawMap,
  drawTable,
  renderMessageFooter,
  renderAnchor,
} from './helperFunctions.react.js';
import VoicePlayer from './VoicePlayer';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import * as Actions from '../../../actions/';

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
  constructor(props) {
    super(props);
    this.state = {
      play: false,
      width: 384,
      height: 234,
    };
  }
  _onReady = event => {
    this.props.playerAdd(event);
  };

  // Triggered when the voice player is started
  onStart = () => {
    this.setState({ play: true });
  };

  // Triggered when the voice player has finished
  onEnd = () => {
    this.setState({ play: false });
    Actions.resetVoice();
  };

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

  render() {
    const { latestUserMsgID, message, markID } = this.props;

    const opts = {
      height: this.state.height,
      width: this.state.width,
      playerVars: {
        autoplay: this.props.latestMessage ? 1 : 0,
      },
    };

    if (message && message.type === 'date') {
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

    const stringWithLinks = message ? message.text : '';
    const markMsgID = markID;

    let replacedText = '';
    if (message && message.hasOwnProperty('mark') && markMsgID) {
      const matchString = message.mark.matchText;
      const isCaseSensitive = message.mark.isCaseSensitive;
      if (stringWithLinks) {
        const htmlText = entities.decode(stringWithLinks);
        const imgText = imageParse(htmlText);
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
        const data = message.response;
        let actions = message.actions;
        let listItems = [];
        const mapIndex = actions.indexOf('map');
        let mapAnchor = null;
        if (mapIndex > -1) {
          if (actions.indexOf('anchor')) {
            const anchorIndex = actions.indexOf('anchor');
            const link = data.answers[0].actions[anchorIndex].link;
            const text = data.answers[0].actions[anchorIndex].text;
            mapAnchor = renderAnchor(text, link);
          }
          actions = ['map'];
        }
        let noResultsFound = false;
        const lastAction = actions[actions.length - 1];
        actions.forEach((action, index) => {
          let showFeedback = lastAction === action;
          switch (action) {
            case 'answer': {
              if (
                actions.indexOf('rss') > -1 ||
                actions.indexOf('websearch') > -1
              ) {
                showFeedback = true;
              }
              if (data.answers[0].data[0].type === 'gif') {
                let gifSource = data.answers[0].data[0].embed_url;
                listItems.push(
                  <div className="message-list-item" key={action + index}>
                    <section className={messageContainerClasses}>
                      <div className="message-text">
                        <iframe
                          src={gifSource}
                          frameBorder="0"
                          allowFullScreen
                        />
                      </div>
                      {renderMessageFooter(
                        message,
                        latestUserMsgID,
                        showFeedback,
                      )}
                    </section>
                  </div>,
                );
              } else {
                listItems.push(
                  <div className="message-list-item" key={action + index}>
                    <section className={messageContainerClasses}>
                      <div className="message-text">{replacedText}</div>
                      {renderMessageFooter(
                        message,
                        latestUserMsgID,
                        showFeedback,
                      )}
                    </section>
                  </div>,
                );
              }
              break;
            }
            case 'anchor': {
              const link = data.answers[0].actions[index].link;
              const text = data.answers[0].actions[index].text;
              listItems.push(
                <div className="message-list-item" key={action + index}>
                  <section className={messageContainerClasses}>
                    <div className="message-text">
                      {renderAnchor(text, link)}
                    </div>
                    {renderMessageFooter(
                      message,
                      latestUserMsgID,
                      showFeedback,
                    )}
                  </section>
                </div>,
              );
              break;
            }
            case 'map': {
              index = mapIndex;
              const lat = parseFloat(data.answers[0].actions[index].latitude);
              const lng = parseFloat(data.answers[0].actions[index].longitude);
              const zoom = parseFloat(data.answers[0].actions[index].zoom);
              let mymap;
              const mapNotFound = 'Map was not made';
              if (isNaN(lat) || isNaN(lng)) {
                $.ajax({
                  url:
                    'https://cors-anywhere.herokuapp.com/http://freegeoip.net/json/',
                  timeout: 3000,
                  async: true,
                  success: response => {
                    mymap = drawMap(
                      response.latitude,
                      response.longitude,
                      zoom,
                    );
                    listItems.push(
                      <div className="message-list-item" key={action + index}>
                        <section
                          className={messageContainerClasses}
                          style={{ width: '80%' }}
                        >
                          <div className="message-text">{replacedText}</div>
                          <div>{mapAnchor}</div>
                          <br />
                          <div>{mymap}</div>
                          {renderMessageFooter(
                            message,
                            latestUserMsgID,
                            showFeedback,
                          )}
                        </section>
                      </div>,
                    );
                  },
                  error: (xhr, status, error) => {
                    mymap = mapNotFound;
                  },
                });
              } else {
                mymap = drawMap(lat, lng, zoom);
              }
              listItems.push(
                <div className="message-list-item" key={action + index}>
                  <section
                    className={messageContainerClasses}
                    style={{ width: '80%' }}
                  >
                    <div className="message-text">{replacedText}</div>
                    <div>{mapAnchor}</div>
                    <br />
                    <div>{mymap}</div>
                    {renderMessageFooter(
                      message,
                      latestUserMsgID,
                      showFeedback,
                    )}
                  </section>
                </div>,
              );
              break;
            }
            case 'table': {
              const columns = data.answers[0].actions[index].columns;
              const count = data.answers[0].actions[index].count;
              const table = drawTable(columns, data.answers[0].data, count);
              listItems.push(
                <div className="message-list-item" key={action + index}>
                  <section className={messageContainerClasses}>
                    <div>
                      <div className="message-text">{table}</div>
                    </div>
                    {renderMessageFooter(
                      message,
                      latestUserMsgID,
                      showFeedback,
                    )}
                  </section>
                </div>,
              );
              break;
            }
            case 'video_play': {
              const identifier = data.answers[0].actions[index].identifier;
              listItems.push(
                <div
                  className="message-list-item"
                  key={action + index}
                  style={{
                    height: this.state.height + 56,
                  }}
                >
                  <section className={messageContainerClasses}>
                    <YouTube
                      videoId={identifier}
                      opts={opts}
                      onReady={this._onReady}
                    />
                    {renderMessageFooter(
                      message,
                      latestUserMsgID,
                      showFeedback,
                    )}
                  </section>
                </div>,
              );
              break;
            }
            case 'audio_play': {
              const identifierType =
                data.answers[0].actions[index].identifier_type;
              const identifier = data.answers[0].actions[index].identifier;
              const src = `https://www.${identifierType}.com/embed/${identifier}?autoplay=1`;
              listItems.push(
                <div className="message-list-item" key={action + index}>
                  <section className={messageContainerClasses}>
                    <div className="message-text">
                      <iframe src={src} frameBorder="0" allowFullScreen />
                    </div>
                    {renderMessageFooter(
                      message,
                      latestUserMsgID,
                      showFeedback,
                    )}
                  </section>
                </div>,
              );
              break;
            }
            case 'rss': {
              const rssTiles = this.props.message.rssResults;
              if (rssTiles.length === 0) {
                noResultsFound = true;
              }
              let sliderClass = 'swipe-rss-websearch';
              if (
                window.matchMedia('only screen and (max-width: 768px)').matches
              ) {
                // for functionality on screens smaller than 768px
                sliderClass = '';
              }
              listItems.push(
                <div className={sliderClass} key={action + index}>
                  {renderTiles(rssTiles)}
                </div>,
              );
              break;
            }
            case 'websearch': {
              const websearchTiles = this.props.message.websearchresults;
              if (websearchTiles.length === 0) {
                noResultsFound = true;
              }
              let sliderClass = 'swipe-rss-websearch';
              if (
                window.matchMedia('only screen and (max-width: 768px)').matches
              ) {
                // for functionality on screens smaller than 768px
                sliderClass = '';
              }
              listItems.push(
                <div className={sliderClass} key={action + index}>
                  {renderTiles(websearchTiles)}
                </div>,
              );
              break;
            }

            default:
            // do nothing
          }
        });

        if (noResultsFound && message.text === 'I found this on the web:') {
          listItems.splice(0, 1);
        }

        // Only set voice Outputs for text responses
        let voiceOutput;
        if (message.text !== undefined) {
          // Remove all hyper links
          voiceOutput = message.text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
        } else {
          voiceOutput = '';
        }

        let locale = document.documentElement.getAttribute('lang');
        if (locale === null || locale === undefined) {
          locale = UserPreferencesStore.getTTSLanguage();
        }

        const ttsLanguage = message.lang ? message.lang : locale;

        return (
          <div>
            {listItems}
            {message.voice && (
              <VoicePlayer
                play
                text={voiceOutput}
                rate={UserPreferencesStore.getSpeechRate()}
                pitch={UserPreferencesStore.getSpeechPitch()}
                lang={ttsLanguage}
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
}

MessageListItem.propTypes = {
  message: PropTypes.object,
  markID: PropTypes.string,
  latestMessage: PropTypes.bool,
  latestUserMsgID: PropTypes.string,
  playerAdd: PropTypes.func,
};

export default MessageListItem;

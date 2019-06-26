import React from 'react';
import { AllHtmlEntities } from 'html-entities';
import Emojify from 'react-emojione';
import TextHighlight from 'react-text-highlight';
import VoicePlayer from './VoicePlayer';
import YouTube from 'react-youtube';
import { injectIntl } from 'react-intl';
import {
  imageParse,
  processText,
  drawMap,
  drawTable,
  renderMessageFooter,
  renderAnchor,
  renderTiles,
} from './helperFunctions.react.js';
import styled, { css } from 'styled-components';
import MessageBubble from './MessageBubbleStyle';
import './highlight.css';

const DateContainer = styled.section`
  background: #999999;
  color: #fff;
  position: relative;
  min-width: 5rem;
  max-width: 80%;
  font-size: 1.05rem;
  line-height: 1.375rem;
  padding: 0.5rem;
  padding-bottom: 0.25rem;
  margin: 0.25rem;
  border-radius: 0.5rem;
  margin: 0 auto;
  text-align: center;
`;

const MessageContainer = styled.div`
  display: flex;
  margin: 0.3125rem;
  overflow-wrap: break-word;
  ${props =>
    props.height &&
    css`
      height: ${props => props.height + '56'};
    `};
  &a {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }
`;

const entities = new AllHtmlEntities();

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

const generateDateBubble = message => {
  return (
    <MessageContainer>
      <DateContainer>
        <div>
          <PostDate date={message.date} />
        </div>
      </DateContainer>
    </MessageContainer>
  );
};

const generateGifBubble = (
  action,
  index,
  gifSource,
  message,
  latestUserMsgID,
  showFeedback,
) => {
  return (
    <MessageContainer key={action + index}>
      <MessageBubble author={message.authorName}>
        <div>
          <iframe
            src={gifSource}
            title="SUSI features GIF"
            frameBorder="0"
            allowFullScreen
          />
        </div>
        {renderMessageFooter(message, latestUserMsgID, showFeedback)}
      </MessageBubble>
    </MessageContainer>
  );
};

const generateAnswerBubble = (
  action,
  index,
  replacedText,
  message,
  latestUserMsgID,
  showFeedback,
) => {
  return (
    <MessageContainer key={action + index}>
      <MessageBubble author={message.authorName}>
        <div>{replacedText}</div>
        {renderMessageFooter(message, latestUserMsgID, showFeedback)}
      </MessageBubble>
    </MessageContainer>
  );
};

const generateAnchorBubble = (
  action,
  index,
  text,
  link,
  message,
  latestUserMsgID,
  showFeedback,
) => {
  return (
    <MessageContainer key={action + index}>
      <MessageBubble author={message.authorName}>
        <div>{renderAnchor(text, link)}</div>
        {renderMessageFooter(message, latestUserMsgID, showFeedback)}
      </MessageBubble>
    </MessageContainer>
  );
};

const generateMapBubble = (
  action,
  index,
  replacedText,
  mapAnchor,
  mymap,
  message,
  latestUserMsgID,
  showFeedback,
) => {
  return (
    <MessageContainer key={action + index}>
      <MessageBubble author={message.authorName} width={'80%'}>
        <div>{replacedText}</div>
        <div>{mapAnchor}</div>
        <br />
        <div>{mymap}</div>
        {renderMessageFooter(message, latestUserMsgID, showFeedback)}
      </MessageBubble>
    </MessageContainer>
  );
};

const generateTableBubble = (
  action,
  index,
  table,
  message,
  latestUserMsgID,
  showFeedback,
) => {
  return (
    <MessageContainer key={action + index}>
      <MessageBubble author={message.authorName}>
        <div>
          <div>{table}</div>
        </div>
        {renderMessageFooter(message, latestUserMsgID, showFeedback)}
      </MessageBubble>
    </MessageContainer>
  );
};

const generateVideoBubble = (
  action,
  index,
  height,
  width,
  identifier,
  latestMessage,
  message,
  latestUserMsgID,
  showFeedback,
  onYouTubePlayerReady,
) => {
  return (
    <MessageContainer key={action + index}>
      <MessageBubble author={message.authorName}>
        <YouTube
          videoId={identifier}
          opts={{
            height: height,
            width: width,
            playerVars: {
              autoplay: latestMessage ? 1 : 0,
            },
          }}
          onReady={onYouTubePlayerReady}
        />
        {renderMessageFooter(message, latestUserMsgID, showFeedback)}
      </MessageBubble>
    </MessageContainer>
  );
};

const generateAudioBubble = (
  action,
  index,
  src,
  message,
  latestUserMsgID,
  showFeedback,
) => {
  return (
    <MessageContainer key={action + index}>
      <MessageBubble author={message.authorName}>
        <div style={{ margin: '0.6rem 0', height: '7rem' }}>
          <iframe
            id="sc-widget"
            title="SUSI Soundcloud"
            src={`https://w.soundcloud.com/player/?url=${src}&auto_play=true&buying=false&download=false&show_playcount=false&show_comments=false&visual=false&show_artwork=false`}
            width="100%"
            height="120"
            scrolling="no"
            allow="autoplay"
          ></iframe>
        </div>
        {renderMessageFooter(message, latestUserMsgID, showFeedback)}
      </MessageBubble>
    </MessageContainer>
  );
};

const generateWebSearchRssBubble = (action, index, data) => {
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
};

export const generateMessageBubble = (
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
  onTextToSpeechStart,
  onTextToSpeechEnd,
  onYouTubePlayerReady,
  getUserGeoData,
) => {
  if (message && message.type === 'date') {
    return generateDateBubble(message);
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
                markTag="span class=markTag"
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
                generateGifBubble(
                  action,
                  index,
                  gifSource,
                  message,
                  latestUserMsgID,
                  showFeedback,
                ),
              );
            } else {
              listItems.push(
                generateAnswerBubble(
                  action,
                  index,
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
              generateAnchorBubble(
                action,
                index,
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
              /* Check if user's geo data is available or else perform the action */
              if (userGeoData === null) {
                getUserGeoData();
              } else {
                /* Manually providing mapanchor and replacedText
                 fields as schema stiching in reducer*/
                mapAnchor = (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://www.openstreetmap.org/#map=13/${userGeoData.lat}/${userGeoData.lon}`}
                  >
                    Here is a map
                  </a>
                );

                replacedText = 'Your location';
                mymap = drawMap(userGeoData.lat, userGeoData.lon, zoom);
              }
            } else {
              mymap = drawMap(latitude, longitude, zoom);
            }
            listItems.push(
              generateMapBubble(
                action,
                index,
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
              generateTableBubble(
                action,
                index,
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
            listItems.push(
              generateVideoBubble(
                action,
                index,
                height,
                width,
                identifier,
                latestMessage,
                message,
                latestUserMsgID,
                showFeedback,
                onYouTubePlayerReady,
              ),
            );
            break;
          }
          case 'audio_play': {
            const { identifier: src } = answer.actions[index];
            listItems.push(
              generateAudioBubble(
                action,
                index,
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
              generateWebSearchRssBubble(action, index, rssResults),
            );
            break;
          }
          case 'websearch': {
            const { websearchresults } = message;
            if (websearchresults.length === 0) {
              noResultsFound = true;
            }
            listItems.push(
              generateWebSearchRssBubble(action, index, websearchresults),
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
              onStart={onTextToSpeechStart}
              onEnd={onTextToSpeechEnd}
            />
          )}
        </div>
      );
    }
  }

  return (
    <MessageContainer>
      <MessageBubble author={message.authorName}>
        <div>{replacedText}</div>
        {renderMessageFooter(message, latestUserMsgID, true)}
      </MessageBubble>
    </MessageContainer>
  );
};

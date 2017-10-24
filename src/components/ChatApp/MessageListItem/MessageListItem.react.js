import React from 'react';
import PropTypes from 'prop-types';
import Emojify from 'react-emojione';
import TextHighlight from 'react-text-highlight';
import {AllHtmlEntities} from 'html-entities';
import $ from 'jquery';
import { imageParse, processText,
  renderTiles, drawMap, drawTable,
  renderMessageFooter, renderAnchor } from './helperFunctions.react.js';
import VoicePlayer from './VoicePlayer';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import * as Actions from '../../../actions/';
import { injectIntl } from 'react-intl';
// Format Date for internationalization
const PostDate = injectIntl(({date, intl}) => (
            <span title={intl.formatDate(date, {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            })}>
            {intl.formatDate(date, {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            })}
            </span>
));

const entities = new AllHtmlEntities();

class MessageListItem extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      play: false,
    }
  }

  // Triggered when the voice player is started
  onStart = () => {
    this.setState({ play: true });
  }

  // Triggered when the voice player has finished
  onEnd = () => {
    this.setState({ play: false });
    Actions.resetVoice();
  }

  render() {

    let {message} = this.props;
    let latestUserMsgID = null;
    if(this.props.latestUserMsgID){
      latestUserMsgID = this.props.latestUserMsgID;
    }

    if(this.props.message.type === 'date'){
      return(
        <li className='message-list-item'>
          <section  className='container-date'>
          <div className='message-text'>
            <PostDate date={message.date}/>
          </div>
          </section>
        </li>
      );
    }

    let stringWithLinks = this.props.message.text;
    let replacedText = '';
    let markMsgID = this.props.markID;
    if(this.props.message.hasOwnProperty('mark')
       && markMsgID) {
      let matchString = this.props.message.mark.matchText;
      let isCaseSensitive = this.props.message.mark.isCaseSensitive;
      if(stringWithLinks){
        let htmlText = entities.decode(stringWithLinks);
        let imgText = imageParse(htmlText);
        let markedText = [];
        let matchStringarr = [];
        matchStringarr.push(matchString);
        imgText.forEach((part,key)=>{
          if(typeof(part) === 'string'){
            if(this.props.message.id === markMsgID){
              markedText.push(
              <TextHighlight
                key={key}
                highlight={matchString}
                text={part}
                markTag='em'
                caseSensitive={isCaseSensitive}
              />
              );
            }
            else{
             markedText.push(
              <TextHighlight
                key={key}
                highlight={matchString}
                text={part}
                caseSensitive={isCaseSensitive}
              />
              );
            }
          }
          else{
            markedText.push(part);
          }
        });
        replacedText = <Emojify>{markedText}</Emojify>;
      };
    }
    else{
      if(stringWithLinks){
        replacedText = processText(stringWithLinks);
      };
    }
    let messageContainerClasses = 'message-container ' + message.authorName;
    if(this.props.message.hasOwnProperty('response')){
      if(Object.keys(this.props.message.response).length > 0){
        let data = this.props.message.response;
        let actions = this.props.message.actions;
        let listItems = [];
        let mapIndex = actions.indexOf('map');
        let mapAnchor = null;
        if(mapIndex>-1){
          if(actions.indexOf('anchor')){
            let anchorIndex = actions.indexOf('anchor');
            let link = data.answers[0].actions[anchorIndex].link;
            let text = data.answers[0].actions[anchorIndex].text;
            mapAnchor = renderAnchor(text,link);
          }
          actions = ['map'];
        }
        let noResultsFound = false;
        let lastAction = actions[actions.length - 1];
        actions.forEach((action,index)=>{
          let showFeedback = lastAction===action;
          switch(action){
            case 'answer': {
              if(actions.indexOf('rss') > -1 || actions.indexOf('websearch') > -1){
                  showFeedback = true;
              }
              if(data.answers[0].data[0].type === 'gif'){
                let gifSource = data.answers[0].data[0].embed_url;
                listItems.push(
                  <li className='message-list-item' key={action+index}>
                    <section  className={messageContainerClasses}>
                    <div className='message-text'>
                      <iframe src={gifSource}
                        frameBorder="0"
                        allowFullScreen>
                      </iframe>
                    </div>
                      {renderMessageFooter(message,latestUserMsgID,showFeedback)}
                    </section>
                  </li>
                );
              }
              else{
                listItems.push(
                  <li className='message-list-item' key={action+index}>
                    <section  className={messageContainerClasses}>
                    <div className='message-text'>{replacedText}</div>
                      {renderMessageFooter(message,latestUserMsgID,showFeedback)}
                    </section>
                  </li>
                );
              }
              break
            }
            case 'anchor': {
              let link = data.answers[0].actions[index].link;
              let text = data.answers[0].actions[index].text;
              listItems.push(
                <li className='message-list-item' key={action+index}>
                  <section  className={messageContainerClasses}>
                  <div className='message-text'>
                    {renderAnchor(text,link)}
                  </div>
                    {renderMessageFooter(message,latestUserMsgID,showFeedback)}
                  </section>
                </li>
              );
              break
            }
            case 'map': {
              index = mapIndex;
              let lat = parseFloat(data.answers[0].actions[index].latitude);
              let lng = parseFloat(data.answers[0].actions[index].longitude);
              let zoom = parseFloat(data.answers[0].actions[index].zoom);
              let mymap;
              let mapNotFound = 'Map was not made';
              if(isNaN(lat) || isNaN(lng)){
                $.ajax({
                  url: 'https://cors-anywhere.herokuapp.com/http://freegeoip.net/json/',
                  timeout: 3000,
                  async: true,
                  success: function (response) {
                    mymap = drawMap(response.latitude,response.longitude,zoom);
                    listItems.push(
                      <li className='message-list-item' key={action+index}>
                        <section className={messageContainerClasses} style={{'width' : '80%'}}>
                        <div className='message-text'>{replacedText}</div>
                        <div>{mapAnchor}</div>
                        <br/>
                        <div>{mymap}</div>
                          {renderMessageFooter(message,latestUserMsgID,
                                              showFeedback)}
                        </section>
                      </li>
                      );
                  },
                  error: function(xhr, status, error) {
                    mymap = mapNotFound;
                  }
                });
              }
              else{
              mymap = drawMap(lat,lng,zoom);
              }
              listItems.push(
                <li className='message-list-item' key={action+index}>
                  <section className={messageContainerClasses} style={{'width' : '80%'}}>
                  <div className='message-text'>{replacedText}</div>
                  <div>{mapAnchor}</div>
                  <br/>
                  <div>{mymap}</div>
                    {renderMessageFooter(message,latestUserMsgID,showFeedback)}
                  </section>
                </li>
                );
              break
            }
            case 'table': {
              let columns = data.answers[0].actions[index].columns;
              let count = data.answers[0].actions[index].count;
              let table = drawTable(columns,data.answers[0].data,count);
              listItems.push(
                <li className='message-list-item' key={action+index}>
                  <section className={messageContainerClasses}>
                  <div><div className='message-text'>{table}</div></div>
                    {renderMessageFooter(message,latestUserMsgID,showFeedback)}
                  </section>
                </li>
              );
              break
            }
            case 'rss':{
              let rssTiles = this.props.message.rssResults;
              if(rssTiles.length === 0){
                noResultsFound = true;
              }
              let sliderClass = 'swipe-rss-websearch';
              if (window.matchMedia('only screen and (max-width: 768px)').matches){
                // for functionality on screens smaller than 768px
                sliderClass = '';
              }
              listItems.push(
                  <div className={sliderClass} key={action+index}>
                    {renderTiles(rssTiles)}
                  </div>
                );
              break;
            }
            case 'websearch': {
              let websearchTiles = this.props.message.websearchresults;
              if(websearchTiles.length === 0){
                noResultsFound = true;
              }
              let sliderClass = 'swipe-rss-websearch';
              if (window.matchMedia('only screen and (max-width: 768px)').matches){
                // for functionality on screens smaller than 768px
                sliderClass = '';
              }
              listItems.push(
                  <div className={sliderClass} key={action+index}>
                    {renderTiles(websearchTiles)}
                  </div>
                );
              break;
            }

            default:
              // do nothing
          }
        });

        if(noResultsFound && this.props.message.text === 'I found this on the web:'){
          listItems.splice(0,1);
        }

        // Only set voice Outputs for text responses
        let voiceOutput;
        if(this.props.message.text!==undefined){
          // Remove all hyper links
          voiceOutput = this.props.message.text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
        }
        else{
          voiceOutput= '';
        }

        let locale = document.documentElement.getAttribute('lang');
        if(locale === null || locale === undefined){
          locale = UserPreferencesStore.getTTSLanguage();
        }

        let ttsLanguage = this.props.message.lang ?
                          this.props.message.lang : locale;

        return (<div>{listItems}
              { this.props.message.voice &&
               (<VoicePlayer
                  play
                  text={voiceOutput}
                  rate={UserPreferencesStore.getSpeechRate()}
                  pitch={UserPreferencesStore.getSpeechPitch()}
                  lang={ttsLanguage}
                  onStart={this.onStart}
                  onEnd={this.onEnd}
                />)}
              </div>);
      }
    }

    return (
      <li className='message-list-item'>
        <section  className={messageContainerClasses}>
        <div className='message-text'>{replacedText}</div>
          {renderMessageFooter(message,latestUserMsgID,true)}
        </section>
      </li>
    );
  }

};

MessageListItem.propTypes = {
  message: PropTypes.object,
  markID: PropTypes.string,
  latestUserMsgID: PropTypes.string,
};

export default MessageListItem;

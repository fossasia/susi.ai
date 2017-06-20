import React from 'react';
import PropTypes from 'prop-types';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import Linkify from 'react-linkify';
import Emojify from 'react-emojione';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { divIcon } from 'leaflet';
import Paper from 'material-ui/Paper';
import {Carousel} from 'react-responsive-carousel';
import TextHighlight from 'react-text-highlight';

// Linkify the text
export function parseAndReplace(text) {
  return <Linkify properties={{target: '_blank'}}>
    {text}
  </Linkify>;
}

// Decode HTML Spl Chars
function parseHTMLSplChars(text) {
  if(text){
    let map = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#039;': "'"
    };
    return text.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g,
                      function(splChar) {return map[splChar];});
  }
  return text;
}

// Proccess the text for HTML Spl Chars, Images, Links and Emojis
function processText(text){
  if(text){
    let htmlText = parseHTMLSplChars(text);
    let imgText = imageParse(htmlText);
    let replacedText = parseAndReplace(imgText);
    return <Emojify>{replacedText}</Emojify>;
  };
  return text;
}

// Parse text for Image URLs
function imageParse(stringWithLinks){
  let replacePattern = new RegExp([
                      '((?:https?:\\/\\/)(?:[a-zA-Z]{1}',
                      '(?:[\\w-]+\\.)+(?:[\\w]{2,5}))',
                      '(?::[\\d]{1,5})?\\/(?:[^\\s/]+\\/)',
                      '*(?:[^\\s]+\\.(?:jpe?g|gif|png))',
                      '(?:\\?\\w+=\\w+(?:&\\w+=\\w+)*)?)'
                      ].join(''),'gim');
  let splits = stringWithLinks.split(replacePattern);
  let result = [];
  splits.forEach((item,key)=>{
    let checkmatch = item.match(replacePattern);
    if(checkmatch){
      result.push(
        <img key={key} src={checkmatch}
            style={{width:'95%',height:'auto'}} alt=''/>)
    }
    else{
      result.push(item);
    }
  });
  return result;
}

// Draw Tiles for Websearch RSS data
function drawTiles(tilesData){
  let resultTiles = tilesData.map((tile,i) => {
      return(
        <div key={i}>
          <MuiThemeProvider>
            <Paper zDepth={0} className='tile'>
              {tile.icon &&
                (<div className='tile-img-container'>
                  <img src={tile.icon}
                  className='tile-img' alt=''/>
                  </div>
                )}
              <div className='tile-text'>
                <p className='tile-title'>
                  <strong>{processText(tile.title)}</strong>
                </p>
                {processText(tile.description)}<br/>
                <a href={tile.link} target='_blank'
                  rel='noopener noreferrer'
                  className='tile-anchor'>Know more</a>
              </div>
            </Paper>
          </MuiThemeProvider>
        </div>
      );
  });
  return resultTiles;
}

// Render Websearch RSS tiles
function renderTiles(tiles){
  if(tiles.length === 0){
    let noResultFound = 'NO Results Found';
    return(<center>{noResultFound}</center>);
  }
  let resultTiles = drawTiles(tiles);
  return(
    <Carousel
    showThumbs={false}
    infiniteLoop={true}
    emulateTouch={true}
    showStatus={false}
    transitionTime={200}
    axis={'horizontal'}>
      {resultTiles}
    </Carousel>
  );
}

// Fetch RSS data
function getRSSTiles(rssKeys,rssData,count){
  let parseKeys = Object.keys(rssKeys);
  let rssTiles = [];
  let tilesLimit = rssData.length;
  if(count > -1){
    tilesLimit = Math.min(count,rssData.length);
  }
  for(var i=0; i<tilesLimit; i++){
    let respData = rssData[i];
    let tileData = {};
    parseKeys.forEach((rssKey,j)=>{
      tileData[rssKey] = respData[rssKeys[rssKey]];
    });
    rssTiles.push(tileData);
  }
  return rssTiles;
}


function drawTable(coloumns,tableData,count){
  let parseKeys;
  let showColName = true;
  if(coloumns.constructor === Array){
    parseKeys = coloumns;
    showColName = false;
  }
  else{
    parseKeys = Object.keys(coloumns);
  }
  let tableheader = parseKeys.map((key,i) =>{
    return(<TableHeaderColumn key={i}>{coloumns[key]}</TableHeaderColumn>);
  });
  let rowCount = tableData.length;
  if(count > -1){
    rowCount = Math.min(count,tableData.length);
  }
  let rows = [];
  for (var j=0; j < rowCount; j++) {
    let eachrow = tableData[j];
    let rowcols = parseKeys.map((key,i) =>{
      return(
        <TableRowColumn key={i}>
          <Linkify properties={{target:'_blank'}}>
            <abbr title={eachrow[key]}>
              {processText(eachrow[key])}
            </abbr>
          </Linkify>
        </TableRowColumn>
      );
    });
    rows.push(
      <TableRow key={j}>{rowcols}</TableRow>
    );
  }

  const table =
  <MuiThemeProvider>
    <Table selectable={false}>
    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
      { showColName && <TableRow>{tableheader}</TableRow>}
    </TableHeader>
    <TableBody displayRowCheckbox={false}>{rows}</TableBody>
    </Table>
  </MuiThemeProvider>

  return table;
}

// Draw a Map
function drawMap(lat,lng,zoom){
  let position = [lat, lng];
  const icon = divIcon({
    className: 'map-marker-icon',
    iconSize: [35, 35]
  });
  const map = (
   <Map center={position} zoom={zoom}>
      <TileLayer
        attribution=''
        url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
      />
      <ExtendedMarker position={position} icon={icon}>
        <Popup>
          <span><strong>Hello!</strong> <br/> I am here.</span>
        </Popup>
      </ExtendedMarker>
    </Map>
  );
  return map;
}

// Keeps the Map Popup open initially
class ExtendedMarker extends Marker {

  componentDidMount() {
    super.componentDidMount();

    this.leafletElement.openPopup();
  }
}

class MessageListItem extends React.Component {

  render() {
    let {message} = this.props;

    if(this.props.message.type === 'date'){
      return(
        <li className='message-list-item'>
          <section  className='container-date'>
          <div className='message-text'>
            {message.date.toLocaleDateString()}
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
        let htmlText = parseHTMLSplChars(stringWithLinks);
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
        let listItems = []
        actions.forEach((action,index)=>{
          switch(action){
            case 'answer': {
              listItems.push(
                <li className='message-list-item' key={action+index}>
                  <section  className={messageContainerClasses}>
                  <div className='message-text'>{replacedText}</div>
                  <div className='message-time'>
                    {message.date.toLocaleTimeString()}
                  </div>
                  </section>
                </li>
              );
              break
            }
            case 'anchor': {
              let link = data.answers[0].actions[index].link;
              let text = data.answers[0].actions[index].text;
              listItems.push(
                <li className='message-list-item' key={action+index}>
                  <section  className={messageContainerClasses}>
                  <div className='message-text'>
                    <a href={link} target='_blank'
                      rel='noopener noreferrer'>{text}</a>
                  </div>
                  <div className='message-time'>
                    {message.date.toLocaleTimeString()}
                  </div>
                  </section>
                </li>
              );
              break
            }
            case 'map': {
              let lat = parseFloat(data.answers[0].actions[index].latitude);
              let lng = parseFloat(data.answers[0].actions[index].longitude);
              let zoom = parseFloat(data.answers[0].actions[index].zoom);
              let mymap = drawMap(lat,lng,zoom);
              listItems.push(
                <li className='message-list-item' key={action+index}>
                  <section className={messageContainerClasses}>
                  <div>{mymap}</div>
                  <div className='message-time'>
                    {message.date.toLocaleTimeString()}
                  </div>
                  </section>
                </li>
              );
              break
            }
            case 'table': {
              let coloumns = data.answers[0].actions[index].columns;
              let count = data.answers[0].actions[index].count;
              let table = drawTable(coloumns,data.answers[0].data,count);
              listItems.push(
                <li className='message-list-item' key={action+index}>
                  <section className={messageContainerClasses}>
                  <div><div className='message-text'>{table}</div></div>
                  <div className='message-time'>
                    {message.date.toLocaleTimeString()}
                  </div>
                  </section>
                </li>
              );
              break
            }
            case 'rss':{
              let rssKeys = Object.assign({}, data.answers[0].actions[index]);
              delete rssKeys.type;
              let count = -1;
              if(rssKeys.hasOwnProperty('count')){
                count = rssKeys.count;
                delete rssKeys.count;
              }
              let rssTiles = getRSSTiles(rssKeys,data.answers[0].data,count);
              listItems.push(
                  <li className='message-list-item' key={action+index}>
                    <section className={messageContainerClasses}>
                    <div><div className='message-text'>
                      {renderTiles(rssTiles)}
                    </div></div>
                    <div className='message-time'>
                      {message.date.toLocaleTimeString()}
                    </div>
                    </section>
                  </li>
                );
              break;
            }
            case 'websearch': {
              let websearchTiles = this.props.message.websearchresults;
              listItems.push(
                  <li className='message-list-item' key={action+index}>
                    <section className={messageContainerClasses}>
                    <div><div className='message-text'>
                      {renderTiles(websearchTiles)}
                    </div></div>
                    <div className='message-time'>
                      {message.date.toLocaleTimeString()}
                    </div>
                    </section>
                  </li>
                );
              break;
            }

            default:
              // do nothing
          }
        });

        return (<div>{listItems}</div>);
      }
    }

    return (
      <li className='message-list-item'>
        <section  className={messageContainerClasses}>
        <div className='message-text'>{replacedText}</div>
        <div className='message-time'>
          {message.date.toLocaleTimeString()}
        </div>
        </section>
      </li>
    );
  }

};

MessageListItem.propTypes = {
  message: PropTypes.object,
  markID: PropTypes.string
};

export default MessageListItem;

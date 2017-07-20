import React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import Linkify from 'react-linkify';
import Feedback from './Feedback.react';
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
import Slider from 'react-slick';
import TickIcon from 'material-ui/svg-icons/action/done';
import ClockIcon from 'material-ui/svg-icons/action/schedule';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import Parser from 'html-react-parser';

// Keeps the Map Popup open initially
class ExtendedMarker extends Marker {

  componentDidMount() {
    super.componentDidMount();

    this.leafletElement.openPopup();
  }
}

// Returns the message time and status indicator
export function renderMessageFooter(message,latestMsgID){

  let statusIndicator = null;

  let footerStyle = {
    display: 'block',
    float: 'left'
  }

  if(message.authorName === 'You'){
    let indicatorStyle = {
      height:'13px'
    }
    statusIndicator = (
      <li className='message-time' style={footerStyle}>
        <TickIcon style={indicatorStyle}
          color={UserPreferencesStore.getTheme()==='light' ? '#90a4ae' : '#7eaaaf'}/>
      </li>
    );
    if(message.id === latestMsgID){
      statusIndicator = (
        <li className='message-time' style={footerStyle}>
          <ClockIcon style={indicatorStyle}
            color={UserPreferencesStore.getTheme()==='light' ? '#90a4ae' : '#7eaaaf'}/>
        </li>);
    }
  }

  if(message.authorName === 'SUSI'){
    footerStyle = {};
  }

  return(
    <ul>
      <li className='message-time' style={footerStyle}>
        {message.date.toLocaleString(
          'en-US',
          { hour: 'numeric',minute:'numeric', hour12: true }
        )}
      </li>
      {statusIndicator}
    </ul>
  );
}
// Render Feedback
export function renderMessageFeedback(message, show){

  return(
    <span className='feedback-container'>
    <Feedback
          message={message}
          show={show}
        />
    </span>
  );
}
// Proccess the text for HTML Spl Chars, Images, Links and Emojis
export function processText(text,type){
  if(text){
    text = text.toString();
    let processedText = '';
    switch(type){
      case 'websearch-rss':{
        let htmlText = Parser(text);
        processedText = <Emojify>{htmlText}</Emojify>;
        break;
      }
      default:{
        let imgText = imageParse(text);
        let replacedText = parseAndReplace(imgText);
        processedText = <Emojify>{replacedText}</Emojify>;
      }
    }
    return processedText;
  };
  return text;
}

export function imageParse(stringWithLinks){
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
      result.push(Parser(item));
    }
  });
  return result;
}

// Linkify the text
export function parseAndReplace(text) {
  return <Linkify properties={{target: '_blank'}}>
    {text}
  </Linkify>;
}

// Draw Tiles for Websearch RSS data
export function drawTiles(tilesData){
  let resultTiles = tilesData.map((tile,i) => {
      return(
        <div key={i}>
          <MuiThemeProvider>
            <Paper zDepth={0} className='tile'>
              <a rel='noopener noreferrer'
                href={tile.link} target='_blank'
                className='tile-anchor'>
                  {tile.icon &&
                  (<div className='tile-img-container'>
                      <img src={tile.icon}
                      className='tile-img' alt=''/>
                    </div>
                  )}
                  <div className='tile-text'>
                    <p className='tile-title'>
                      <strong>
                          {processText(tile.title,'websearch-rss')}
                        </strong>
                      </p>
                    {processText(tile.description,'websearch-rss')}
                  </div>
                </a>
            </Paper>
          </MuiThemeProvider>
        </div>
      );
  });
  return resultTiles;
}

// Render Websearch RSS tiles
export function renderTiles(tiles){
  if(tiles.length === 0){
    let noResultFound = 'NO Results Found';
    return(<center>{noResultFound}</center>);
  }
  let resultTiles = drawTiles(tiles);
   var settings = {
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        swipeToSlide:true,
        swipe:true,
        arrows:false
      };
  return(
    <Slider {...settings}>
      {resultTiles}
    </Slider>
  );
}

// Fetch RSS data
export function getRSSTiles(rssKeys,rssData,count){
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

// Create a Table as SUSI Response
export function drawTable(coloumns,tableData,count){
  let parseKeys;
  let showColName = true;
  // Check the dataType specifying table columns
  if(coloumns.constructor === Array){
    parseKeys = coloumns;
    showColName = false;
  }
  else{
    parseKeys = Object.keys(coloumns);
  }
  // Create the Table Header
  let tableheader = parseKeys.map((key,i) =>{
    return(<TableHeaderColumn key={i}>{coloumns[key]}</TableHeaderColumn>);
  });
  // Calculate #rows in table
  let rowCount = tableData.length;
  if(count > -1){
    rowCount = Math.min(count,tableData.length);
  }
  let rows = [];
  for (var j=0; j < rowCount; j++) {
    let eachrow = tableData[j];
    // Check if the data object can be populated as a table row
    let validRow = true;
    for (var keyInd=0; keyInd < parseKeys.length; keyInd++) {
      var colKey = parseKeys[keyInd];
      if(!eachrow.hasOwnProperty(colKey)){
        validRow = false;
        break;
      }
    };
    // Populate a Table Row
    if(validRow){
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
  }
  // Populate the Table
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
export function drawMap(lat,lng,zoom){
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

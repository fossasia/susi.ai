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
import Slider from 'react-slick';
import TickIcon from 'material-ui/svg-icons/action/done';
import ClockIcon from 'material-ui/svg-icons/action/schedule';
import ShareIcon from 'material-ui/svg-icons/social/share';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import Parser from 'html-react-parser';
import {Card, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {
    injectIntl
} from 'react-intl';


// Keeps the Map Popup open initially
class ExtendedMarker extends Marker {

  componentDidMount() {
    super.componentDidMount();

    this.leafletElement.openPopup();
  }
}

// Render anchor for given text
export function renderAnchor(text,link){
  return (<a href={link} target='_blank'
    rel='noopener noreferrer'>{text}</a>);
}

// Returns the message time and status indicator
export function renderMessageFooter(message,latestMsgID, isLastAction){

  let statusIndicator = null;

  let footerStyle = {
    display: 'block',
    float: 'left'
  }

  if(message.authorName === 'You'){
    let indicatorStyle = {
      height:'13px'
    }
    let indicatorStyleShare = {
      height:'13px',
      cursor:'pointer'
    }
    let shareMessageYou = message.text;
    shareMessageYou = encodeURIComponent(shareMessageYou.trim());
    let shareTag = ' #SUSI.AI';
    shareTag = encodeURIComponent(shareTag);
    let twitterShare = 'https://twitter.com/intent/tweet?text='+shareMessageYou+shareTag;
    statusIndicator = (
      <li className='response-time' style={footerStyle}>
        <TickIcon style={indicatorStyle}
          color={UserPreferencesStore.getTheme()==='light' ? '#90a4ae' : '#7eaaaf'}/>
      </li>
    );
    statusIndicator = (
      <li className='response-time' style={footerStyle}>
        <ShareIcon style={indicatorStyleShare}
          color={UserPreferencesStore.getTheme()==='light' ? '#90a4ae' : '#7eaaaf'}
          onClick={()=> window.open(twitterShare, '_blank')}
          />
      </li>);
    if(message.id === latestMsgID){
      statusIndicator = (
        <li className='response-time' style={footerStyle}>
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
        <PostDate date={message.date} />
        { isLastAction &&
          (<Feedback message={message} />)
        }
      </li>
      {statusIndicator}
    </ul>
  );
}
// Format Date for internationalization
const PostDate = injectIntl(({date, intl}) => (
            <span title={intl.formatDate(date,{
            hour: 'numeric',
            minute: 'numeric',
        })}>  {intl.formatDate(date,{
            hour: 'numeric',
            minute: 'numeric',
        })}
        </span>
));

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

// Parse for image links to render images and gifs
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
          style={{width:'95%',height:'auto'}} alt=''/>);
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

// Get hostname for given link
function urlDomain(data) {
  var a = document.createElement('a');
  a.href = data;
  return a.hostname;
}

// Draw Tiles for Websearch RSS data
export function drawCards(tilesData){
  const titleStyle = {
    marginTop: '-10px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'block',
    fontSize: '16px',
    fontWeight: 'bold' ,
    color: '#4285f4',
  }

  let cardClass = 'card-noImg';
  tilesData.forEach((card,index) => {
    if(card.image){
      cardClass = 'card';
    }
  });

  let resultTiles = tilesData.map((tile,i) => {
      let cardText = tile.description;
      if(!cardText){
        cardText = tile.descriptionShort;
      }
      return(
        <Card className={cardClass} key={i} onClick={() => {
          window.open(tile.link,'_blank')
        }}>
          {tile.image &&
            (<CardMedia>
              <img src={tile.image} alt="" className='card-img'/>
            </CardMedia>)
          }
          <CardTitle title={tile.title} titleStyle={titleStyle}/>
          <CardText>
            <div className='card-text line-clamp'>{cardText}</div>
            <div className='card-url'>{urlDomain(tile.link)}</div>
          </CardText>
        </Card>
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
  let resultTiles = drawCards(tiles);
  let slidesToShow = 3;
  let showArrows = true;
  if (window.matchMedia('only screen and (max-width: 768px)').matches){
    // do functionality on screens smaller than 768px
    slidesToShow = 2;
    showArrows = false;
  }
   var settings = {
        speed: 500,
        slidesToShow: slidesToShow,
        slidesToScroll: 1,
        swipeToSlide:true,
        swipe:true,
        arrows:showArrows
      };
  return(
    <Slider {...settings} adaptiveHeight={true}>
      {resultTiles}
    </Slider>
  );
}

// Create a Table as SUSI Response
export function drawTable(columns,tableData,count){
  let parseKeys;
  let showColName = true;
  // Check the dataType specifying table columns
  if(columns.constructor === Array){
    parseKeys = columns;
    showColName = false;
  }
  else{
    parseKeys = Object.keys(columns);
  }
  // Create the Table Header
  let tableheader = parseKeys.map((key,i) =>{
    return(<TableHeaderColumn key={i}>{columns[key]}</TableHeaderColumn>);
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
   <Map center={position} zoom={zoom} scrollWheelZoom={false}>
      <TileLayer
        attribution=''
        url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
      />
      <ExtendedMarker position={position} icon={icon}>
        <Popup>
          <span><strong>Here!</strong></span>
        </Popup>
      </ExtendedMarker>
    </Map>
  );
  return map;
}

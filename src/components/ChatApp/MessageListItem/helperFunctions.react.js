import React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import Linkify from 'react-linkify';
import Feedback from './Feedback.react';
import Emojify from 'react-emojione';
import Slider from 'react-slick';
import { injectIntl } from 'react-intl';
import Parser from 'html-react-parser';
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
import TickIcon from 'material-ui/svg-icons/action/done';
import ClockIcon from 'material-ui/svg-icons/action/schedule';
import ShareIcon from 'material-ui/svg-icons/social/share';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';

// Keeps the Map Popup open initially
class ExtendedMarker extends Marker {
  componentDidMount() {
    super.componentDidMount();

    this.leafletElement.openPopup();
  }
}

// Render anchor for given text
export const renderAnchor = (text, link) => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    {text}
  </a>
);

// Returns the message time and status indicator
export const renderMessageFooter = (message, latestMsgID, isLastAction) => {
  let statusIndicator = null;

  let footerStyle = {
    display: 'block',
    float: 'left',
  };

  if (message && message.authorName === 'You') {
    const indicatorStyle = {
      height: '13px',
    };
    const indicatorStyleShare = {
      height: '13px',
      cursor: 'pointer',
    };
    const shareMessageYou = encodeURIComponent(message.text.trim());
    const shareTag = encodeURIComponent(' #SUSI.AI');
    const twitterShare = `https://twitter.com/intent/tweet?text=${shareMessageYou}${shareTag}`;
    statusIndicator = (
      <li className="response-time" style={footerStyle}>
        <TickIcon
          style={indicatorStyle}
          color={
            UserPreferencesStore.getTheme() === 'light' ? '#90a4ae' : '#7eaaaf'
          }
        />
      </li>
    );
    statusIndicator = (
      <li className="response-time" style={footerStyle}>
        <ShareIcon
          style={indicatorStyleShare}
          color={
            UserPreferencesStore.getTheme() === 'light' ? '#90a4ae' : '#7eaaaf'
          }
          onClick={() => window.open(twitterShare, '_blank')}
        />
      </li>
    );
    if (message.id === latestMsgID) {
      statusIndicator = (
        <li className="response-time" style={footerStyle}>
          <ClockIcon
            style={indicatorStyle}
            color={
              UserPreferencesStore.getTheme() === 'light'
                ? '#90a4ae'
                : '#7eaaaf'
            }
          />
        </li>
      );
    }
  }

  if (message && message.authorName === 'SUSI') {
    footerStyle = {};
  }

  return (
    <ul>
      <li className="message-time" style={footerStyle}>
        <PostDate date={message ? message.date : null} />
        {isLastAction && <Feedback message={message} />}
      </li>
      {statusIndicator}
    </ul>
  );
};

// Format Date for internationalization
const PostDate = injectIntl(({ date, intl }) => (
  <span
    title={intl.formatDate(date, {
      hour: 'numeric',
      minute: 'numeric',
    })}
  >
    {' '}
    {intl.formatDate(date, {
      hour: 'numeric',
      minute: 'numeric',
    })}
  </span>
));

// Linkify the text
export const parseAndReplace = text => {
  return <Linkify properties={{ target: '_blank' }}>{text}</Linkify>;
};

// Proccess the text for HTML Spl Chars, Images, Links and Emojis
export const processText = (text, type) => {
  if (text) {
    text = text.toString();
    let processedText = '';
    switch (type) {
      case 'websearch-rss': {
        const htmlText = Parser(text);
        processedText = <Emojify>{htmlText}</Emojify>;
        break;
      }
      default: {
        const imgText = imageParse(text);
        const replacedText = parseAndReplace(imgText);
        processedText = <Emojify>{replacedText}</Emojify>;
      }
    }
    return processedText;
  }
  return text;
};

// Parse for image links to render images and gifs
export function imageParse(stringWithLinks) {
  const replacePattern = new RegExp(
    [
      '((?:https?:\\/\\/)(?:[a-zA-Z]{1}',
      '(?:[\\w-]+\\.)+(?:[\\w]{2,5}))',
      '(?::[\\d]{1,5})?\\/(?:[^\\s/]+\\/)',
      '*(?:[^\\s]+\\.(?:jpe?g|gif|png))',
      '(?:\\?\\w+=\\w+(?:&\\w+=\\w+)*)?)',
    ].join(''),
    'gim',
  );
  const splits = stringWithLinks.split(replacePattern);
  let result = [];
  splits.forEach((item, key) => {
    const checkmatch = item.match(replacePattern);
    if (checkmatch) {
      result.push(
        <img
          key={key}
          src={checkmatch}
          style={{ width: '95%', height: 'auto' }}
          alt=""
        />,
      );
    } else {
      const htmlParseItem = Parser(item);
      if (
        (Array.isArray(htmlParseItem) && htmlParseItem.length === 0) ||
        (htmlParseItem.hasOwnProperty('props') && !htmlParseItem.props.children)
      ) {
        result.push(item);
      } else {
        result.push(htmlParseItem);
      }
    }
  });
  return result;
}

// Get hostname for given link
const urlDomain = data => {
  let a = document.createElement('a');
  a.href = data;
  return a.hostname;
};

// Draw Tiles for Websearch RSS data
export const drawCards = tilesData => {
  const titleStyle = {
    marginTop: '-10px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'block',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#4285f4',
  };

  let cardClass = 'card-noImg';
  tilesData.forEach((card, index) => {
    if (card.image) {
      cardClass = 'card';
    }
  });

  const resultTiles = tilesData.map((tile, i) => {
    const cardText = tile.description
      ? tile.description
      : tile.descriptionShort;

    return (
      <Card
        className={cardClass}
        key={i}
        onClick={() => {
          window.open(tile.link, '_blank');
        }}
      >
        {tile.image && (
          <CardMedia>
            <img src={tile.image} alt="" className="card-img" />
          </CardMedia>
        )}
        <CardTitle title={tile.title} titleStyle={titleStyle} />
        <CardText>
          <div className="card-text line-clamp">{cardText}</div>
          <div className="card-url">{urlDomain(tile.link)}</div>
        </CardText>
      </Card>
    );
  });
  return resultTiles;
};

// Render Websearch RSS tiles
export const renderTiles = tiles => {
  if (tiles.length === 0) {
    const noResultFound = 'NO Results Found';
    return <center>{noResultFound}</center>;
  }
  const resultTiles = drawCards(tiles);
  let slidesToShow = 3;
  let showArrows = true;
  if (window.matchMedia('only screen and (max-width: 768px)').matches) {
    // do functionality on screens smaller than 768px
    slidesToShow = 2;
    showArrows = false;
  }
  const settings = {
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    swipeToSlide: true,
    swipe: true,
    arrows: showArrows,
  };
  return (
    <Slider {...settings} adaptiveHeight={true}>
      {resultTiles}
    </Slider>
  );
};

// Create a Table as SUSI Response
export const drawTable = (columns, tableData, count) => {
  let parseKeys;
  let showColName = true;
  // Check the dataType specifying table columns
  if (columns.constructor === Array) {
    parseKeys = columns;
    showColName = false;
  } else {
    parseKeys = Object.keys(columns);
  }
  // Create the Table Header
  const tableheader = parseKeys.map((key, i) => {
    return (
      <TableHeaderColumn
        key={i}
        style={{
          whiteSpace: 'normal',
          wordWrap: 'break-word',
        }}
      >
        {columns[key]}
      </TableHeaderColumn>
    );
  });
  // Calculate #rows in table
  let rowCount = tableData.length;
  if (count > -1) {
    rowCount = Math.min(count, tableData.length);
  }
  let rows = [];
  for (let j = 0; j < rowCount; j++) {
    const eachrow = tableData[j];
    // Check if the data object can be populated as a table row
    let validRow = true;
    for (let keyInd = 0; keyInd < parseKeys.length; keyInd++) {
      const colKey = parseKeys[keyInd];
      if (!eachrow.hasOwnProperty(colKey)) {
        validRow = false;
        break;
      }
    }
    // Populate a Table Row
    if (validRow) {
      const rowcols = parseKeys.map((key, i) => {
        return (
          <TableRowColumn
            key={i}
            style={{
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          >
            <Linkify properties={{ target: '_blank' }}>
              <abbr title={eachrow[key]}>{processText(eachrow[key])}</abbr>
            </Linkify>
          </TableRowColumn>
        );
      });
      rows.push(<TableRow key={j}>{rowcols}</TableRow>);
    }
  }
  // Populate the Table
  const table = (
    <MuiThemeProvider>
      <Table selectable={false} style={{ width: 'auto', tableLayout: 'auto' }}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          {showColName && <TableRow>{tableheader}</TableRow>}
        </TableHeader>
        <TableBody displayRowCheckbox={false}>{rows}</TableBody>
      </Table>
    </MuiThemeProvider>
  );

  return table;
};

// Draw a Map
export function drawMap(lat, lng, zoom) {
  const position = [lat, lng];
  const icon = divIcon({
    className: 'map-marker-icon',
    iconSize: [35, 35],
  });
  const map = (
    <Map center={position} zoom={zoom} scrollWheelZoom={false}>
      <TileLayer attribution="" url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
      <ExtendedMarker position={position} icon={icon}>
        <Popup>
          <span>
            <strong>Here!</strong>
          </span>
        </Popup>
      </ExtendedMarker>
    </Map>
  );
  return map;
}

import React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import Linkify from 'react-linkify';
import Feedback from './Feedback.react';
import ShareButton from './ShareButton';
import Emojify from 'react-emojione';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { divIcon } from 'leaflet';
import Slider from 'react-slick';
import TickIcon from '@material-ui/icons/Done';
import ClockIcon from '@material-ui/icons/Schedule';
import store from '../../../store';
import Parser from 'html-react-parser';
import _Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import _CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { injectIntl } from 'react-intl';
import styled from 'styled-components';

const FooterList = styled.ul`
  list-style-type: none;
  font-size: 0.75rem;
  color: ${props => (props.author === 'SUSI' ? '#AAA9AA' : '#C6DAFB')};
  padding: 0;
  text-align: right;
  float: ${props => (props.author === 'SUSI' ? 'right' : 'left')};
`;

const FooterContentContainer = styled.li`
  float: left;
  margin-top: 0.25rem;
`;

const CardTitle = styled(Typography)`
  white-space: no-wrap;
  overflow: hidden;
  text-overflow: 'ellipsis';
  font-weight: 'bold';
  color: '#4285f4';
`;

const CardMedia = styled(_CardMedia)`
  height: 120px;
  object-fit: contain;
  vertical-align: middle;
`;

const CardUrl = styled.div`
  color: #a9a9a9;
  position: absolute;
  bottom: 10px;
  right: 5px;
  width: 80%;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Card = styled(_Card)`
  height: 225px;
  cursor: pointer;
  position: relative;
`;

// Keeps the Map Popup open initially
class ExtendedMarker extends Marker {
  componentDidMount() {
    super.componentDidMount();

    this.leafletElement.openPopup();
  }
}

// Render anchor for given text
export function renderAnchor(text, link) {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer">
      {text}
    </a>
  );
}

// Returns the message time and status indicator
export function renderMessageFooter(message, latestMsgID, isLastAction) {
  let footerContent = null;
  const { theme } = store.getState().settings;
  const isLightTheme = theme === 'light';

  if (message && message.authorName === 'You') {
    if (message.id === latestMsgID) {
      footerContent = (
        <FooterContentContainer>
          <ClockIcon
            color={isLightTheme ? '#90a4ae' : '#7eaaaf'}
            style={{ height: '0.8135rem' }}
          />
        </FooterContentContainer>
      );
    } else {
      footerContent = (
        <FooterContentContainer>
          <TickIcon
            color={isLightTheme ? '#90a4ae' : '#7eaaaf'}
            style={{ height: '0.8135rem' }}
          />
        </FooterContentContainer>
      );
    }
  } else if (message && message.authorName === 'SUSI') {
    footerContent = (
      <FooterContentContainer>
        <ShareButton
          message={message}
          color={isLightTheme ? '#90a4ae' : '#7eaaaf'}
        />
      </FooterContentContainer>
    );
  }
  return (
    <FooterList author={message.authorName}>
      <PostDate date={message ? message.date : null} />
      {isLastAction && <Feedback message={message} />}
      {footerContent}
    </FooterList>
  );
}
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

// Proccess the text for HTML Spl Chars, Images, Links and Emojis
export function processText(text, type) {
  if (text) {
    text = text.toString();
    let processedText = '';
    switch (type) {
      case 'websearch-rss': {
        let htmlText = Parser(text);
        processedText = <Emojify>{htmlText}</Emojify>;
        break;
      }
      default: {
        let imgText = imageParse(text);
        let replacedText = parseAndReplace(imgText);
        processedText = <Emojify>{replacedText}</Emojify>;
      }
    }
    return processedText;
  }
  return text;
}

// Parse for image links to render images and gifs
export function imageParse(stringWithLinks) {
  let replacePattern = new RegExp(
    [
      '((?:https?:\\/\\/)(?:[a-zA-Z]{1}',
      '(?:[\\w-]+\\.)+(?:[\\w]{2,5}))',
      '(?::[\\d]{1,5})?\\/(?:[^\\s/]+\\/)',
      '*(?:[^\\s]+\\.(?:jpe?g|gif|png))',
      '(?:\\?\\w+=\\w+(?:&\\w+=\\w+)*)?)',
    ].join(''),
    'gim',
  );
  let splits = stringWithLinks.split(replacePattern);
  let result = [];
  splits.forEach((item, key) => {
    let checkmatch = item.match(replacePattern);
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
      let htmlParseItem = Parser(item);
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

// Linkify the text
export function parseAndReplace(text) {
  return <Linkify properties={{ target: '_blank' }}>{text}</Linkify>;
}

// Get hostname for given link
function urlDomain(data) {
  let a = document.createElement('a');
  a.href = data;
  return a.hostname;
}

// Draw Tiles for Websearch RSS data
export function drawCards(tilesData) {
  let resultTiles = tilesData.map((tile, i) => {
    let cardText = tile.description;
    if (!cardText) {
      cardText = tile.descriptionShort;
    }
    return (
      <Card
        key={i}
        onClick={() => {
          window.open(tile.link, '_blank');
        }}
      >
        <CardActionArea>
          {tile.image && <CardMedia image={tile.image} alt="" />}
          <CardTitle gutterBottom variant="h5" component="h2">
            {tile.title}
          </CardTitle>
          <div>{cardText}</div>
          <CardUrl>{urlDomain(tile.link)}</CardUrl>
        </CardActionArea>
      </Card>
    );
  });
  return resultTiles;
}

// Render Websearch RSS tiles
export function renderTiles(tiles) {
  if (tiles.length === 0) {
    let noResultFound = 'NO Results Found';
    return <center>{noResultFound}</center>;
  }
  let resultTiles = drawCards(tiles);
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
}

// Create a Table as SUSI Response
export function drawTable(columns, tableData, count) {
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
  let tableheader = parseKeys.map((key, i) => {
    return (
      <TableCell
        key={i}
        style={{
          whiteSpace: 'normal',
          wordWrap: 'break-word',
        }}
      >
        {columns[key]}
      </TableCell>
    );
  });
  // Calculate #rows in table
  let rowCount = tableData.length;
  if (count > -1) {
    rowCount = Math.min(count, tableData.length);
  }
  let rows = [];
  for (let j = 0; j < rowCount; j++) {
    let eachrow = tableData[j];
    // Check if the data object can be populated as a table row
    let validRow = true;
    for (let keyInd = 0; keyInd < parseKeys.length; keyInd++) {
      let colKey = parseKeys[keyInd];
      if (!eachrow.hasOwnProperty(colKey)) {
        validRow = false;
        break;
      }
    }
    // Populate a Table Row
    if (validRow) {
      let rowcols = parseKeys.map((key, i) => {
        return (
          <TableCell
            key={i}
            style={{
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          >
            <Linkify properties={{ target: '_blank' }}>
              <abbr title={eachrow[key]}>{processText(eachrow[key])}</abbr>
            </Linkify>
          </TableCell>
        );
      });
      rows.push(<TableRow key={j}>{rowcols}</TableRow>);
    }
  }
  // Populate the Table
  const table = (
    <Table>
      <TableHead>{showColName && <TableRow>{tableheader}</TableRow>}</TableHead>
      <TableBody>{rows}</TableBody>
    </Table>
  );

  return table;
}

// Draw a Map
export function drawMap(lat, lng, zoom) {
  let position = [lat, lng];
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

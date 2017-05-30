import React from 'react';
import { PropTypes } from 'prop-types';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import Linkify from 'react-linkify';
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

export function parseAndReplace(text) {
  return <Linkify properties={{target: '_blank'}}>
    {text}
  </Linkify>;
}


function drawWebSearchTiles(tilesData){
  let resultTiles = tilesData.map((tile,i) => {
    let category = 'Popular';
    if(tile.hasOwnProperty('Name')){
      category = tile.Name;
      tile = tile.Topics[0];
    }

    if(tile.Icon.URL){
      return(
        <div key={i}>
          <MuiThemeProvider>
            <Paper zDepth={2} className='websearchtile'>
              <img src={tile.Icon.URL} className='websearchtile-img' alt=''/>
              <div className='websearchtile-text'>
                <p className='websearchtile-category'>
                  Category: <strong>{category}</strong>
                </p>
                {tile.Text}<br/>
                <a href={tile.FirstURL} target='_blank'
                  rel='noopener noreferrer'>Know more</a>
              </div>
            </Paper>
          </MuiThemeProvider>
          <div>
            <br/>
          </div>
        </div>
        );
   }
   return(
    <div key={i}>
      <MuiThemeProvider>
        <Paper zDepth={2} className='websearchtile-auto'>
          <div className='websearchtile-auto-text'>
            <p className='websearchtile-category'>
              Category: <strong>{category}</strong>
            </p>
            {tile.Text}<br/>
            <a href={tile.FirstURL} target='_blank'
              rel='noopener noreferrer'>Know more</a>
          </div>
        </Paper>
      </MuiThemeProvider>
      <div>
        <br/>
      </div>
    </div>
    );
  });

  return resultTiles;
}

function drawTable(coloumns,tableData){
  let tableheader = Object.keys(coloumns).map((key,i) =>{
    return(<TableHeaderColumn key={i}>{coloumns[key]}</TableHeaderColumn>);
  });
  let rows = tableData.map((eachrow,j) => {
    let rowcols = Object.keys(coloumns).map((key,i) =>{
      return(
        <TableRowColumn key={i}>
          <Linkify properties={{target:'_blank'}}>
            {eachrow[key]}
          </Linkify>
        </TableRowColumn>
      );
    });
    return(
      <TableRow key={j}>{rowcols}</TableRow>
    );
  });

  const table =
  <MuiThemeProvider>
    <Table selectable={false}>
    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
      <TableRow>{tableheader}</TableRow>
    </TableHeader>
    <TableBody displayRowCheckbox={false}>{rows}</TableBody>
    </Table>
  </MuiThemeProvider>

  return table;
}

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

class ExtendedMarker extends Marker {

  componentDidMount() {
    super.componentDidMount();

    this.leafletElement.openPopup();
  }
}

class MessageListItem extends React.Component {

  render() {
    let {message} = this.props;
    let stringWithLinks = this.props.message.text;
    let replacedText = parseAndReplace(stringWithLinks);

    if(this.props.message.hasOwnProperty('response')){
      if(Object.keys(this.props.message.response).length > 0){
        let data = this.props.message.response;
        let actions = this.props.message.actions;

        if (actions.indexOf('table')>=0) {
            let actionIndex = actions.indexOf('table');
            let coloumns = data.answers[0].actions[actionIndex].columns;
            let table = drawTable(coloumns,data.answers[0].data);
            return (
                <li className='message-list-item'>
                  <h5 className='message-author-name'>{message.authorName}</h5>
                  <div className='message-time'>
                    {message.date.toLocaleTimeString()}
                  </div>
                  <div className='message-text'>{replacedText}</div>
                  <br/>
                  <div><div className='message-text'>{table}</div></div>
                </li>
              );
        }
        if (actions.indexOf('map')>=0) {
          let actionIndex = actions.indexOf('map');
          let lat = parseFloat(data.answers[0].actions[actionIndex].latitude);
          let lng = parseFloat(data.answers[0].actions[actionIndex].longitude);
          let zoom = parseFloat(data.answers[0].actions[actionIndex].zoom);
          let mymap = drawMap(lat,lng,zoom);
          return (
                  <li className='message-list-item'>
                    <h5 className='message-author-name'>
                      {message.authorName}
                    </h5>
                    <div className='message-time'>
                      {message.date.toLocaleTimeString()}
                    </div>
                    <div className='message-text'>{replacedText}</div>
                    <br/>
                    <div>{mymap}</div>
                  </li>
                );
        }
        if (actions.indexOf('websearch')>=0) {
          let results = this.props.message.websearchresults;
          let WebSearchTiles = drawWebSearchTiles(results);
          return (
            <li className='message-list-item'>
              <h5 className='message-author-name'>{message.authorName}</h5>
              <div className='message-time'>
                {message.date.toLocaleTimeString()}
              </div>
              <div className='message-text'>{replacedText}</div>
              <br/>
              <div><div className='message-text'>{WebSearchTiles}</div></div>
            </li>
          );
        }
      }
    }

    return (
      <li className='message-list-item'>
        <h5 className='message-author-name'>{message.authorName}</h5>
        <div className='message-time'>
          {message.date.toLocaleTimeString()}
        </div>
        <div className='message-text'>{replacedText}</div>
      </li>
    );
  }

};

MessageListItem.propTypes = {
  message: PropTypes.object
};

export default MessageListItem;

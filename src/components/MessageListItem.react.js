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
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { divIcon } from 'leaflet';

export const parseAndReplace = (text) => {return <Linkify properties={{target:"_blank"}}>{text}</Linkify>;}

function drawMap(lat,lng){
  let position = [lat, lng];
  const icon = divIcon({
    className: 'map-marker-icon',
    iconSize: [35, 35]
  });
  const map = (
   <Map center={position} zoom={13}>
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
        let tableData = data.answers[0].data;
        let mapType = false;
        let lat, lng;

        let SpecialResponseChoice = data.answers[0].actions[0];
        if (SpecialResponseChoice.type === "table") {
            let coloumns = data.answers[0].actions[0].columns;
            let tableheader = Object.keys(coloumns).map(key =>{
              return(<TableHeaderColumn>{coloumns[key]}</TableHeaderColumn>);
            });
            let rows = data.answers[0].data.map(eachrow => {
              let rowcols = Object.keys(coloumns).map(key =>{
                return(<TableRowColumn><Linkify properties={{target:"_blank"}}>{eachrow[key]}</Linkify></TableRowColumn>);
              });
              return(
                <TableRow>{rowcols}</TableRow>
              );
            });

            let table =
            <MuiThemeProvider>
              <Table selectable={false}>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}><TableRow>{tableheader}</TableRow></TableHeader>
              <TableBody displayRowCheckbox={false}>{rows}</TableBody>
              </Table>
            </MuiThemeProvider>

            return(
              <li className="message-list-item">
                <h5 className="message-author-name">{message.authorName}</h5>
                <div className="message-time">
                  {message.date.toLocaleTimeString()}
                </div>
                <div><div className="message-text">{table}</div></div>
              </li>
            );
        }

        if (tableData[0].hasOwnProperty('lat') || tableData[0].hasOwnProperty('lon')) {
          // Need to give out a map.
          mapType = true;
          lat = tableData[0]['lat'];
          lng = tableData[0]['lon'];
        }
        if (mapType === true) {
          let mymap = drawMap(lat,lng);
          return (
                  <li className="message-list-item">
                    <h5 className="message-author-name">{message.authorName}</h5>
                    <div className="message-time">
                      {message.date.toLocaleTimeString()}
                    </div>
                    <div className="message-text">{replacedText}</div>
                    <br/>
                    <div>{mymap}</div>
                  </li>
                );
        }
      }
    }
    
    return (
      <li className="message-list-item">
        <h5 className="message-author-name">{message.authorName}</h5>
        <div className="message-time">
          {message.date.toLocaleTimeString()}
        </div>
        <div className="message-text">{replacedText}</div>
      </li>
    );
  }

};

MessageListItem.propTypes = {
  message: PropTypes.object
};

export default MessageListItem;

import React from 'react';
import { PropTypes } from 'prop-types';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
import Linkify from 'react-linkify';

export const parseAndReplace = (text) => {return <Linkify properties={{target:"_blank"}}>{text}</Linkify>;}

function drawMap(lat,lng){
  let position = [lat, lng];
  const map = (
   <Map center={position} zoom={13}>
      <TileLayer
        attribution=''
        url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
      />
      <ExtendedMarker position={position}>
        <Popup>
          <span>Hello! <br/> I'm here.</span>
        </Popup>
      </ExtendedMarker>
    </Map>
  );
  return map;
}

class ExtendedMarker extends Marker {
  // "Hijack" the component lifecycle.
  componentDidMount() {
    // Call the Marker class componentDidMount (to make sure everything behaves as normal)
    super.componentDidMount();
    
    // Access the marker element and open the popup.
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
        if (tableData[0].hasOwnProperty('lat') || tableData[0].hasOwnProperty('lon')) {
          // Need to give out a map.
          console.log("draw map");
          mapType = true;
          lat = tableData[0]['lat'];
          lng = tableData[0]['lon'];
        }
        if (mapType === true) {
          console.log("draw map")
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

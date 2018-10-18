import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// eslint-disable-next-line
import { InfoWindow } from 'google-maps-react';

import PropTypes from 'prop-types';

export default class MapContainer extends Component {
  componentDidUpdate() {
    this.loadMap();
  }

  loadMap() {
    if (this.props && this.props.google) {
      // Set the prop value to google, and maps to google maps props
      const { google } = this.props;
      const maps = google.maps;

      // Look for HTML div ref ‘map’ in the React DOM and name it ‘node’
      // eslint-disable-next-line
      const mapRef = this.refs.map;
      // eslint-disable-next-line
      const node = ReactDOM.findDOMNode(mapRef);

      const mapConfig = Object.assign(
        {},
        {
          // Set the center and the default zoom level of the map using the props passed
          center: { lat: this.props.centerLat, lng: this.props.centerLng },
          zoom: 2,
          mapTypeId: 'roadmap',
        },
      );

      // Create a new Google map on the specified node with specified config
      this.map = new maps.Map(node, mapConfig);

      // Create a new InfoWindow to be added as event listener on the map markers
      let infoWindow = new google.maps.InfoWindow();
      let i = 0;

      // Add markers to map
      this.props.mapData.forEach(location => {
        // eslint-disable-next-line
        const marker = new google.maps.Marker({
          position: { lat: location.location.lat, lng: location.location.lng },
          map: this.map,
          title: 'Click to see device information.',
          devicename: this.props.deviceNames[i],
          room: this.props.rooms[i],
          macid: this.props.macIds[i],
        });

        // Add event listener to the map markers to open InfoWindow on click
        google.maps.event.addListener(marker, 'click', function() {
          infoWindow.setContent(
            'Mac Address: ' +
              marker.macid +
              '<br/>' +
              'Room: ' +
              marker.room +
              '<br/>' +
              'Device name: ' +
              marker.devicename,
          );
          infoWindow.open(this.map, marker);
        });

        i++;
      });
    }
  }

  render() {
    const style = {
      width: '100%',
      height: '300px',
    };

    return (
      // eslint-disable-next-line
      <div ref="map" style={style}>
        loading map...
      </div>
    );
  }
}

MapContainer.propTypes = {
  centerLat: PropTypes.number,
  centerLng: PropTypes.number,
  mapData: PropTypes.array,
  deviceNames: PropTypes.array,
  rooms: PropTypes.array,
  macIds: PropTypes.array,
  google: PropTypes.object,
};

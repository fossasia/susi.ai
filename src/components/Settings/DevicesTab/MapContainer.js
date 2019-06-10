import React, { Component } from 'react';
import PropTypes from 'prop-types';

const style = {
  mapContainer: {
    width: '100%',
    height: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

class MapContainer extends Component {
  static propTypes = {
    devicesData: PropTypes.array,
    mapCenter: PropTypes.object,
    google: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.mapNode = React.createRef();
  }

  componentDidUpdate() {
    this.initialiseMap();
  }

  initialiseMap = () => {
    if (this.props && this.props.google) {
      // Set the prop value to google, and maps to google maps props
      const { google, mapCenter, devicesData } = this.props;
      const maps = google.maps;
      const mapConfig = Object.assign(
        {},
        {
          // Set the center and the default zoom level of the map using the props passed
          center: {
            lat: mapCenter.latitude,
            lng: mapCenter.longitude,
          },
          zoom: 2,
          mapTypeId: 'roadmap',
        },
      );

      // Create a new Google map on the specified node with specified config
      this.map = new maps.Map(this.mapNode, mapConfig);

      // Create a new InfoWindow to be added as event listener on the map markers
      let infoWindow = new google.maps.InfoWindow();

      // Add markers to map
      devicesData.forEach(eachDevice => {
        // eslint-disable-next-line
        const marker = new google.maps.Marker({
          position: { lat: eachDevice.latitude, lng: eachDevice.longitude },
          map: this.map,
          title: 'Click to see device information.',
          deviceName: eachDevice.deviceName,
          room: eachDevice.room,
          macId: eachDevice.macId,
        });

        // Add event listener to the map markers to open InfoWindow on click
        google.maps.event.addListener(marker, 'click', () => {
          infoWindow.setContent(
            'Mac Address: ' +
              marker.macId +
              '<br/>' +
              'Room: ' +
              marker.room +
              '<br/>' +
              'Device name: ' +
              marker.deviceName,
          );
          infoWindow.open(this.map, marker);
        });
      });
    }
  };

  render() {
    return (
      <div ref={this.mapNode} style={style.mapContainer}>
        Loading Map...
      </div>
    );
  }
}

export default MapContainer;

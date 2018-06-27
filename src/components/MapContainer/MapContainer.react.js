import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class MapContainer extends Component {
  componentDidUpdate() {
    this.loadMap();
  }

  loadMap() {
    if (this.props && this.props.google) {
      const { google } = this.props;
      const maps = google.maps;

      // eslint-disable-next-line
      const mapRef = this.refs.map;
      // eslint-disable-next-line
      const node = ReactDOM.findDOMNode(mapRef);

      const mapConfig = Object.assign(
        {},
        {
          center: { lat: this.props.centerLat, lng: this.props.centerLng },
          zoom: 2,
          mapTypeId: 'roadmap',
        },
      );

      this.map = new maps.Map(node, mapConfig);

      // Add markers to map
      this.props.mapData.forEach(location => {
        // eslint-disable-next-line
        const marker = new google.maps.Marker({
          position: { lat: location.location.lat, lng: location.location.lng },
          map: this.map,
          title: location.name,
        });
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
  mapData: PropTypes.object,
  google: PropTypes.object,
};

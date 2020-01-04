import React, { Component } from 'react';
import styled from 'styled-components';
import { Map as _Map, InfoWindow, Marker } from 'google-maps-react';
import PropTypes from 'prop-types';

const Container = styled.div`
  width: ${props => (props.adminTable ? '250px' : '100%')};
  height: ${props => (props.adminTable ? '250px' : '300px')};
  display: flex;
  justify-content: center;
`;

const Map = styled(_Map)`
  height: 300px !important;
  position: relative;
  width: ${props => (props.adminTable ? '250px' : '85% !important')};

  @media (max-width: 1060px) {
    width: 80% !important;
  }

  @media (max-width: 700px) {
    width: 65% !important;
  }
`;

class MapContainer extends Component {
  static propTypes = {
    data: PropTypes.array,
    google: PropTypes.object,
    invalidLocations: PropTypes.number,
    adminTable: PropTypes.bool,
    style: PropTypes.object,
    tooltipRenderer: PropTypes.func,
  };

  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
  };

  onMarkerClick = (props, marker, e) => {
    this.setState({
      activeMarker: marker,
      selectedPlace: props,
      showingInfoWindow: true,
    });
  };

  onInfoWindowClose = () => {
    this.setState({
      activeMarker: null,
      showingInfoWindow: false,
    });
  };

  onMapClicked = () => {
    if (this.state.showingInfoWindow) {
      this.setState({
        activeMarker: null,
        showingInfoWindow: false,
      });
    }
  };

  getMapCenter = (data, invalidLocations) => {
    const latitudeSum = data.reduce(
      (a, b) => ({ latitude: a.latitude + b.latitude }),
      {
        latitude: 0.0,
      },
    ).latitude;
    const longitudeSum = data.reduce(
      (a, b) => ({ longitude: a.longitude + b.longitude }),
      { longitude: 0.0 },
    ).longitude;

    return {
      lat: latitudeSum / (data.length - invalidLocations),
      lng: longitudeSum / (data.length - invalidLocations),
    };
  };

  render() {
    const { activeMarker, showingInfoWindow, selectedPlace } = this.state;
    const {
      google,
      data = [],
      invalidLocations = 0,
      adminTable,
      style,
    } = this.props;

    const mapCenter = this.getMapCenter(data, invalidLocations);

    return (
      <Container adminTable={adminTable}>
        <Map
          google={google}
          zoom={5}
          style={style || {}}
          center={mapCenter}
          initialCenter={mapCenter}
          onClick={this.onMapClicked}
          adminTable={adminTable}
        >
          {data.map(eachDevice => (
            <Marker
              key={eachDevice.deviceName}
              title={eachDevice.deviceName}
              macId={eachDevice.macId}
              room={eachDevice.room}
              onClick={this.onMarkerClick}
              position={{ lat: eachDevice.latitude, lng: eachDevice.longitude }}
            />
          ))}
          <InfoWindow
            marker={activeMarker}
            onClose={this.onInfoWindowClose}
            visible={showingInfoWindow}
          >
            <div>{this.props.tooltipRenderer(selectedPlace)}</div>
          </InfoWindow>
        </Map>
      </Container>
    );
  }
}

export default MapContainer;

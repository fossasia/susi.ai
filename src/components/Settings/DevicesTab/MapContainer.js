import React, { Component } from 'react';
import styled from 'styled-components';
import { Map, InfoWindow, Marker } from 'google-maps-react';
import PropTypes from 'prop-types';

const Container = styled.div`
  width: 100%;
  height: 300px;
`;

class MapContainer extends Component {
  static propTypes = {
    devicesData: PropTypes.array,
    google: PropTypes.object,
    invalidLocationDevices: PropTypes.number,
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

  getMapCenter = (devicesData, invalidLocationDevices) => {
    const latitudeSum = devicesData.reduce(
      (a, b) => ({ latitude: a.latitude + b.latitude }),
      {
        latitude: 0.0,
      },
    ).latitude;
    const longitudeSum = devicesData.reduce(
      (a, b) => ({ longitude: a.longitude + b.longitude }),
      { longitude: 0.0 },
    ).longitude;

    return {
      lat: latitudeSum / (devicesData.length - invalidLocationDevices),
      lng: longitudeSum / (devicesData.length - invalidLocationDevices),
    };
  };

  render() {
    const { activeMarker, showingInfoWindow, selectedPlace } = this.state;
    const { google, devicesData = [], invalidLocationDevices } = this.props;
    const mapCenter = this.getMapCenter(devicesData, invalidLocationDevices);

    return (
      <Container>
        <Map
          google={google}
          zoom={5}
          center={mapCenter}
          initialCenter={mapCenter}
          onClick={this.onMapClicked}
          style={{ height: '300px', position: 'relative', width: '692px' }}
        >
          {devicesData.map(eachDevice => (
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
            <div>
              <p>
                {`Mac Address: ${selectedPlace.macId}`}
                <br />
                {`Room: ${selectedPlace.room}`}
                <br />
                {`Device Name: ${selectedPlace.title}`}
              </p>
            </div>
          </InfoWindow>
        </Map>
      </Container>
    );
  }
}

export default MapContainer;

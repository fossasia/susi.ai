import React from 'react';
import styled from 'styled-components';
import { GoogleApiWrapper } from 'google-maps-react';
import SettingsTabWrapper from '../SettingsTabWrapper';
import DevicesTable from './DevicesTable';
import MapContainer from './MapContainer';
import PropTypes from 'prop-types';
import uiActions from '../../../redux/actions/ui';
import { addUserDevice, removeUserDevice } from '../../../apis/index';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const EmptyDevicesText = styled.div`
  font-size: 24px;
  font-weight: 100;
  margin: 20px auto;
  max-width: 880px;
  text-align: center;
  font-family: 'Roboto', sans-serif;
`;

class DevicesTab extends React.Component {
  static propTypes = {
    google: PropTypes.object,
    actions: PropTypes.object,
    mapKey: PropTypes.string,
    accessToken: PropTypes.string,
    devices: PropTypes.object,
  };

  state = {
    mapCenter: { latitude: null, longitude: null },
    devicesData: [],
    invalidLocationDevices: 0,
    editIdx: null,
  };

  componentDidMount() {
    this.initialiseDevices();
  }

  handleRemoveDevice = rowIndex => {
    const data = this.state.devicesData;

    removeUserDevice({ macId: data[rowIndex].macId })
      .then(payload => {
        this.setState({
          devicesData: data.filter((row, index) => index !== rowIndex),
        });
        this.props.actions.closeModal();
      })
      .catch(error => {
        console.log(error);
      });
  };

  startEditing = rowIndex => {
    this.setState({ editIdx: rowIndex });
  };

  handleChange = (e, fieldName, rowIndex) => {
    const value = e.target.value;
    let data = this.state.devicesData;
    this.setState({
      devicesData: data.map((row, index) =>
        index === rowIndex ? { ...row, [fieldName]: value } : row,
      ),
    });
  };

  handleRemoveConfirmation = rowIndex => {
    this.props.actions.openModal({
      modalType: 'deleteDevice',
      removeDeviceIndex: rowIndex,
      removeDeviceName: this.state.devicesData[rowIndex].deviceName,
      onDeviceRemove: this.handleRemoveDevice,
      onCancel: this.props.actions.closeModal,
    });
  };

  handleDeviceSave = rowIndex => {
    this.setState({
      editIdx: -1,
    });
    const deviceData = this.state.devicesData[rowIndex];

    addUserDevice({ ...deviceData })
      .then(payload => {})
      .catch(error => {
        console.log(error);
      });
  };

  getMapCenter = (devicesData, invalidLocationDevices) => {
    const latitudeSum = devicesData.reduce(
      (a, b) => a.latitude + b.latitude,
      0,
    );
    const longitudeSum = devicesData.reduce(
      (a, b) => a.longitude + b.longitude,
      0,
    );

    return {
      latitude: latitudeSum / (devicesData.length - invalidLocationDevices),
      longitude: longitudeSum / (devicesData.length - invalidLocationDevices),
    };
  };

  initialiseDevices = () => {
    const { devices } = this.props;

    if (devices) {
      let devicesData = [];
      let deviceIds = Object.keys(devices);
      let invalidLocationDevices = 0;

      deviceIds.forEach(eachDevice => {
        const {
          name,
          room,
          geolocation: { latitude, longitude },
        } = devices[eachDevice];

        let deviceObj = {
          macId: eachDevice,
          deviceName: name,
          room,
          latitude,
          longitude,
          location: `${latitude}, ${longitude}`,
        };

        if (
          deviceObj.latitude === 'Latitude not available.' ||
          deviceObj.longitude === 'Longitude not available.'
        ) {
          deviceObj.location = 'Not found';
          invalidLocationDevices++;
        } else {
          deviceObj.latitude = parseFloat(latitude);
          deviceObj.longitude = parseFloat(longitude);
        }
        devicesData.push(deviceObj);
      });

      const mapCenter = this.getMapCenter(devicesData, invalidLocationDevices);
      this.setState({
        mapCenter,
        devicesData,
        invalidLocationDevices,
      });
    }
  };

  render() {
    const {
      mapCenter,
      devicesData,
      invalidLocationDevices,
      editIdx,
    } = this.state;
    const { google, mapKey } = this.props;
    return (
      <div>
        <SettingsTabWrapper heading="Devices">
          {devicesData.length ? (
            <div>
              <DevicesTable
                handleRemoveConfirmation={this.handleRemoveConfirmation}
                startEditing={this.startEditing}
                editIdx={editIdx}
                onDeviceSave={this.handleDeviceSave}
                handleChange={this.handleChange}
                tableData={devicesData}
              />
              <div>
                <div style={{ maxHeight: '300px', marginTop: '10px' }}>
                  {mapKey && (
                    <MapContainer
                      google={google}
                      devicesData={devicesData}
                      mapCenter={mapCenter}
                    />
                  )}
                </div>

                {invalidLocationDevices ? (
                  <div style={{ marginTop: '10px' }}>
                    <b>NOTE: </b>Location info of one or more devices could not
                    be retrieved.
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <EmptyDevicesText>
              You do not have any devices connected yet!
            </EmptyDevicesText>
          )}
        </SettingsTabWrapper>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    mapKey: store.app.apiKeys.mapKey || '',
    accessToken: store.app.accessToken || '',
    devices: store.settings.devices,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...uiActions }, dispatch),
  };
}

const LoadingContainer = props => (
  <div
    style={{
      top: '25%',
      left: '50%',
      transform: 'translate3d(170%,-50%, 0)',
      position: 'absolute',
    }}
  >
    Loading...
  </div>
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  GoogleApiWrapper(props => ({
    LoadingContainer: LoadingContainer,
    apiKey: props.mapKey,
  }))(DevicesTab),
);

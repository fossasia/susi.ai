import React from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import SettingsTabWrapper from './SettingsTabWrapper';
import TableComplex from '../TableComplex/TableComplex.react';
import SwipeableViews from 'react-swipeable-views';
import MapContainer from '../MapContainer/MapContainer.react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import RemoveDeviceDialog from '../TableComplex/RemoveDeviceDialog.react';
import Close from '@material-ui/icons/Close';
import {
  addUserDevice,
  removeUserDevice,
  getUserSettings,
} from '../../apis/index';
import { connect } from 'react-redux';

const closingStyle = {
  position: 'absolute',
  zIndex: 1200,
  fill: '#444',
  width: '26px',
  height: '26px',
  right: '10px',
  top: '10px',
  cursor: 'pointer',
};

class DevicesTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceData: false,
      tableData: [],
      mapObj: [],
      deviceNames: [],
      rooms: [],
      macids: [],
      editIdx: -1,
      removeDevice: -1,
      slideIndex: 0,
      centerLat: 0,
      centerLng: 0,
      serverFieldError: false,
      showRemoveConfirmation: false,
    };
  }

  // handleRemove() function handles deletion of devices
  handleRemove = i => {
    let data = this.state.obj;
    let macid = data[i].macid;

    // Remove the row whose index does not matches the index passed in parameter
    this.setState({
      obj: data.filter((row, j) => j !== i),
    });

    // Make API call to the endpoint to delete the device on the server side
    removeUserDevice({ macid })
      .then(payload => {})
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        window.location.reload();
      });
  };

  // startEditing() function handles editing of rows
  // editIdx is set to the row index which is currently being edited
  startEditing = i => {
    this.setState({ editIdx: i });
  };

  // handleChange() function handles changing of textfield values on keypresses
  handleChange = (e, name, i) => {
    const value = e.target.value;
    let data = this.state.obj;
    this.setState({
      obj: data.map((row, j) => (j === i ? { ...row, [name]: value } : row)),
    });
  };

  // Close dialog
  handleClose = () => {
    this.setState({
      showRemoveConfirmation: false,
    });
  };

  // Open Remove Device Confirmation dialog
  handleRemoveConfirmation = i => {
    let data = this.state.obj;
    let devicename = data[i].devicename;
    this.setState({
      showRemoveConfirmation: true,
      removeDevice: i,
      removeDeviceName: devicename,
    });
  };

  // stopEditing() function handles saving of the changed device config
  stopEditing = i => {
    let data = this.state.obj;
    let macid = data[i].macid;
    let devicename = data[i].devicename;
    let room = data[i].room;
    let latitude = data[i].latitude;
    let longitude = data[i].longitude;
    let devicenames = this.state.devicenames;
    devicenames[i] = devicename;
    let rooms = this.state.rooms;
    rooms[i] = room;

    // Set the value of editIdx to -1 to denote that no row is currently being edited
    // Set values for devicenames and rooms to pass as props for the Map View component
    this.setState({
      editIdx: -1,
      devicenames: devicenames,
      rooms: rooms,
    });

    // Make API call to the endpoint for adding new devices
    // to overwrite the updated config of devices on the existing config on the server

    addUserDevice({ macid, devicename, room, latitude, longitude })
      .then(payload => {})
      .catch(error => {
        console.log(error);
      });
  };

  // apiCall() function fetches user settings and devices from the server
  apiCall = () => {
    getUserSettings()
      .then(payload => {
        const { devices } = payload;
        let tableData = [];
        let mapObj = [];
        let deviceNames = [];
        let rooms = [];
        let macids = [];
        let centerLat = 0;
        let centerLng = 0;
        if (devices) {
          let keys = Object.keys(devices);
          let devicesNotAvailable = 0;

          // Extract device info and store them in an object, namely myObj
          keys.forEach(i => {
            const { name, room, geolocation } = devices[i];
            const { latitude, longitude } = geolocation;
            let myObj = {
              macid: i,
              devicename: name,
              room,
              latitude,
              longitude,
            };

            // Store location info of the device for the Map View
            let locationData = {
              lat: parseFloat(latitude),
              lng: parseFloat(longitude),
            };
            if (
              myObj.latitude === 'Latitude not available.' ||
              myObj.longitude === 'Longitude not available.'
            ) {
              devicesNotAvailable++;
            } else {
              centerLat += parseFloat(latitude);
              centerLng += parseFloat(longitude);
            }

            let location = {
              location: locationData,
            };
            tableData.push(myObj);
            mapObj.push(location);
            deviceNames.push(name);
            rooms.push(room);
            macids.push(i);
          });

          // Find average latitude and longitude to be used as initial center of map
          centerLat /= mapObj.length - devicesNotAvailable;
          centerLng /= mapObj.length - devicesNotAvailable;
          if (tableData.length) {
            this.setState({
              deviceData: true,
              tableData,
            });
          }
          if (mapObj.length) {
            this.setState({
              mapObj,
              centerLat,
              centerLng,
              devicesNotAvailable,
            });
          }
          if (deviceNames.length) {
            this.setState({
              deviceNames,
            });
          }
          if (rooms.length) {
            this.setState({
              rooms,
            });
          }
          if (macids.length) {
            this.setState({
              macids,
            });
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentDidMount() {
    const { accessToken } = this.props;
    if (accessToken) {
      this.apiCall();
    }
  }

  render() {
    const {
      deviceData,
      editIdx,
      centerLat,
      centerLng,
      deviceNames,
      devicesNotAvailable,
      slideIndex,
      rooms,
      macIds,
      mapObj,
      tableData,
      showRemoveConfirmation,
      removeDevice,
      removeDeviceName,
    } = this.state;
    const { google, mapKey } = this.props;
    return (
      <React.Fragment>
        <span style={{ right: '40px' }}>
          <SettingsTabWrapper heading="Devices">
            {deviceData ? (
              <div>
                <SwipeableViews>
                  <div>
                    <div style={{ overflowX: 'auto' }}>
                      <div
                        className="device_table"
                        style={{
                          left: '0px',
                          marginTop: '0px',
                          width: '550px',
                        }}
                      >
                        <TableComplex
                          handleRemove={this.handleRemove}
                          handleRemoveConfirmation={
                            this.handleRemoveConfirmation
                          }
                          startEditing={this.startEditing}
                          editIdx={editIdx}
                          stopEditing={this.stopEditing}
                          handleChange={this.handleChange}
                          tableData={tableData}
                        />
                      </div>
                      <div>
                        <div style={{ maxHeight: '300px', marginTop: '10px' }}>
                          {mapKey && (
                            <MapContainer
                              google={google}
                              mapData={mapObj}
                              centerLat={centerLat}
                              centerLng={centerLng}
                              deviceNames={deviceNames}
                              rooms={rooms}
                              macIds={macIds}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </SwipeableViews>
                {slideIndex && devicesNotAvailable ? (
                  <div style={{ marginTop: '10px' }}>
                    <b>NOTE: </b>Location info of one or more devices could not
                    be retrieved.
                  </div>
                ) : null}
              </div>
            ) : (
              <div id="subheading">
                You do not have any devices connected yet!
              </div>
            )}
          </SettingsTabWrapper>
        </span>
        <Dialog
          modal={false}
          maxWidth={'sm'}
          fullWidth={true}
          open={!showRemoveConfirmation}
          onClose={this.handleClose}
        >
          <RemoveDeviceDialog
            {...this.props}
            deviceIndex={removeDevice}
            devicename={removeDeviceName}
            handleRemove={this.handleRemove}
          />
          <Close style={closingStyle} onClick={this.handleClose} />
        </Dialog>
      </React.Fragment>
    );
  }
}

DevicesTab.propTypes = {
  google: PropTypes.object,
  mapKey: PropTypes.string,
  accessToken: PropTypes.string,
};

function mapStateToProps(store) {
  return {
    mapKey: store.app.apiKeys.mapKey || '',
  };
}

export default connect(
  mapStateToProps,
  null,
)(GoogleApiWrapper(props => ({ apiKey: props.mapKey }))(DevicesTab));

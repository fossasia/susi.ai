import React from 'react';
import styled from 'styled-components';
import DevicesTable from './DevicesTable';
import MapContainer from './MapContainer';
import PropTypes from 'prop-types';
import uiActions from '../../../redux/actions/ui';
import settingActions from '../../../redux/actions/settings';
import {
  addUserDevice,
  removeUserDevice,
  fetchDevices,
  modifyUserDevices,
} from '../../../apis/index';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _Paper from '@material-ui/core/Paper';
import CircularLoader from '../../shared/CircularLoader';
import Button from '@material-ui/core/Button';
import _Devices from '@material-ui/icons/Devices';
import ControlSection from '../../smart-speaker/Control';
import { withRouter } from 'react-router-dom';
import withGoogleApiWrapper from '../../../utils/withGoogleApiWrapper';

const Paper = styled(_Paper)`
  width: 100%;
  margin-bottom: 1.25rem;
  padding: 1rem 1rem 3rem;
  @media (max-width: 740) {
    padding: 0 0 3rem;
  }
`;

const SubHeading = styled.h1`
  color: rgba(0, 0, 0, 0.65);
  padding-left: 1.25rem;
`;

const AddDeviceButtonContainer = styled.div`
  text-align: right;
  margin-right: 1.25rem;
  @media (max-width: 600px) {
    text-align: left;
    margin-left: 1rem;
    margin-right: 0;
  }
`;

const Devices = styled(_Devices)`
  margin-right: 5px;
`;

function renderTooltip(selectedPlace) {
  return (
    <p>
      {`Mac Address: ${selectedPlace.macId}`}
      <br />
      {`Room: ${selectedPlace.room}`}
      <br />
      {`Device Name: ${selectedPlace.title}`}
    </p>
  );
}

class DeviceSettings extends React.Component {
  static propTypes = {
    google: PropTypes.object,
    actions: PropTypes.object,
    mapKey: PropTypes.string,
    accessToken: PropTypes.string,
    devices: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object,
  };
  state = {
    loading: true,
    devicesData: [],
    invalidLocations: 0,
    editIdx: null,
    emptyText: 'You do not have any devices connected yet!',
    value: 0,
    macId: '',
    email: '',
  };

  componentDidMount() {
    const parameters = new URL(window.location).searchParams;
    const email = parameters.get('email');
    const macId = parameters.get('macId');
    if (email) {
      this.loadDevices(email, macId);
    } else {
      this.loadUserDevices();
    }
    document.title =
      'My Devices - SUSI.AI - Open Source Artificial Intelligence for Personal Assistants, Robots, Help Desks and Chatbots';
  }

  loadUserDevices = async () => {
    const { actions } = this.props;
    try {
      await actions.getUserDevices();
      this.initialiseDevices();
      this.setState({
        loading: false,
        emptyText: 'You do not have any devices connected yet!',
      });
    } catch (error) {
      this.setState({
        loading: false,
        emptyText: 'Some error occurred while fetching the devices!',
      });
      console.log(error);
    }
  };

  loadDevices = async (email, macId) => {
    try {
      let payload = await fetchDevices({ search: email });
      const { devices } = payload;
      let devicesData = [];
      let invalidLocations = 0;
      devices.forEach(device => {
        const email = device.name;
        const devices = device.devices;
        const macIdArray = Object.keys(devices);
        macIdArray.forEach(macId => {
          const device = devices[macId];
          let deviceName = device.name !== undefined ? device.name : '-';
          deviceName =
            deviceName.length > 30
              ? deviceName.substr(0, 30) + '...'
              : deviceName;
          let location = 'Location not given';
          if (device.geolocation) {
            location = `${device.geolocation.latitude},${device.geolocation.longitude}`;
          } else {
            invalidLocations++;
          }
          const deviceObj = {
            deviceName,
            macId,
            email,
            room: device.room,
            location,
            latitude:
              device.geolocation !== undefined
                ? device.geolocation.latitude
                : '-',
            longitude:
              device.geolocation !== undefined
                ? device.geolocation.longitude
                : '-',
          };
          devicesData.push(deviceObj);
        });
      });
      this.setState({
        devicesData,
        invalidLocations,
        loading: false,
        macId,
        value: macId ? macId : 0,
        email,
      });
    } catch (error) {
      console.log(error);
    }
  };

  handleRemoveDevice = async rowIndex => {
    const data = this.state.devicesData;
    const { email } = this.state;
    try {
      await removeUserDevice({ macId: data[rowIndex].macId, email });
      this.setState({
        devicesData: data.filter((row, index) => index !== rowIndex),
      });
      this.props.actions.closeModal();
    } catch (error) {
      console.log(error);
    }
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
      name: this.state.devicesData[rowIndex].deviceName,
      handleConfirm: () => this.handleRemoveDevice(rowIndex),
      handleClose: this.props.actions.closeModal,
    });
  };

  handleDeviceSave = async rowIndex => {
    this.setState({
      editIdx: -1,
    });
    const deviceData = this.state.devicesData[rowIndex];

    try {
      await addUserDevice({ ...deviceData });
    } catch (error) {
      console.log(error);
    }
  };

  handleEditByAdmin = async rowIndex => {
    this.setState({
      editIdx: -1,
    });
    const deviceData = this.state.devicesData[rowIndex];
    const { email, deviceName, macId, room } = deviceData;
    try {
      await modifyUserDevices({ email, name: deviceName, macid: macId, room });
    } catch (error) {
      console.log(error);
    }
  };

  handleView = rowIndex => {
    const { history } = this.props;
    const macId = this.state.devicesData[rowIndex].macId;
    this.setState({ macId, value: macId });
    history.replace(`/mydevices/${macId}`);
  };

  initialiseDevices = () => {
    const { devices } = this.props;

    if (devices) {
      let devicesData = [];
      let deviceIds = Object.keys(devices);
      let invalidLocations = 0;

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
          invalidLocations++;
        } else {
          deviceObj.latitude = parseFloat(latitude);
          deviceObj.longitude = parseFloat(longitude);
        }
        devicesData.push(deviceObj);
      });

      this.setState({
        devicesData,
        invalidLocations,
      });
    }
  };

  initilizeData = () => {
    const pathArr = this.props.location.pathname.split('/');
    let macId = '';
    if (pathArr.length === 2) {
      return;
    }
    macId = pathArr[3];

    this.setState({ macId });
  };

  handleAddDevice = () => {
    this.props.actions.openModal({
      modalType: 'addDevice',
      handleClose: this.props.actions.closeModal,
    });
  };

  renderDevicesInfo = () => {
    const { devicesData, invalidLocations, editIdx, email } = this.state;
    const { google, mapKey } = this.props;
    return (
      <div>
        <Paper>
          <SubHeading>Devices</SubHeading>
          <AddDeviceButtonContainer>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleAddDevice}
            >
              <Devices /> Add Device
            </Button>
          </AddDeviceButtonContainer>
          <DevicesTable
            handleRemoveConfirmation={this.handleRemoveConfirmation}
            startEditing={this.startEditing}
            editIdx={editIdx}
            onDeviceSave={
              email ? this.handleEditByAdmin : this.handleDeviceSave
            }
            onView={this.handleView}
            handleChange={this.handleChange}
            tableData={devicesData}
          />
        </Paper>
        <Paper>
          <SubHeading>Map</SubHeading>
          <div style={{ maxHeight: '300px', marginTop: '10px' }}>
            {mapKey && (
              <MapContainer
                tooltipRenderer={renderTooltip}
                google={google}
                data={devicesData}
                invalidLocations={invalidLocations}
              />
            )}
          </div>

          {invalidLocations ? (
            <div style={{ marginTop: '10px' }}>
              <b>NOTE: </b>Location info of one or more devices could not be
              retrieved.
            </div>
          ) : null}
        </Paper>
      </div>
    );
  };

  renderDeviceConfig = (macId, deviceName) => {
    return (
      <React.Fragment>
        {this.renderDevicesInfo()}
        <ControlSection macId={macId} deviceName={deviceName} />
      </React.Fragment>
    );
  };

  generateView = () => {
    const pathArr = this.props.location.pathname.split('/');
    if (pathArr.length === 2) {
      return this.renderDevicesInfo();
    }
    return this.renderDeviceConfig(pathArr[2], pathArr[3]);
  };

  render() {
    const { loading } = this.state;
    if (loading) {
      return <LoadingContainer />;
    }
    return <React.Fragment>{this.generateView()}</React.Fragment>;
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
    actions: bindActionCreators({ ...uiActions, ...settingActions }, dispatch),
  };
}

const LoadingContainer = props => <CircularLoader height={27} />;

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(withGoogleApiWrapper(DeviceSettings)),
);

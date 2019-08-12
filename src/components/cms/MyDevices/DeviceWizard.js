import React from 'react';
import PropTypes from 'prop-types';
import DevicesTable from './DevicesTable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import uiActions from '../../../redux/actions/ui';
import {
  addUserDevice,
  removeUserDevice,
  fetchDevices,
  modifyUserDevices,
} from '../../../apis/index';
import MapContainer from './MapContainer';
import { GoogleApiWrapper } from 'google-maps-react';
import CircularLoader from '../../shared/CircularLoader';
import ControlSection from './ControlSection';
import ConfigureSection from './ConfigureSection';
import { Paper, ErrorText, OverlayContainer } from './styles';

class DeviceWizard extends React.Component {
  static propTypes = {
    location: PropTypes.object,
    actions: PropTypes.object,
    google: PropTypes.object,
    mapKey: PropTypes.string,
    devices: PropTypes.object,
    userName: PropTypes.string,
    email: PropTypes.string,
    isLocalEnv: PropTypes.bool,
    macId: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.macId = this.props.macId;
    this.state = {
      devicesData: [],
      editIdx: null,
      email: '',
      loading: true,
      invalidLocationDevices: 0,
      synchronizePublicSkills: true,
      synchronizePrivateSkills: false,
      speechToText: 'Google',
      textToSpeech: 'Google',
    };
  }

  componentDidMount() {
    const parameters = new URL(window.location).searchParams;
    const email = parameters.get('email');
    if (email) {
      this.loadDevice(email);
    } else {
      this.initialiseDevice();
    }
  }

  componentDidUpdate(prevProps) {
    const { macId } = this.props;
    if (prevProps.macId !== macId) {
      this.macId = macId;
      this.initialiseDevice();
    }
  }

  loadDevice = email => {
    fetchDevices({ search: email })
      .then(payload => {
        const { devices } = payload;
        let devicesData = [];
        let invalidLocationDevices = 0;
        devices.forEach(eachDevice => {
          const macId = this.macId;
          const email = eachDevice.name;
          const devices = eachDevice.devices;
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
            invalidLocationDevices++;
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
        this.setState({
          devicesData,
          invalidLocationDevices,
          email,
          loading: false,
        });
      })
      .catch(error => {
        this.setState({ loading: false });
        console.log(error);
      });
  };

  handleRemoveDevice = () => {
    const macId = this.macId;
    const { email } = this.state;
    removeUserDevice({ macId, email })
      .then(payload => {
        this.props.actions.closeModal();
        email !== ''
          ? window.location.replace(`/mydevices?email=${email}`)
          : window.location.replace('/mydevices');
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

  handleRemoveConfirmation = () => {
    this.props.actions.openModal({
      modalType: 'deleteDevice',
      name: this.state.devicesData[0].deviceName,
      handleConfirm: this.handleRemoveDevice,
      handleClose: this.props.actions.closeModal,
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

  handleEditByAdmin = rowIndex => {
    this.setState({
      editIdx: -1,
    });
    const deviceData = this.state.devicesData[rowIndex];
    const { email, deviceName, macId, room } = deviceData;
    modifyUserDevices({ email, name: deviceName, macid: macId, room })
      .then(payload => {})
      .catch(error => {
        console.log(error);
      });
  };

  handleCheck = event => {
    this.setState({
      [event.target.name]: event.target.checked,
    });
  };

  handleChangeSpeech = event => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  initialiseDevice = () => {
    const { devices } = this.props;
    if (devices) {
      let macId = this.macId;
      let deviceIds = Object.keys(devices);

      const deviceExists = deviceIds.filter(
        deviceId => deviceId === this.macId,
      );
      if (deviceExists.length > 0) {
        let invalidLocationDevices = 0;
        const {
          name,
          room,
          geolocation: { latitude, longitude },
        } = devices[macId];
        let devicesData = [];
        let deviceObj = {
          macId,
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
        this.setState({
          devicesData,
          invalidLocationDevices,
        });
      }
    }
    this.setState({ loading: false });
  };

  render() {
    const {
      devicesData,
      editIdx,
      synchronizePublicSkills,
      synchronizePrivateSkills,
      invalidLocationDevices,
      speechToText,
      textToSpeech,
      email,
      loading,
    } = this.state;
    const macId = this.macId;
    const { mapKey, google } = this.props;
    if (loading) {
      return <LoadingContainer />;
    }
    return (
      <React.Fragment>
        {devicesData.length ? (
          <div>
            <Paper>
              <h1>Device</h1>
              <DevicesTable
                handleRemoveConfirmation={this.handleRemoveConfirmation}
                startEditing={this.startEditing}
                editIdx={editIdx}
                onDeviceSave={
                  email ? this.handleEditByAdmin : this.handleDeviceSave
                }
                handleChange={this.handleChange}
                tableData={devicesData}
                deviceWizard={true}
              />
            </Paper>
            <Paper>
              <h1>Map</h1>
              <div>
                <div
                  style={{
                    maxHeight: '300px',
                    marginTop: '10px',
                  }}
                >
                  {mapKey && (
                    <MapContainer
                      google={google}
                      devicesData={devicesData}
                      invalidLocationDevices={invalidLocationDevices}
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
            </Paper>
            <ConfigureSection
              synchronizePublicSkills={synchronizePublicSkills}
              synchronizePrivateSkills={synchronizePrivateSkills}
              speechToText={speechToText}
              textToSpeech={textToSpeech}
              handleCheck={this.handleCheck}
              handleChangeSpeech={this.handleChangeSpeech}
              handleRemoveConfirmation={this.handleRemoveConfirmation}
            />
            <OverlayContainer>
              <ControlSection />
            </OverlayContainer>
          </div>
        ) : (
          <ErrorText>
            Device with Mac Id : <b>{macId}</b> is not connected.
          </ErrorText>
        )}
      </React.Fragment>
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

const LoadingContainer = props => <CircularLoader height={27} />;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  GoogleApiWrapper(props => ({
    LoadingContainer: LoadingContainer,
    apiKey: props.mapKey,
  }))(DeviceWizard),
);

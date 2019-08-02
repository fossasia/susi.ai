import React from 'react';
import styled from 'styled-components';
import { GoogleApiWrapper } from 'google-maps-react';
import DevicesTable from './DevicesTable';
import MapContainer from './MapContainer';
import PropTypes from 'prop-types';
import uiActions from '../../../redux/actions/ui';
import settingActions from '../../../redux/actions/settings';
import { addUserDevice, removeUserDevice } from '../../../apis/index';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import _Paper from '@material-ui/core/Paper';
import CircularLoader from '../../shared/CircularLoader';
import Button from '@material-ui/core/Button';
import _Devices from '@material-ui/icons/Devices';
import DeviceWizard from './DeviceWizard';

const EmptyDevicesText = styled.div`
  font-size: 24px;
  font-weight: 100;
  margin: 20px auto;
  max-width: 880px;
  text-align: center;
  font-family: 'Roboto', sans-serif;
`;

const Container = styled.div`
  margin: 0rem 0.625rem;
  padding: 1.25rem 1.875rem 1.875rem;
  @media (max-width: 480px) {
    padding: 1.25rem 1rem 1.875rem;
  }
`;

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

class DevicesTab extends React.Component {
  static propTypes = {
    google: PropTypes.object,
    actions: PropTypes.object,
    mapKey: PropTypes.string,
    accessToken: PropTypes.string,
    devices: PropTypes.object,
  };

  state = {
    loading: true,
    devicesData: [],
    invalidLocationDevices: 0,
    editIdx: null,
    emptyText: 'You do not have any devices connected yet!',
    value: 0,
    macId: '',
  };

  componentDidMount() {
    const { accessToken, actions } = this.props;
    if (accessToken) {
      actions
        .getUserDevices()
        .then(({ payload }) => {
          this.initialiseDevices();
          this.setState({
            loading: false,
            emptyText: 'You do not have any devices connected yet!',
          });
        })
        .catch(error => {
          this.setState({
            loading: false,
            emptyText: 'Some error occurred while fetching the devices!',
          });
          console.log(error);
        });
    }
    document.title =
      'My Devices - SUSI.AI - Open Source Artificial Intelligence for Personal Assistants, Robots, Help Desks and Chatbots';
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
      name: this.state.devicesData[rowIndex].deviceName,
      handleConfirm: () => this.handleRemoveDevice(rowIndex),
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

  handleView = rowIndex => {
    const macId = this.state.devicesData[rowIndex].macId;
    this.setState({ macId, value: macId });
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

      this.setState({
        devicesData,
        invalidLocationDevices,
      });
    }
  };

  handleAddDevice = () => {
    this.props.actions.openModal({
      modalType: 'addDevice',
      handleClose: this.props.actions.closeModal,
    });
  };

  handleTabChange = (event, value) => {
    this.setState({ value, macId: event.currentTarget.name });
  };

  generateTabs = () => {
    const { devicesData } = this.state;
    let Tabs = [];
    devicesData.forEach(device => {
      Tabs.push(
        <Tab
          label={
            device.deviceName.length > 30
              ? device.deviceName.substr(0, 30) + '..'
              : device.deviceName
          }
          name={device.macId}
          value={device.macId}
        />,
      );
    });
    return Tabs;
  };

  render() {
    const {
      devicesData,
      invalidLocationDevices,
      editIdx,
      loading,
      emptyText,
      value,
      macId,
    } = this.state;
    const { google, mapKey } = this.props;
    if (loading) {
      return <LoadingContainer />;
    }
    return (
      <Container>
        {devicesData.length ? (
          <div>
            <Tabs onChange={this.handleTabChange} value={value}>
              <Tab label="All" />
              {this.generateTabs()}
            </Tabs>
            {value === 0 && (
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
                    onDeviceSave={this.handleDeviceSave}
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
                        google={google}
                        devicesData={devicesData}
                        invalidLocationDevices={invalidLocationDevices}
                      />
                    )}
                  </div>

                  {invalidLocationDevices ? (
                    <div style={{ marginTop: '10px' }}>
                      <b>NOTE: </b>Location info of one or more devices could
                      not be retrieved.
                    </div>
                  ) : null}
                </Paper>
              </div>
            )}
            {value !== 0 && <DeviceWizard macId={macId} />}
          </div>
        ) : (
          <EmptyDevicesText>{emptyText}</EmptyDevicesText>
        )}
      </Container>
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
    actions: bindActionCreators({ ...uiActions, ...settingActions }, dispatch),
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
  }))(DevicesTab),
);

import React from 'react';
import PropTypes from 'prop-types';
import DevicesTable from './DevicesTable';
import { connect } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import _Paper from '@material-ui/core/Paper';
import { bindActionCreators } from 'redux';
import uiActions from '../../../redux/actions/ui';
import { addUserDevice, removeUserDevice } from '../../../apis/index';
import MapContainer from './MapContainer';
import { GoogleApiWrapper } from 'google-maps-react';
import CircularLoader from '../../shared/CircularLoader';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import styled from 'styled-components';

const Paper = styled(_Paper)`
  width: 100%;
  margin-top: 1.25rem;
  padding: 1rem 1rem 3rem;
  @media (max-width: 740) {
    padding: 0 0 3rem;
  }
`;

const SubHeading = styled.h1`
  color: rgba(0, 0, 0, 0.65);
  padding-left: 1.25rem;
`;

const Container = styled.div`
  padding: 4rem 4rem 2rem;
  @media (max-width: 480px) {
    padding: 4rem 1rem 2rem;
  }
`;

const CustomButton = styled(Button)`
  margin-left: 35px;
  margin-bottom: 10px;
  display: block;
`;

const Bold = styled.b`
  font-size: 16px;
`;

const SpeechToTextDiv = styled.div`
  padding: 10px 0px;
`;

const SaveButton = styled(Button)`
  display: block;
  margin-bottom: 10px;
`;

const ErrorText = styled.div`
  font-size: 40px;
  text-align: center;
  top: 40%;
  position: absolute;
  width: 100%;
  padding: 0px 20px;

  @media (max-width: 600px) {
    font-size: 30px;
    padding: 0px 20px;
  }
`;

const serviceMenu = ['Google', 'IBM Watson'];

class DeviceWizard extends React.Component {
  static propTypes = {
    location: PropTypes.object,
    actions: PropTypes.object,
    google: PropTypes.object,
    mapKey: PropTypes.string,
    devices: PropTypes.object,
    userName: PropTypes.string,
    email: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.macId = this.props.location.pathname.split('/')[2];
    this.state = {
      devicesData: [],
      editIdx: null,
      invalidLocationDevices: 0,
      synchronizePublicSkills: true,
      synchronizePrivateSkills: false,
      speechToText: 'Google',
      textToSpeech: 'Google',
    };
  }

  componentDidMount() {
    this.initialiseDevice();
  }

  handleRemoveDevice = () => {
    const macId = this.macId;
    removeUserDevice({ macId })
      .then(payload => {
        this.props.actions.closeModal();
        window.location.replace('/settings');
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
      removeDeviceName: this.state.devicesData[0].deviceName,
      onDeviceRemove: this.handleRemoveDevice,
      onCancel: this.props.actions.closeModal,
      deviceWizard: true,
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
    } = this.state;
    let macId = this.macId;
    const { userName, email, mapKey, google } = this.props;
    return (
      <React.Fragment>
        {devicesData.length ? (
          <Container>
            <Paper>
              <SubHeading>Device</SubHeading>
              <DevicesTable
                handleRemoveConfirmation={this.handleRemoveConfirmation}
                startEditing={this.startEditing}
                editIdx={editIdx}
                onDeviceSave={this.handleDeviceSave}
                handleChange={this.handleChange}
                tableData={devicesData}
                deviceWizard={true}
              />
            </Paper>
            <Paper>
              <SubHeading>Configure</SubHeading>
              <div>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="synchronizePublicSkills"
                      checked={synchronizePublicSkills}
                      onChange={this.handleCheck}
                      color="primary"
                    />
                  }
                  label="(Coming Soon) Synchronize local skills with SUSI.AI skills database regularly"
                />
                <CustomButton variant="contained" color="primary" size="small">
                  Synchronize Now
                </CustomButton>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="synchronizePrivateSkills"
                      checked={synchronizePrivateSkills}
                      onChange={this.handleCheck}
                      color="primary"
                    />
                  }
                  label="(Coming Soon) Synchronize (upload) private skills I create locally with my online account when online"
                />
                <CustomButton variant="contained" color="primary" size="small">
                  Upload Now
                </CustomButton>
              </div>
              <div style={{ paddingLeft: '35px' }}>
                <Bold>Speech Recognition and Voice Output on Device</Bold>
                <SpeechToTextDiv>
                  Speech to Text:{' '}
                  <Select
                    name="speechToText"
                    value={speechToText}
                    onChange={this.handleChangeSpeech}
                  >
                    {serviceMenu.map((service, index) => {
                      return (
                        <MenuItem value={service} key={index}>
                          {service}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </SpeechToTextDiv>
                <SpeechToTextDiv>
                  Text to Speech:{' '}
                  <Select
                    name="textToSpeech"
                    value={textToSpeech}
                    onChange={this.handleChangeSpeech}
                  >
                    {serviceMenu.map((service, index) => {
                      return (
                        <MenuItem value={service} key={index}>
                          {service}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </SpeechToTextDiv>
                <SaveButton variant="contained" color="primary" size="small">
                  Save Changes
                </SaveButton>
                <Bold>
                  Device linked to SUSI.AI account{' '}
                  {userName !== '' ? userName : email}
                </Bold>{' '}
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={this.handleRemoveConfirmation}
                >
                  Unlink
                </Button>
              </div>
            </Paper>
            <Paper>
              <SubHeading>Map</SubHeading>
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
          </Container>
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
    email: store.app.email,
    userName: store.settings.userName,
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

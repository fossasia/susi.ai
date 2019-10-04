import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DeviceSettings from './DeviceSettings';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import settingActions from '../../../redux/actions/settings';
import { withRouter } from 'react-router-dom';

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

class DevicesTab extends React.Component {
  static propTypes = {
    devices: PropTypes.object,
    history: PropTypes.object,
    actions: PropTypes.object,
  };

  state = {
    loading: true,
    devicesData: [],
    emptyText: 'You do not have any devices connected yet!',
    value: 0,
  };

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

  componentDidMount() {
    this.loadUserDevices();
  }

  handleTabChange = (event, value) => {
    const { name: macId } = event.currentTarget;
    this.setState({ value, macId });
    const { history } = this.props;
    if (macId) {
      history.replace(`/mydevices/${macId}`);
    } else {
      history.replace('/mydevices');
    }
  };

  generateTabs = () => {
    const { devicesData } = this.state;
    let Tabs = [];
    devicesData.forEach((device, i) => {
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
    const { value, devicesData, emptyText } = this.state;
    return (
      <Container>
        {devicesData.length ? (
          <div>
            <Tabs onChange={this.handleTabChange} value={value}>
              <Tab label="All" />
              {this.generateTabs()}
            </Tabs>
            <DeviceSettings />
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
    devices: store.settings.devices,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(settingActions, dispatch),
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(DevicesTab),
);

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import uiActions from '../../../redux/actions/ui';
import MaterialTable from 'material-table';
import { fetchDevices } from '../../../apis/index';
import { DEVICE } from './constants';
import Popover from '@material-ui/core/Popover';
import MapContainer from '../../cms/MyDevices/MapContainer';
import { ActionSpan, ActionSeparator } from '../../shared/TableActionStyles';
import { removeUserDevice, modifyUserDevices } from '../../../apis/index';
import moment from 'moment';
import withGoogleApiWrapper from '../../../utils/withGoogleApiWrapper';

class ListDevices extends React.Component {
  state = {
    devices: [],
    loadingDevices: true,
    macId: '',
    email: '',
    anchorEl: null,
    displayDeviceOnMap: [],
  };

  componentDidMount() {
    this.loadDevices();
  }

  loadDevices = async () => {
    try {
      let payload = await fetchDevices();
      const { devices } = payload;
      let devicesArray = [];
      devices.forEach(device => {
        const email = device.name;
        const devices = device.devices;
        const macIdArray = Object.keys(devices);
        const lastLoginIP =
          device.lastLoginIP !== undefined ? device.lastLoginIP : '-';
        const lastActive =
          device.lastActive !== undefined
            ? moment(new Date(device.lastActive)).format(
                'MMMM Do YYYY, H:mm:ss',
              )
            : '-';
        macIdArray.forEach(macId => {
          const device = devices[macId];
          let deviceName = device.name !== undefined ? device.name : '-';
          let location = 'Location not given';
          if (device.geolocation) {
            location = (
              <span
                onClick={this.handleClick}
                name={macId}
                style={{ cursor: 'pointer', color: '#49a9ee' }}
              >
                {device.geolocation.latitude},
                <br />
                {device.geolocation.longitude}
              </span>
            );
          }
          const dateAdded =
            device.deviceAddTime !== undefined
              ? moment(new Date(device.deviceAddTime)).format(
                  'MMMM Do YYYY, H:mm:ss',
                )
              : '-';

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
            dateAdded,
            lastActive,
            lastLoginIP,
          };
          devicesArray.push(deviceObj);
        });
      });
      this.setState({
        loadingDevices: false,
        devices: devicesArray,
      });
    } catch (error) {
      console.log(error);
    }
  };

  confirmDelete = async () => {
    const { actions } = this.props;
    const { macId, email } = this.state;
    try {
      let payload = await removeUserDevice({ macId, email });
      actions.openSnackBar({
        snackBarMessage: payload.message,
        snackBarDuration: 2000,
      });
      actions.closeModal();
      this.setState({
        loadingDevices: true,
      });
      this.loadDevices();
    } catch (error) {
      actions.openSnackBar({
        snackBarMessage: `Unable to delete device with macID ${macId}. Please try again.`,
        snackBarDuration: 2000,
      });
    }
  };

  handleDelete = (macId, deviceName, email) => {
    this.setState({
      macId,
      email,
    });
    this.props.actions.openModal({
      modalType: 'deleteDevice',
      handleConfirm: this.confirmDelete,
      name: deviceName,
      handleClose: this.props.actions.closeModal,
    });
  };

  confirmEdit = async (email, macid, room, name) => {
    const { actions } = this.props;
    try {
      let payload = await modifyUserDevices({ email, macid, room, name });
      actions.openSnackBar({
        snackBarMessage: payload.message,
        snackBarDuration: 2000,
      });
      actions.closeModal();
      this.setState({ loadingDevices: true });
      this.loadDevices();
    } catch (error) {
      actions.openSnackBar({
        snackBarMessage: `Unable to update device with macID ${macid}. Please try again.`,
        snackBarDuration: 2000,
      });
    }
  };

  handleEdit = (email, macId, room, deviceName) => {
    this.props.actions.openModal({
      modalType: 'editDevice',
      email,
      macId,
      room,
      deviceName,
      handleConfirm: this.confirmEdit,
      handleClose: this.props.actions.closeModal,
    });
  };

  handleClick = event => {
    let displayDeviceOnMap = [];
    const { devices } = this.state;
    devices.forEach(device => {
      if (device.macId === event.currentTarget.name) {
        const { deviceName, room, macId, latitude, longitude } = device;
        let deviceObj = {
          deviceName,
          room,
          macId,
          latitude,
          longitude,
        };
        displayDeviceOnMap.push(deviceObj);
      }
    });
    this.setState({
      anchorEl: event.currentTarget,
      displayDeviceOnMap,
    });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const {
      loadingDevices,
      anchorEl,
      displayDeviceOnMap,
      devices,
    } = this.state;
    const { google, mapKey } = this.props;
    const open = !!anchorEl;

    return (
      <Fragment>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          {mapKey && (
            <MapContainer
              google={google}
              devicesData={displayDeviceOnMap}
              invalidLocationDevices={0}
              adminTable={true}
            />
          )}
        </Popover>
        <MaterialTable
          isLoading={loadingDevices}
          options={{
            actionsColumnIndex: -1,
            pageSize: 10,
          }}
          columns={DEVICE}
          data={devices}
          title=""
          style={{
            padding: '1rem',
            margin: '2rem',
          }}
          actions={[
            rowData => ({
              onEdit: (event, rowData) => {
                this.handleEdit(
                  rowData.email,
                  rowData.macId,
                  rowData.room,
                  rowData.deviceName,
                );
              },
              onDelete: (event, rowData) => {
                this.handleDelete(
                  rowData.macId,
                  rowData.deviceName,
                  rowData.email,
                );
              },
            }),
          ]}
          components={{
            Action: props => (
              <React.Fragment>
                <Link
                  to={`/mydevices?email=${props.data.email}&macId=${props.data.macId}`}
                >
                  <ActionSpan>View</ActionSpan>
                </Link>
                <ActionSeparator> | </ActionSeparator>
                <ActionSpan
                  onClick={event => props.action.onEdit(event, props.data)}
                >
                  Edit
                </ActionSpan>
                <ActionSeparator> | </ActionSeparator>
                <ActionSpan
                  onClick={event => props.action.onDelete(event, props.data)}
                >
                  Delete
                </ActionSpan>
              </React.Fragment>
            ),
          }}
        />
      </Fragment>
    );
  }
}

ListDevices.propTypes = {
  actions: PropTypes.object,
  google: PropTypes.object,
  mapKey: PropTypes.string,
};

function mapStateToProps(store) {
  return {
    mapKey: store.app.apiKeys.mapKey || '',
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withGoogleApiWrapper(ListDevices));

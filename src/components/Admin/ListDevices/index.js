import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import uiActions from '../../../redux/actions/ui';
import MaterialTable from 'material-table';
import { fetchDevices } from '../../../apis/index';
import { DEVICE } from './constants';
import { ActionDiv } from '../../shared/TableActionStyles';
import { removeUserDevice } from '../../../apis/index';

class ListDevices extends React.Component {
  state = {
    devices: [],
    loadingDevices: true,
    macId: '',
    email: '',
  };

  componentDidMount() {
    this.loadDevices();
  }

  loadDevices = () => {
    fetchDevices()
      .then(payload => {
        const { devices } = payload;
        let devicesArray = [];
        devices.forEach(device => {
          const email = device.name;
          const devices = device.devices;
          const macIdArray = Object.keys(devices);
          macIdArray.forEach(macId => {
            const device = devices[macId];
            let location = 'Location not given';
            if (device.geolocation) {
              location = `${device.geolocation.latitude},${device.geolocation.longitude}`;
            }
            const deviceObj = {
              deviceName: device.name,
              macId,
              email,
              room: device.room,
              location,
            };
            devicesArray.push(deviceObj);
          });
        });
        this.setState({ loadingDevices: false, devices: devicesArray });
      })
      .catch(error => {
        console.log(error);
      });
  };

  confirmDelete = () => {
    const { actions } = this.props;
    const { macId, email } = this.state;
    removeUserDevice({ macId, email })
      .then(payload => {
        actions.openSnackBar({
          snackBarMessage: payload.message,
          snackBarDuration: 2000,
        });
        actions.closeModal();
        this.setState({
          loadingDevices: true,
        });
        this.loadDevices();
      })
      .catch(error => {
        actions.openSnackBar({
          snackBarMessage: `Unable to delete device with macID ${macId}. Please try again.`,
          snackBarDuration: 2000,
        });
      });
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

  render() {
    const { loadingDevices, devices } = this.state;
    return (
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
          {
            onDelete: (event, rowData) => {
              this.handleDelete(
                rowData.macId,
                rowData.deviceName,
                rowData.email,
              );
            },
          },
        ]}
        components={{
          Action: props => (
            <ActionDiv
              onClick={event => props.action.onDelete(event, props.data)}
            >
              Delete
            </ActionDiv>
          ),
        }}
      />
    );
  }
}

ListDevices.propTypes = {
  actions: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch),
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(ListDevices);

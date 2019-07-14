import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.div`
  padding: 0 4rem;
  background-color: #f7f7f7;
`;

class DevicePanel extends React.Component {
  state = {
    deviceName: '',
    room: '',
    macid: '',
    showEditDeviceDialog: false,
  };

  editDevice = (deviceName, room, macid) => {
    this.setState({
      deviceName: deviceName,
      room: room,
      macid: macid,
      showEditDeviceDialog: true,
    });
  };

  render() {
    const { data = [] } = this.props;
    return (
      <Container>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Device Name</TableCell>
              <TableCell>Mac Id</TableCell>
              <TableCell>Room</TableCell>
              <TableCell>Latitude</TableCell>
              <TableCell>Longitude</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(({ devicename, macid, room, latitude, longitude }) => (
              <TableRow key={macid}>
                <TableCell>{devicename}</TableCell>
                <TableCell>{macid}</TableCell>
                <TableCell>{room}</TableCell>
                <TableCell>{latitude}</TableCell>
                <TableCell>{longitude}</TableCell>
                <TableCell>
                  <span
                    onClick={() => this.editDevice(devicename, room, macid)}
                  >
                    Edit
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    );
  }
}

DevicePanel.propTypes = {
  reports: PropTypes.array,
  data: PropTypes.array,
};

export default DevicePanel;

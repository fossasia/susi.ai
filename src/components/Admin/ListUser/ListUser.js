import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from 'antd/lib/table';
import { Input } from 'antd';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputField from '@material-ui/core/Input';
import {
  changeUserRole,
  deleteUserAccount,
  modifyUserDevices,
  fetchAdminUserStats,
} from '../../../apis/index';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import 'antd/lib/table/style/index.css';
import './ListUser.css';
import styled from 'styled-components';

const ActionSpan = styled.span`
  cursor: pointer;
  color: #49a9ee;
`;

const ActionSeparator = styled.span`
  margin-left: 0.313rem;
  margin-right: 0.313rem;
`;

const Search = Input.Search;

class ListUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: [],
      userEmail: '',
      data: [],
      middle: '50',
      pagination: {},
      loading: true,
      search: false,
      showEditDialog: false,
      showDeleteDialog: false,
      changeRoleDialog: false,
      showEditDeviceDialog: false,
      deleteSuccessDialog: false,
      editDeviceSuccessDialog: false,
      editDeviceFailedDialog: false,
      deleteFailedDialog: false,
    };
    this.columns = [
      {
        title: 'S.No.',
        dataIndex: 'serialNum',
        sorter: false,
        width: '5%',
      },
      {
        title: 'Email ID',
        dataIndex: 'email',
        sorter: false,
        width: '20%',
        key: 'email',
      },
      {
        title: 'User Name',
        dataIndex: 'userName',
        width: '12%',
      },
      {
        title: 'Activation Status',
        dataIndex: 'confirmed',
        sorter: false,
        width: '10%',
      },
      {
        title: 'Signup',
        dataIndex: 'signup',
        width: '12%',
      },
      {
        title: 'Last Login',
        dataIndex: 'lastLogin',
        width: '15%',
      },
      {
        title: 'IP of Last Login',
        dataIndex: 'ipLastLogin',
        width: '10%',
      },
      {
        title: 'User Role',
        dataIndex: 'userRole',
        sorter: false,
        width: '8%',
      },
      {
        title: 'Action',
        sorter: false,
        width: '8%',
        key: 'action',
        render: (text, record) => {
          return (
            <span>
              <ActionSpan
                onClick={() => this.editUserRole(record.email, record.userRole)}
              >
                Edit
              </ActionSpan>
              <ActionSeparator> | </ActionSeparator>
              <ActionSpan onClick={() => this.handleDelete(record.email)}>
                Delete
              </ActionSpan>
            </span>
          );
        },
      },
    ];

    this.devicesColumns = [
      {
        title: 'Device Name',
        dataIndex: 'devicename',
      },
      {
        title: 'Mac Id',
        dataIndex: 'macid',
      },
      {
        title: 'Room',
        dataIndex: 'room',
      },
      {
        title: 'Latitude',
        dataIndex: 'latitude',
      },
      {
        title: 'Longitude',
        dataIndex: 'longitude',
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => {
          return (
            <span>
              <ActionSpan
                onClick={() =>
                  this.editDevice(record.devicename, record.room, record.macid)
                }
              >
                Edit
              </ActionSpan>
            </span>
          );
        },
      },
    ];
  }

  apiCall = () => {
    const { userEmail: user, userRole: role } = this.state;
    changeUserRole({ user, role })
      .then(payload => {
        this.setState({ changeRoleDialog: true });
      })
      .catch(error => {
        const { statusCode } = error;
        if (statusCode === 401) {
          if (window.console) {
            console.log(error.responseText);
            console.log('Error 401: Permission Denied!');
          }
        } else if (statusCode === 503) {
          if (window.console) {
            console.log(error.responseText);
          }
          console.log('Error 503: Server not responding!');
          document.location.reload();
        } else {
          console.log(error);
        }
      });
  };

  deleteUser = () => {
    const { userEmail: email } = this.state;
    deleteUserAccount({ email })
      .then(payload => {
        this.setState({ deleteSuccessDialog: true });
      })
      .catch(error => {
        console.log(error);
        this.setState({ deleteFailedDialog: true });
      });
  };

  handleDelete = email => {
    this.setState({
      userEmail: email,
      showDeleteDialog: true,
    });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  };

  handleExpand = (expanded, value) => {
    this.setState({
      userEmail: value.email,
      expanded: expanded,
    });
  };

  editDevice = (deviceName, room, macid) => {
    this.setState({
      deviceName: deviceName,
      room: room,
      macid: macid,
      showEditDeviceDialog: true,
    });
  };

  handleDevice = () => {
    const { userEmail: email, macid, room } = this.state;
    this.setState({ showEditDeviceDialog: false });
    modifyUserDevices({ email, macid, room })
      .then(payload => {
        this.setState({ editDeviceSuccessDialog: true });
      })
      .catch(error => {
        console.log(error);
        this.setState({ editDeviceFailedDialog: true });
      });
  };

  handleSearch = value => {
    this.setState({
      search: true,
    });
    fetchAdminUserStats({ search: value })
      .then(payload => {
        let userList = payload.users;
        let users = [];
        userList.map((data, dataIndex) => {
          let devices = [];
          let keys = Object.keys(data.devices);
          keys.forEach(deviceIndex => {
            let device = {
              macid: deviceIndex,
              devicename: data.devices[deviceIndex].name,
              room: data.devices[deviceIndex].room,
              latitude: data.devices[deviceIndex].geolocation.latitude,
              longitude: data.devices[deviceIndex].geolocation.longitude,
            };
            devices.push(device);
          });
          let user = {
            serialNum: ++dataIndex,
            email: data.name,
            signup: data.signupTime,
            lastLogin: data.lastLoginTime,
            ipLastLogin: data.lastLoginIP,
            userRole: data.userRole,
            devices: devices,
          };

          if (data.confirmed) {
            user.confirmed = 'Activated';
          } else {
            user.confirmed = 'Not Activated';
          }

          users.push(user);
          return 1;
        });
        this.setState({
          data: users,
          loading: false,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentDidMount() {
    document.title = 'SUSI.AI - User Detail List';
    const pagination = { ...this.state.pagination };
    fetchAdminUserStats()
      .then(payload => {
        const { userCount } = payload;
        pagination.total = userCount;
        pagination.pageSize = 50;
        pagination.showQuickJumper = true;
        this.setState({
          pagination,
        });
        this.fetch();
      })
      .catch(error => console.log(error));
  }

  editUserRole = (email, userRole) => {
    this.setState({
      userEmail: email,
      userRole: userRole,
      showEditDialog: true,
    });
  };

  handleChange = () => {
    this.apiCall();
    this.setState({
      showEditDialog: false,
    });
  };

  handleSuccess = () => {
    this.setState({
      changeRoleDialog: false,
    });
    document.location.reload();
  };

  handleClose = () => {
    this.setState({
      showEditDialog: false,
      showDeleteDialog: false,
      deleteFailedDialog: false,
      showEditDeviceDialog: false,
      editDeviceFailedDialog: false,
    });
  };

  handleDeviceName = (event, value) => {
    this.setState({
      deviceName: value,
    });
  };

  handleRoom = (event, value) => {
    this.setState({
      room: value,
    });
  };

  handleUserRoleChange = (event, index, value) => {
    this.setState({
      userRole: value,
    });
  };

  fetch = (params = {}) => {
    let page;
    if (params.page !== undefined) {
      // console.log(params.page);
      page = params.page;
    } else {
      page = 1;
    }
    fetchAdminUserStats({ page })
      .then(payload => {
        let userList = payload.users;
        let users = [];
        userList.map((data, dataIndex) => {
          let devices = [];
          let keys = Object.keys(data.devices);
          keys.forEach(deviceIndex => {
            let device = {
              macid: deviceIndex,
              devicename: data.devices[deviceIndex].name,
              room: data.devices[deviceIndex].room,
              latitude: data.devices[deviceIndex].geolocation.latitude,
              longitude: data.devices[deviceIndex].geolocation.longitude,
            };
            devices.push(device);
          });
          let user = {
            serialNum: ++dataIndex + (page - 1) * 50,
            email: data.name,
            confirmed: data.confirmed,
            signup: data.signupTime,
            lastLogin: data.lastLoginTime,
            ipLastLogin: data.lastLoginIP,
            userRole: data.userRole,
            userName: data.userName,
            devices: devices,
          };

          if (user.confirmed) {
            user.confirmed = 'Activated';
          } else {
            user.confirmed = 'Not Activated';
          }

          users.push(user);
          return 1;
        });
        this.setState({
          data: users,
          loading: false,
        });
      })
      .catch(error => {
        console.log(error);
      });
    // Read total count from server
    // pagination.total = data.totalCount;
  };

  render() {
    const actions = [
      <Button
        key={1}
        label="Change"
        labelStyle={{ color: '#4285f4' }}
        onClick={this.handleChange}
      />,
      <Button
        key={2}
        label="Cancel"
        primary={false}
        onClick={this.handleClose}
      />,
    ];
    const deleteActions = [
      <Button
        key={1}
        label="Delete"
        labelStyle={{ color: '#4285f4' }}
        onClick={this.deleteUser}
      />,
      <Button
        key={2}
        label="Cancel"
        primary={false}
        onClick={this.handleClose}
      />,
    ];

    const editDeviceActions = [
      <Button
        key={1}
        label="Save"
        labelStyle={{ color: '#4285f4' }}
        onClick={this.handleDevice}
      />,
      <Button
        key={2}
        label="Cancel"
        primary={false}
        onClick={this.handleClose}
      />,
    ];

    const blueThemeColor = { color: 'rgb(66, 133, 244)' };
    const themeForegroundColor = '#272727';
    const themeBackgroundColor = '#fff';

    return (
      <div className="table">
        <div>
          <Dialog
            title="Change User Role"
            actions={actions}
            modal={true}
            open={this.state.showEditDialog}
          >
            <div>
              Select new User Role for
              <span style={{ fontWeight: 'bold', marginLeft: '5px' }}>
                {this.state.userEmail}
              </span>
            </div>
            <div>
              <Select
                selectedMenuItemStyle={blueThemeColor}
                onChange={this.handleUserRoleChange}
                value={this.state.userRole}
                labelStyle={{ color: themeForegroundColor }}
                menuStyle={{
                  backgroundColor: themeBackgroundColor,
                }}
                menuItemStyle={{ color: themeForegroundColor }}
                style={{
                  width: '250px',
                  marginLeft: '-20px',
                }}
                autoWidth={false}
              >
                <MenuItem primaryText="USER" value="user" />
                <MenuItem primaryText="REVIEWER" value="reviewer" />
                <MenuItem primaryText="OPERATOR" value="operator" />
                <MenuItem primaryText="ADMIN" value="admin" />
                <MenuItem primaryText="SUPERADMIN" value="superadmin" />
              </Select>
            </div>
          </Dialog>

          <Dialog
            title="Edit device config"
            actions={editDeviceActions}
            modal={true}
            open={this.state.showEditDeviceDialog}
          >
            <div>
              <span style={{ fontWeight: 'bold', color: 'black' }}>
                {' '}
                Mac Id:
              </span>
              <span style={{ fontWeight: 'bold', marginLeft: '5px' }}>
                {this.state.macid}
              </span>
            </div>
            <div style={{ width: '50%', marginTop: '35px' }}>
              <div className="label">Device Name</div>
              <InputField
                name="deviceName"
                style={{ marginBottom: '10px' }}
                value={this.state.deviceName}
                onChange={this.handleDeviceName}
                placeholder="Enter device name"
              />{' '}
              <div className="label">Room</div>
              <InputField
                name="room"
                value={this.state.room}
                onChange={this.handleRoom}
                placeholder="Enter room name"
              />
            </div>
          </Dialog>

          <Dialog
            title="Success"
            actions={
              <Button
                key={1}
                label="Ok"
                labelStyle={{ color: '#4285f4' }}
                onClick={this.handleSuccess}
              />
            }
            modal={true}
            open={this.state.editDeviceSuccessDialog}
          >
            <div>
              Successfully changed the configuration of device with macid
              <span style={{ fontWeight: 'bold', margin: '0 5px' }}>
                {this.state.macid}
              </span>
              !
            </div>
          </Dialog>

          <Dialog
            title="Failed"
            actions={
              <Button
                key={1}
                label="Ok"
                labelStyle={{ color: '#4285f4' }}
                onClick={this.handleClose}
              />
            }
            modal={true}
            open={this.state.editDeviceFailedDialog}
          >
            <div>
              Unable to change the configuration of device with macid
              <span style={{ fontWeight: 'bold', margin: '0 5px' }}>
                {this.state.macid}
              </span>
              !
            </div>
          </Dialog>
          <Dialog
            title="Delete User Account"
            actions={deleteActions}
            modal={true}
            open={this.state.showDeleteDialog}
          >
            <div>
              Are you sure you want to delete the account associated with
              <span style={{ fontWeight: 'bold', marginLeft: '5px' }}>
                {this.state.userEmail}
              </span>
              ?
            </div>
          </Dialog>
          <Dialog
            title="Success"
            actions={
              <Button
                key={1}
                label="Ok"
                labelStyle={{ color: '#4285f4' }}
                onClick={this.handleSuccess}
              />
            }
            modal={true}
            open={this.state.deleteSuccessDialog}
          >
            <div>
              Account associated with
              <span style={{ fontWeight: 'bold', margin: '0 5px' }}>
                {this.state.userEmail}
              </span>
              is deleted successfully!
            </div>
          </Dialog>
          <Dialog
            title="Failed"
            actions={
              <Button
                key={1}
                label="Ok"
                labelStyle={{ color: '#4285f4' }}
                onClick={this.handleClose}
              />
            }
            modal={true}
            open={this.state.deleteFailedDialog}
          >
            <div>
              Account associated with
              <span style={{ fontWeight: 'bold', margin: '0 5px' }}>
                {this.state.userEmail}
              </span>
              cannot be deleted!
            </div>
          </Dialog>
          <Dialog
            title="Success"
            actions={
              <Button
                key={1}
                label="Ok"
                labelStyle={{ color: '#4285f4' }}
                onClick={this.handleSuccess}
              />
            }
            modal={true}
            open={this.state.changeRoleDialog}
          >
            <div>
              User role of
              <span style={{ fontWeight: 'bold', margin: '0 5px' }}>
                {this.state.userEmail}
              </span>
              is changed to
              <span style={{ fontWeight: 'bold', margin: '0 5px' }}>
                {this.state.userRole}
              </span>
              successfully!
            </div>
          </Dialog>
        </div>

        <Search
          placeholder="Search by email"
          style={{
            margin: '5px 25% 20px 25%',
            width: '50%',
            height: '38px',
          }}
          size="large"
          onSearch={value => this.handleSearch(value)}
        />
        <LocaleProvider locale={enUS}>
          {this.state.search ? (
            <Table
              columns={this.columns}
              rowKey={record => record.serialNum}
              onExpand={(expanded, record) =>
                this.handleExpand(expanded, record)
              }
              expandedRowRender={record => (
                <Table
                  style={{
                    width: '80%',
                    backgroundColor: 'white',
                  }}
                  rowKey={deviceRecord => deviceRecord.macid}
                  columns={this.devicesColumns}
                  dataSource={record.devices}
                  pagination={false}
                  locale={{ emptyText: 'No devices found!' }}
                  bordered
                />
              )}
              dataSource={this.state.data}
              loading={this.state.loading}
              pagination={false}
            />
          ) : (
            <Table
              columns={this.columns}
              rowKey={record => record.serialNum}
              onExpand={(expanded, record) =>
                this.handleExpand(expanded, record)
              }
              expandedRowRender={record => (
                <Table
                  style={{
                    width: '80%',
                    backgroundColor: 'white',
                  }}
                  rowKey={deviceRecord => deviceRecord.macid}
                  columns={this.devicesColumns}
                  dataSource={record.devices}
                  pagination={false}
                  locale={{ emptyText: 'No devices found!' }}
                  bordered
                />
              )}
              dataSource={this.state.data}
              pagination={this.state.pagination}
              loading={this.state.loading}
              onChange={this.handleTableChange}
            />
          )}
        </LocaleProvider>
      </div>
    );
  }
}

ListUser.propTypes = {
  history: PropTypes.object,
};

export default ListUser;

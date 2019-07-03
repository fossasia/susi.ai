import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Table from 'antd/lib/table';
import { Input } from 'antd';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { fetchAdminUserStats } from '../../../apis/index';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import uiActions from '../../../redux/actions/ui';
import 'antd/lib/table/style/index.css';
import styled from 'styled-components';
import { Container } from '../AdminStyles';

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

  handleDelete = email => {
    this.setState({
      userEmail: email,
    });
    this.props.actions.openModal({
      modalType: 'deleteUser',
      handleDelete: this.deleteUser,
      handleClose: this.props.actions.closeModal,
      userEmail: this.state.userEmail,
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

  handleEdit = (deviceName, room, macid) => {
    console.log('hel', deviceName, room, macid);
    console.log(this.state.data.users);
    // let data = this.state.data.users.user.devices.find((device, index) => {
    //   if (device.macid === macid) {
    //     this.state.data.users.devices[index] = { ...deviceName, room };
    //     return true;
    //   }
    // });
    // this.setState(data);
  };

  editDevice = (deviceName, room, macid) => {
    this.props.actions.openModal({
      modalType: 'editDevice',
      handleClose: this.props.actions.closeModal,
      handleEdit: this.handleEdit,
      email: this.state.userEmail,
      room,
      macid,
      deviceName,
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

  componentDidUpdate() {
    this.fetch();
  }

  editUserRole = (email, userRole) => {
    this.setState({
      userEmail: email,
    });
    this.props.actions.openModal({
      modalType: 'changeUserRole',
      handleClose: this.props.actions.closeModal,
      userEmail: this.state.userEmail,
      userRole,
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
    return (
      <Container>
        <div>
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
      </Container>
    );
  }
}

ListUser.propTypes = {
  history: PropTypes.object,
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
)(ListUser);

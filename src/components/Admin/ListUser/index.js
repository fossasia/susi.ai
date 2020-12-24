import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { deleteUserAccount, fetchAdminUserStats } from '../../../apis/index';
import styled from 'styled-components';
import { Container } from '../AdminStyles';
import { Link } from 'react-router-dom';
import MaterialTable from 'material-table';
import DevicePanel from './DevicePanel/index';
import uiActions from '../../../redux/actions/ui';
import _SearchBar from 'material-ui-search-bar';
import COLUMNS from './constants';
import CloseIcon from '@material-ui/icons/Close';
import { ActionSpan, ActionSeparator } from '../../shared/TableActionStyles';
import { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

tableIcons.Add.displayName = 'Add';
tableIcons.Check.displayName = 'Check';
tableIcons.Clear.displayName = 'Clear';
tableIcons.Delete.displayName = 'Delete';
tableIcons.DetailPanel.displayName = 'DetailPanel';
tableIcons.Edit.displayName = 'Edit';
tableIcons.Export.displayName = 'Export';
tableIcons.Filter.displayName = 'Filter';
tableIcons.FirstPage.displayName = 'FirstPage';
tableIcons.LastPage.displayName = 'LastPage';
tableIcons.NextPage.displayName = 'NextPage';
tableIcons.PreviousPage.displayName = 'PreviousPage';
tableIcons.ResetSearch.displayName = 'ResetSearch';
tableIcons.Search.displayName = 'Search';
tableIcons.SortArrow.displayName = 'SortArrow';
tableIcons.ThirdStateCheck.displayName = 'ThirdStateCheck';
tableIcons.ViewColumn.displayName = 'ViewColumn';

const SearchBar = styled(_SearchBar)`
  width: 50%;
  margin: 0 auto 1rem auto;
`;

class ListUser extends Component {
  state = {
    username: [],
    userEmail: '',
    data: [],
    pagination: {},
    loading: true,
    search: '',
    page: 1,
  };

  deleteUser = () => {
    const { userEmail: email } = this.state;
    deleteUserAccount({ email })
      .then((payload) => {
        this.props.actions.openModal({
          modalType: 'confirm',
          content: (
            <div>
              Account associated with
              <span style={{ fontWeight: 'bold', margin: '0 5px' }}>
                {email}
              </span>
              is deleted successfully!
            </div>
          ),
          title: 'Success',
          handleConfirm: this.props.actions.closeModal,
        });
        this.setState({ search: '' });
        this.loadUsers();
      })
      .catch((error) => {
        console.log(error);
        this.props.actions.openModal({
          modalType: 'confirm',
          content: (
            <div>
              Account associated with
              <span style={{ fontWeight: 'bold', margin: '0 5px' }}>
                {email}
              </span>
              cannot be deleted!
            </div>
          ),
          title: 'Failure',
          handleConfirm: this.props.actions.closeModal,
        });
      });
  };

  handleSearch = (value) => {
    const { search } = this.state;
    value = value.trim();
    if (value === '' && search !== value) {
      this.loadUsers();
    }
    this.setState({ search: value });
    fetchAdminUserStats({ search: value })
      .then((payload) => {
        let userList = payload.users;
        let users = [];
        if (userList && Array.isArray(userList) && userList.length > 0) {
          userList.map((data, dataIndex) => {
            let devices = [];
            let keys = Object.keys(data.devices);
            keys.forEach((deviceIndex) => {
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
              signup: data.signupTime === '' ? '-' : data.signupTime,
              lastLogin: data.lastLoginTime === '' ? '-' : data.lastLoginTime,
              ipLastLogin: data.lastLoginIP === '' ? '-' : data.lastLoginIP,
              userName:
                data.userName === '' ? '-' : data.userName.substring(0, 30),
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
        }
        this.setState({
          data: users,
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount() {
    document.title = 'SUSI.AI - User Detail List';
    this.loadUsers();
  }

  loadUsers = () => {
    Promise.all([
      this.fetch({ page: 0 }),
      fetchAdminUserStats({ getUserStats: 'true' })
        .then((payload) => {
          const {
            userStats: { totalUsers },
          } = payload;
          this.setState({
            totalUsers,
          });
        })
        .catch((error) => {
          console.log(error);
        }),
    ]);
  };

  handleSuccess = () => {
    this.setState({
      changeRoleDialog: false,
    });
    document.location.reload();
  };

  fetch = ({ page }) => {
    this.setState({ loading: true });
    fetchAdminUserStats({ page: page + 1 })
      .then((payload) => {
        let userList = payload.users;
        let users = [];
        if (userList && Array.isArray(userList) && userList.length > 0) {
          userList.map((data, dataIndex) => {
            let devices = [];
            let keys = Object.keys(data.devices);
            keys.forEach((deviceIndex) => {
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
              serialNum: ++dataIndex + page * 50,
              email: data.name,
              confirmed: data.confirmed,
              signup:
                data.signupTime === ''
                  ? '-'
                  : new Date(data.signupTime).toDateString(),
              lastLogin:
                data.lastLoginTime === ''
                  ? '-'
                  : new Date(data.lastLoginTime).toDateString(),
              ipLastLogin: data.lastLoginIP === '' ? '-' : data.lastLoginIP,
              userRole: data.userRole,
              userName:
                data.userName === '' ? '-' : data.userName.substring(0, 30),
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
        }

        this.setState({
          data: users,
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleEdit = (userEmail, userRole) => {
    this.setState({ userEmail, userRole });
    this.props.actions.openModal({
      modalType: 'editUserRole',
      userEmail,
      userRole,
      handleClose: this.props.actions.closeModal,
    });
  };

  handleDelete = (userEmail) => {
    this.setState({ userEmail });
    this.props.actions.openModal({
      modalType: 'deleteUserAccount',
      userEmail,
      handleClose: this.props.actions.closeModal,
      handleConfirm: this.deleteUser,
    });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
    this.fetch({ page });
  };

  onClose = () => {
    this.loadUsers();
  };

  render() {
    const { loading, search, data } = this.state;
    return (
      <Container style={{ padding: '1rem 0' }}>
        <SearchBar
          placeholder="Search by email"
          value={search}
          onChange={(value) => this.handleSearch(value)}
          closeIcon={<CloseIcon />}
          onCancelSearch={this.onClose}
        />
        <MaterialTable
          isLoading={loading}
          options={{
            actionsColumnIndex: -1,
            pageSize: 50,
            search: false,
            pageSizeOptions: [25, 50, 100, 200, 500],
          }}
          columns={COLUMNS}
          data={data}
          title=""
          icons={tableIcons}
          actions={[
            (rowData) => ({
              onEdit: (event, rowData) => {
                this.handleEdit(rowData.email, rowData.userRole);
              },
              onDelete: (event, rowData) => {
                this.handleDelete(rowData.email);
              },
            }),
          ]}
          components={{
            Action: (props) => (
              <React.Fragment>
                <Link to={`/settings?email=${props.data.email}`}>
                  <ActionSpan>Edit</ActionSpan>
                </Link>
                <ActionSeparator> | </ActionSeparator>
                <ActionSpan
                  onClick={(event) => props.action.onEdit(event, props.data)}
                >
                  Role
                </ActionSpan>
                <ActionSeparator> | </ActionSeparator>
                <ActionSpan
                  onClick={(event) => props.action.onDelete(event, props.data)}
                >
                  Delete
                </ActionSpan>
              </React.Fragment>
            ),
          }}
          detailPanel={(rowData) => {
            return <DevicePanel data={rowData.devices} email={rowData.email} />;
          }}
          onRowClick={(event, rowData, togglePanel) => togglePanel()}
          onChangePage={(page) => {
            this.fetch({ page: page + 1 });
          }}
        />
      </Container>
    );
  }
}

ListUser.propTypes = {
  history: PropTypes.object,
  actions: PropTypes.object,
};

function mapDispatchToProps(store) {
  return {
    actions: bindActionCreators(uiActions, store),
  };
}

export default connect(null, mapDispatchToProps)(ListUser);

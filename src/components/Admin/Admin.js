import React, { Component } from 'react';
import NotFound from '../NotFound/NotFound.react';
import './Admin.css';
import PropTypes from 'prop-types';
import _Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import AdminTab from './AdminTab/AdminTab';
import ListUser from './ListUser/ListUser';
import ListSkills from './ListSkills/ListSkills';
import SystemLogs from './SystemLogs/SystemLogs';
import SystemSettings from './SystemSettings/SystemSettings';
import { getAdmin } from '../../apis/index';
import styled from 'styled-components';
import isMobileView from '../../utils/isMobileView';
import CircularLoader from '../shared/CircularLoader';

const Tabs = styled(_Tabs)`
  background-color: #ffffff;
`;

class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAdmin: false,
      loading: true,
      value: 0,
    };
  }

  componentDidMount() {
    document.title = 'SUSI.AI - Admin';
    getAdmin()
      .then(payload => {
        const { showAdmin } = payload;
        if (showAdmin) {
          this.initilizeData();
          this.setState({
            loading: false,
            isAdmin: true,
          });
        } else {
          this.setState({
            loading: false,
            isAdmin: false,
          });
        }
      })
      .catch(error => {
        this.setState({
          loading: false,
          isAdmin: false,
        });
        console.log(error);
      });
  }

  initilizeData = () => {
    let endPath = this.props.location.pathname.split('/')[2];
    let heading = 'Admin';
    let value = 0;
    switch (endPath) {
      case 'users':
        heading = 'Users Panel';
        value = 1;
        break;
      case 'skills':
        heading = 'Skills Panel';
        value = 2;
        break;
      case 'settings':
        heading = 'System Settings';
        value = 3;
        break;
      case 'logs':
        heading = 'System Logs';
        value = 4;
        break;
      default:
        return;
    }
    this.heading = heading;
    this.setState({ value });
  };

  handleTabChange = (event, value) => {
    this.setState({ value });
    const { history } = this.props;
    switch (value) {
      case 0:
        history.replace('/admin');
        this.heading = 'Admin';
        break;
      case 1:
        history.replace('/admin/users');
        this.heading = 'Users Panel';
        break;
      case 2:
        history.replace('/admin/skills');
        this.heading = 'Skills Panel';
        break;
      case 3:
        history.replace('/admin/settings');
        this.heading = 'System Settings';
        break;
      case 4:
        history.replace('/admin/logs');
        this.heading = 'System Logs';
        break;
      default:
        history.replace('/admin');
        this.heading = 'Admin';
    }
  };

  generateView = () => {
    const { value } = this.state;
    switch (value) {
      case 0:
        return <AdminTab />;
      case 1:
        return <ListUser />;
      case 2:
        return <ListSkills />;
      case 3:
        return <SystemSettings />;
      case 4:
        return <SystemLogs />;
      default:
        return;
    }
  };

  render() {
    const { value, loading, isAdmin } = this.state;
    const mobileView = isMobileView();
    return (
      <div>
        {loading ? (
          <CircularLoader />
        ) : (
          <div>
            {isAdmin ? (
              <div>
                <h2 className="h2">{this.heading}</h2>
                <div className="tabs">
                  <AppBar color="default" position="static">
                    <Tabs
                      onChange={this.handleTabChange}
                      value={value}
                      indicatorColor="primary"
                      textColor="primary"
                      centered
                      scrollButtons="on"
                      variant={mobileView ? 'scrollable' : 'standard'}
                    >
                      <Tab label="Admin" />
                      <Tab label="Users" />
                      <Tab label="Skills" />
                      <Tab label="System Settings" />
                      <Tab label="System Logs" />
                    </Tabs>
                    {this.generateView()}
                  </AppBar>
                </div>
              </div>
            ) : (
              <NotFound />
            )}
          </div>
        )}
      </div>
    );
  }
}

Admin.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
};

export default Admin;

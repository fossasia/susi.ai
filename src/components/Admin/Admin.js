import React, { Component } from 'react';
import NotFound from '../NotFound/NotFound.react';
import PropTypes from 'prop-types';
import _Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import AdminTab from './AdminTab/AdminTab';
import ListUser from './ListUser';
import ListSkills from './ListSkills/ListSkills';
import SystemLogs from './SystemLogs/SystemLogs';
import SystemSettings from './SystemSettings/SystemSettings';
import { getAdmin } from '../../apis/index';
import styled from 'styled-components';
import isMobileView from '../../utils/isMobileView';
import CircularLoader from '../shared/CircularLoader';

const Container = styled.div`
  padding-top: 20px;
  padding-left: 25px;
  padding-right: 30px;
`;

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

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.initilizeData();
    }
  }

  initilizeData = () => {
    let endPath = this.props.location.pathname.split('/')[2];
    let value = 0;
    switch (endPath) {
      case 'users':
        value = 1;
        break;
      case 'skills':
        value = 2;
        break;
      case 'settings':
        value = 3;
        break;
      case 'logs':
        value = 4;
        break;
      default:
        return;
    }
    this.setState({ value });
  };

  handleTabChange = (event, value) => {
    this.setState({ value });
    const { history } = this.props;
    switch (value) {
      case 0:
        history.replace('/admin');
        break;
      case 1:
        history.replace('/admin/users');
        break;
      case 2:
        history.replace('/admin/skills');
        break;
      case 3:
        history.replace('/admin/settings');
        break;
      case 4:
        history.replace('/admin/logs');
        break;
      default:
        history.replace('/admin');
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
              <Container>
                <AppBar color="default" position="static">
                  <Tabs
                    onChange={this.handleTabChange}
                    value={value}
                    indicatorColor="primary"
                    textColor="primary"
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
              </Container>
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

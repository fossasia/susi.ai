import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import styled from 'styled-components';
import DashboardContent from './Dashboard';
import MySkills from '../SkillCreator/SkillCreator';
import Botbuilder from '../BotBuilder/BotBuilder';
import MyDevices from '../MyDevices/index';
import isMobileView from '../../../utils/isMobileView';
import { templates } from '../BotBuilder/BotBuilderWrap';

const Container = styled.div`
  padding-top: 20px;
  padding-left: 25px;
  padding-right: 30px;
`;

// Add condition to check background here
// const Tabs = styled(_Tabs)`
//   background-color: #ffffff;
// `;
const Tabs = styled(_Tabs)``;

const trytheme = createMuiTheme({
  palette: {
    type: 'dark', // Switching the dark mode on is a single property value change.
  },
});
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.getCurrentTab(),
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.setState({ value: this.getCurrentTab() });
    }
  }

  getCurrentTab = () => {
    switch (this.props.location.pathname.split('/')[1]) {
      case 'dashboard':
        return 0;
      case 'myskills':
        return 1;
      case 'mybots':
        return 2;
      case 'mydevices':
        return 3;
      default:
        return 0;
    }
  };

  handleTabChange = (event, value) => {
    this.setState({ value });
    const { history } = this.props;
    switch (value) {
      case 0:
        history.replace('/dashboard');
        break;
      case 1:
        history.replace('/myskills');
        break;
      case 2:
        history.replace('/mybots');
        break;
      case 3:
        history.replace('/mydevices');
        break;
      default:
        history.replace('/dashboard');
    }
  };

  generateView = () => {
    const { value } = this.state;
    switch (value) {
      case 0:
        return <DashboardContent showTitle={false} />;
      case 1:
        return <MySkills showTitle={false} />;
      case 2:
        return <Botbuilder templates={templates} />;
      case 3:
        return <MyDevices />;
      default:
        return;
    }
  };

  render() {
    const { value } = this.state;
    const mobileView = isMobileView();
    return (
      <ThemeProvider theme={trytheme}>
        <div>
          <div>
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
                  <Tab label="Dashboard" />
                  <Tab label="My Sksills" />
                  <Tab label="My Bots" />
                  <Tab label="My Devices" />
                </Tabs>
                {this.generateView()}
              </AppBar>
            </Container>
          </div>
        </div>
      </ThemeProvider>
    );
  }
}

Dashboard.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
};

export default Dashboard;

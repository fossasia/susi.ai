import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import styled from 'styled-components';
import DashboardContent from './Dashboard';
import MySkills from '../SkillCreator/SkillCreator';
import Botbuilder from '../BotBuilder/BotBuilder';
import isMobileView from '../../../utils/isMobileView';
import { templates } from '../BotBuilder/BotBuilderWrap';

const Container = styled.div`
  margin-top: 70px;
  padding-left: 25px;
  padding-right: 30px;
`;

const Tabs = styled(_Tabs)`
  background-color: #ffffff;
`;

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
    switch (this.props.location.pathname) {
      case '/dashboard':
        return 0;
      case '/myskills':
        return 1;
      case '/botbuilder':
        return 2;
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
        history.replace('/botbuilder');
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
      default:
        return;
    }
  };

  render() {
    const { value } = this.state;
    const mobileView = isMobileView();
    return (
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
                <Tab label="My Skills" />
                <Tab label="Botbuilder" />
              </Tabs>
              {this.generateView()}
            </AppBar>
          </Container>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
};

export default Dashboard;

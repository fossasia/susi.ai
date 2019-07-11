import React, { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Container } from '../AdminStyles';
import ConfigKeys from './ConfigKeys';
import Slideshow from './Slideshow';

class SystemSettings extends Component {
  state = {
    value: 0,
  };

  handleTabChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    return (
      <Container>
        <Tabs onChange={this.handleTabChange} value={value}>
          <Tab label="Config Keys" />
          <Tab label="Slideshow" />
        </Tabs>
        {value === 0 && <ConfigKeys />}
        {value === 1 && <Slideshow />}
      </Container>
    );
  }
}

export default SystemSettings;

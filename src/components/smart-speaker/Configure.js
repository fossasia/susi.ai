import React from 'react';
import _Paper from '@material-ui/core/Paper';
import styled from 'styled-components';
import DeviceSettings from '../cms/MyDevices/DeviceSettings';

const Paper = styled(_Paper)`
  margin: 68px 25px 20px;
  padding: 1.25rem 2.5rem 1.875rem;
  background-color: #f5f5f5;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
    0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
`;

const ConfigureSpeaker = props => {
  return (
    <Paper>
      <DeviceSettings />
    </Paper>
  );
};

export default ConfigureSpeaker;

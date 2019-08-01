import React from 'react';
import styled from 'styled-components';
import susilogo from './susilogo.png';
import OutlinedTextField from '../shared/OutlinedTextField';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { setupDeviceConfig } from '../../apis';

const Container = styled.div`
  background: #f5f5f5;
  display: flex;
  justify-content: center;
  height: 100vh;
  padding: 1rem;
  margin-top: -50px;
`;

const Wrapper = styled.div`
  width: 30rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const SusiLogo = styled.img`
  width: 15rem;
  height: 15rem;
`;

const RadioFlexContainer = styled.div`
  display: flex;
  padding: 1rem 0;
  justify-content: space-between;
  width: 80%;
`;

class ControlPage extends React.Component {
  state = {
    ssid: '',
    password: '',
    hotword: 'y',
    wake: 'y',
  };

  handleRebootSpeaker = () => {
    const { ssid, password, hotword, wake } = this.state;
    setupDeviceConfig({
      wifissid: ssid,
      wifipassd: password,
      hotword,
      wake,
    }).then(() => {
      window.location.reload();
    });
  };

  handleInputFieldChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleRadioChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    const { ssid, password, hotword, wake } = this.state;
    return (
      <Container>
        <Wrapper>
          <SusiLogo src={susilogo} />
          <div>
            <h1>Setup your WiFi for SUSI.AI</h1>
          </div>
          <OutlinedTextField
            fullWidth
            label="SSID"
            placeholder="SSID"
            value={ssid}
            name="ssid"
            onChange={this.handleInputFieldChange}
            style={{ background: 'white' }}
          />
          <OutlinedTextField
            fullWidth
            label="Password"
            placeholder="Password"
            value={password}
            name="password"
            onChange={this.handleInputFieldChange}
            style={{ background: 'white' }}
          />
          <RadioFlexContainer>
            <div>
              <FormControl>
                <FormLabel component="legend">Hotword</FormLabel>
                <RadioGroup
                  aria-label="Hotword"
                  name="hotword"
                  value={hotword}
                  onChange={this.handleRadioChange}
                >
                  <FormControlLabel
                    value="y"
                    control={<Radio />}
                    label="Snowboy"
                  />
                  <FormControlLabel
                    value="n"
                    control={<Radio />}
                    label="Pocket Sphinx"
                  />
                </RadioGroup>
              </FormControl>
            </div>
            <div>
              <FormControl>
                <FormLabel component="legend">Wake Button</FormLabel>
                <RadioGroup
                  aria-label="wake"
                  name="wake"
                  value={wake}
                  onChange={this.handleRadioChange}
                >
                  <FormControlLabel value="y" control={<Radio />} label="On" />
                  <FormControlLabel value="n" control={<Radio />} label="Off" />
                </RadioGroup>
              </FormControl>
            </div>
          </RadioFlexContainer>

          <p>
            To reset your SUSI.AI Smart Speaker (to get back here), hold the
            button for 10 seconds.
          </p>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleRebootSpeaker}
          >
            Reboot Smart Speaker
          </Button>
        </Wrapper>
      </Container>
    );
  }
}

export default ControlPage;

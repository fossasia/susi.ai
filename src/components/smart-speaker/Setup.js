import React from 'react';
import styled from 'styled-components';
import susilogo from './susilogo.svg';
import OutlinedTextField from '../shared/OutlinedTextField';
import Button from '@material-ui/core/Button';
import Select from '../shared/Select';
import Radio from '@material-ui/core/Radio';
import _FormControlLabel from '@material-ui/core/FormControlLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import { setupDeviceConfig } from '../../apis';
import { isEmail } from '../../utils';

const Container = styled.div`
  background: #f5f5f5;
  display: flex;
  justify-content: center;
  height: 100vh;
  padding: 1rem;
  margin-top: -30px;
`;

const Wrapper = styled.div`
  width: 30rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const SusiLogo = styled.img`
  width: 10rem;
  height: 10rem;
  margin: -40px 0;
`;

const FormControlLabel = styled(_FormControlLabel)`
  align-self: flex-start;
`;

const P = styled.p`
  font-size: 0.8rem;
  margin-top: 0rem;
`;

class ControlPage extends React.Component {
  state = {
    ssid: '',
    password: '',
    hotword: 'y',
    email: '',
    authPassword: '',
    emailErrorText: '',
    passwordErrorText: '',
    authType: 'authenticated',
    roomName: 'My room',
  };

  handleRebootSpeaker = async () => {
    const {
      ssid,
      password,
      hotword,
      email,
      authPassword,
      authType: auth,
      roomName,
    } = this.state;
    try {
      await setupDeviceConfig({
        wifissid: ssid,
        wifipassd: password,
        hotword,
        email: auth === 'anonymous' ? '' : email,
        password: auth === 'anonymous' ? '' : authPassword,
        auth,
        roomName,
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  handleInputFieldChange = e => {
    const { name, value } = e.target;
    if (name === 'email') {
      isEmail(value)
        ? this.setState({ emailErrorText: '' })
        : this.setState({ emailErrorText: 'Invalid Email address' });
    } else if (name === 'authPassword') {
      value.length > 6
        ? this.setState({ passwordErrorText: '' })
        : this.setState({
            passwordErrorText: 'Password should be atleast 6 characters',
          });
    }
    this.setState({ [name]: value });
  };

  render() {
    const {
      ssid,
      password,
      hotword,
      email,
      authPassword,
      emailErrorText,
      passwordErrorText,
      authType,
      roomName,
    } = this.state;
    return (
      <Container>
        <Wrapper>
          <SusiLogo src={susilogo} />
          <h2>Setup the WiFi for Your Smart Speaker</h2>
          <OutlinedTextField
            fullWidth
            label="SSID"
            placeholder="SSID"
            value={ssid}
            name="ssid"
            onChange={this.handleInputFieldChange}
            style={{ background: 'white' }}
            margin="dense"
          />
          <OutlinedTextField
            fullWidth
            label="WiFi Password"
            placeholder="WiFi Password"
            value={password}
            name="password"
            onChange={this.handleInputFieldChange}
            style={{ background: 'white' }}
            margin="dense"
          />
          <OutlinedTextField
            fullWidth
            label="Room name"
            placeholder="Room name"
            value={roomName}
            name="roomName"
            onChange={this.handleInputFieldChange}
            style={{ background: 'white' }}
            margin="dense"
          />
          <h2>Choose Hotword Recognition</h2>
          <Select
            value={hotword}
            fullWidth
            onChange={this.handleInputFieldChange}
            style={{ background: 'white', marginTop: 8 }}
            input={<OutlinedInput name="hotword" id="hotword" margin="dense" />}
          >
            <MenuItem value="y">Snowboy</MenuItem>
            <MenuItem value="n">Pocket Sphinx</MenuItem>
          </Select>
          <h2>Add Smart Speaker to Your SUSI.AI Account</h2>
          <P>
            This will allow you to use private skills you created online and
            synchronize your data. You cannot do this later. If you don&#39;t
            have an account on SUSI.AI, please connect to the Internet sign and
            up at SUSI.AI now.
          </P>
          <FormControlLabel
            value={authType}
            name="authType"
            control={
              <Radio
                color="primary"
                checked={authType === 'authenticated'}
                value="authenticated"
              />
            }
            label={<p>Connect to SUSI.AI</p>}
            labelPlacement="end"
            onChange={this.handleInputFieldChange}
          />
          {authType === 'authenticated' && (
            <React.Fragment>
              <OutlinedTextField
                fullWidth
                label="Email"
                placeholder="Email"
                value={email}
                name="email"
                onChange={this.handleInputFieldChange}
                style={{ background: 'white' }}
                aria-describedby="email"
                margin="dense"
                disabled={authType === 'anonymous'}
                error={emailErrorText !== ''}
              />
              <OutlinedTextField
                fullWidth
                label={'Password'}
                placeholder="Password"
                value={authPassword}
                name="authPassword"
                onChange={this.handleInputFieldChange}
                style={{ background: 'white' }}
                margin="dense"
                disabled={authType === 'anonymous'}
                error={passwordErrorText !== ''}
              />
            </React.Fragment>
          )}
          <FormControlLabel
            value={authType}
            name="authType"
            control={
              <Radio
                color="primary"
                checked={authType === 'anonymous'}
                value="anonymous"
              />
            }
            label={<p>Anonymous Mode</p>}
            labelPlacement="end"
            onChange={this.handleInputFieldChange}
          />
          <br />
          <P>
            Thank you for entering your details. You can now save your data.
            After you hit the &#34;Save&#34; button the device will shut down
            and reboot. The smart speaker will connect with your WiFi network
            and add the device to your SUSI.AI account, if you provided your
            credentials. If the smart speaker is not able to connect with the
            WiFi it will restart and open a hotspot again. You can configure the
            device again.
          </P>
          <P>
            If you would like to reset your device later manually (to get back
            here) you can press the device button for 10 seconds. The device
            will reset and you can access it again through the hotspot and
            configure it.
          </P>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleRebootSpeaker}
          >
            Save and Reboot
          </Button>
        </Wrapper>
      </Container>
    );
  }
}

export default ControlPage;

import React from 'react';
import _Paper from '@material-ui/core/Paper';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import uiActions from '../../../../redux/actions/ui';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import {
  fetchMailSettings,
  changeMailSettings,
  sendEmail,
} from '../../../../apis';
import CircularProgress from '@material-ui/core/CircularProgress';
import CircularLoader from '../../../shared/CircularLoader';
import _FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import OutlinedTextField from '../../../shared/OutlinedTextField';
import _Select from '../../../shared/Select';

const Paper = styled(_Paper)`
  max-width: 100%;
  padding: 1rem;
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12);
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;

const OutlinedSelect = styled(_Select)`
  width: 100%;
  font-weight: 400;
`;

const FormControl = styled(_FormControl)`
  margin-top: 16px;
  margin-bottom: 8px;
  width: 100%;
`;

const H3 = styled.h3`
  margin: 1rem 0;
`;

class Mail extends React.Component {
  state = {
    loading: true,
    frontendUrl: '',
    name: '',
    sendgridToken: '',
    type: '',
    email: '',
    trustselfsignedcerts: '',
    encryption: '',
    port: '',
    username: '',
    password: '',
    receiverEmail: '',
    isSaving: false,
    smtpHost: '',
  };

  getMailSettings = async () => {
    try {
      let { settings } = await fetchMailSettings();
      const {
        frontendUrl,
        name,
        sendgridToken,
        type,
        email,
        trustselfsignedcerts,
        encryption,
        port,
        smtpUserName: username,
        smtpPassword: password,
        smtpHost,
      } = settings;
      this.setState({
        frontendUrl,
        name,
        sendgridToken,
        type,
        email,
        trustselfsignedcerts,
        encryption,
        port,
        username,
        password,
        smtpHost,
        loading: false,
      });
    } catch (error) {
      this.props.actions.openSnackBar({
        snackBarMessage: 'Failed to fetch mail Settings!',
        snackBarDurations: 2000,
      });
      console.log(error);
    }
  };

  componentDidMount() {
    this.getMailSettings();
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleMailTypeChange = event => {
    this.setState({ type: event.target.value });
  };

  saveSettings = async () => {
    this.setState({ isSaving: true });
    const {
      frontendUrl,
      name,
      sendgridToken,
      type,
      email,
      trustselfsignedcerts,
      encryption,
      port,
      username,
      password,
      smtpHost,
    } = this.state;

    try {
      await changeMailSettings({
        frontendUrl,
        name,
        sendgridToken,
        type,
        email,
        trustselfsignedcerts,
        encryption,
        port,
        username,
        password,
        smtpHost,
      });
      this.setState({ isSaving: false });
      this.props.actions.openSnackBar({
        snackBarMessage: 'Successfully updated mail settings',
      });
    } catch (error) {
      this.setState({ isSaving: false });
      console.log('Error', error);
    }
  };

  sendTestMail = async () => {
    const {
      frontendUrl,
      name,
      sendgridToken,
      type,
      email,
      trustselfsignedcerts,
      encryption,
      port,
      username,
      password,
      smtpHost,
    } = this.state;
    const { receiverEmail } = this.props;
    if (type === 'SMTP') {
      try {
        await sendEmail({
          frontendUrl,
          name,
          sendgridToken,
          type,
          email,
          trustselfsignedcerts,
          encryption,
          port,
          username,
          password,
          receiverEmail,
          smtpHost,
        });
        this.props.actions.openSnackBar({
          snackBarMessage: 'You have successfully sent a test email',
        });
      } catch (error) {
        console.log('Error', error);
      }
    }
  };

  render() {
    const {
      frontendUrl,
      name,
      sendgridToken,
      type,
      email,
      receiverEmail,
      trustselfsignedcerts,
      encryption,
      port,
      username,
      password,
      smtpHost,
      isSaving,
      loading,
    } = this.state;
    let saveDisabled = false;
    if (type === 'SMTP') {
      saveDisabled = frontendUrl === '' || name === '' || email === '';
    }

    return (
      <Paper>
        {loading ? (
          <CircularLoader height={40} />
        ) : (
          <React.Fragment>
            <H3>Mail Gateway</H3>
            <FormControlLabel
              value={type}
              control={
                <Radio color="primary" checked={type === 'SMTP'} value="SMTP" />
              }
              label={<H3>SMTP</H3>}
              labelPlacement="end"
              onChange={this.handleMailTypeChange}
            />
            <OutlinedTextField
              label="From Name"
              placeholder="From Name"
              value={name || ''}
              name="name"
              onChange={this.handleChange}
              fullWidth
              margin="dense"
            />
            <OutlinedTextField
              label="From Email"
              placeholder="From Email"
              value={email || ''}
              name="email"
              onChange={this.handleChange}
              fullWidth
              margin="dense"
            />
            <OutlinedTextField
              label="Username"
              placeholder="Username"
              value={username || ''}
              name="username"
              onChange={this.handleChange}
              fullWidth
              margin="dense"
            />
            <OutlinedTextField
              label="Password"
              placeholder="Password"
              value={password || ''}
              name="password"
              type="password"
              onChange={this.handleChange}
              fullWidth
              margin="dense"
            />
            <OutlinedTextField
              label="Frontend Url"
              placeholder="Frontend Url"
              value={frontendUrl || ''}
              name="frontendUrl"
              onChange={this.handleChange}
              fullWidth
              margin="dense"
            />
            <OutlinedTextField
              label="SMTP Port"
              placeholder="SMTP Port"
              value={port || ''}
              name="port"
              onChange={this.handleChange}
              fullWidth
              margin="dense"
            />
            <FormControl variant="outlined">
              <InputLabel htmlFor="tssc">
                Trust Self-Signed Certificate
              </InputLabel>
              <OutlinedSelect
                value={trustselfsignedcerts}
                onChange={this.handleChange}
                fullWidth={true}
                input={
                  <OutlinedInput
                    labelWidth={'205'}
                    name="trustselfsignedcerts"
                    id="tssc"
                    margin="dense"
                  />
                }
              >
                <MenuItem value="true">True</MenuItem>
                <MenuItem value="false">False</MenuItem>
              </OutlinedSelect>
            </FormControl>
            <FormControl variant="outlined">
              <InputLabel htmlFor="encryption">Encryption</InputLabel>
              <OutlinedSelect
                value={encryption}
                onChange={this.handleChange}
                input={
                  <OutlinedInput
                    name="encryption"
                    labelWidth="76"
                    id="encryption"
                    margin="dense"
                  />
                }
              >
                <MenuItem value="tls">TLS</MenuItem>
                <MenuItem value="ssl">SSL</MenuItem>
                <MenuItem value="starttls">STARTTLS</MenuItem>
              </OutlinedSelect>
            </FormControl>
            <OutlinedTextField
              label="SMTP Host"
              placeholder="SMTP Host"
              value={smtpHost || ''}
              name="smtpHost"
              onChange={this.handleChange}
              fullWidth
              margin="dense"
            />

            <FormControlLabel
              value={type}
              control={
                <Radio
                  color="primary"
                  checked={type === 'sendgridToken'}
                  value="sendgridToken"
                />
              }
              label={
                <H3>
                  Sendgrid API (See{' '}
                  <a
                    href="https://sendgrid.com/docs/ui/account-and-settings/api-keys/#creating-an-api-key"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    here
                  </a>{' '}
                  on how to get this token)
                </H3>
              }
              labelPlacement="end"
              onChange={this.handleMailTypeChange}
            />
            <OutlinedTextField
              label="Sendgrid Token"
              placeholder="Sendgrid Token"
              value={sendgridToken}
              name="sendgridToken"
              onChange={this.handleChange}
              disabled={type !== 'sendgridToken'}
              fullWidth
              margin="dense"
            />
            <FormControlLabel
              value={type}
              control={
                <Radio
                  color="primary"
                  checked={type === 'Disabled'}
                  value="Disabled"
                />
              }
              label={<H3>Disable</H3>}
              labelPlacement="end"
              onChange={this.handleMailTypeChange}
            />
            <H3>Send Test Email</H3>
            <FlexContainer>
              <OutlinedTextField
                label="Receiver Email"
                placeholder="Receiver Email"
                value={receiverEmail || ''}
                name="receiverEmail"
                onChange={this.handleChange}
                style={{ width: '85%', marginRight: '1rem' }}
                margin="dense"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={this.sendTestMail}
                disabled={type === 'Disabled'}
              >
                Send Mail
              </Button>
            </FlexContainer>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '3rem',
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={this.saveSettings}
                disabled={saveDisabled}
                style={{ minWidth: '10rem', fontSize: '1.2rem' }}
                margin="dense"
              >
                {isSaving ? (
                  <CircularProgress size={33} color="inherit" />
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </React.Fragment>
        )}
      </Paper>
    );
  }
}

Mail.propTypes = {
  actions: PropTypes.object,
  receiverEmail: PropTypes.string,
};

function mapStateToProps(store) {
  return {
    receiverEmail: store.app.email,
  };
}

function mapStateToDispatch(dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapStateToDispatch,
)(Mail);

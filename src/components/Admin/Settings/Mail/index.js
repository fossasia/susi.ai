import React from 'react';
import _Paper from '@material-ui/core/Paper';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import uiActions from '../../../../redux/actions/ui';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import _ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { FlexContainer } from '../../../shared/Container';
import {
  fetchMailSettings,
  changeMailSettings,
  sendEmail,
} from '../../../../apis';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress';
import CircularLoader from '../../../shared/CircularLoader';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import OutlinedTextField from '../../../shared/OutlinedTextField';
import _Select from '../../../shared/Select';

const Paper = styled(_Paper)`
  padding: 2rem;
  max-width: 70rem;
`;

const ExpansionPanelDetails = styled(_ExpansionPanelDetails)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OutlinedSelect = styled(_Select)`
  width: 14rem;
  font-weight: 400;
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

  getMailSettings = () => {
    fetchMailSettings().then(({ settings }) => {
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
    });
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

  saveSettings = () => {
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
    changeMailSettings({
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
    })
      .then(() => {
        this.setState({ isSaving: false });
        this.props.actions.openSnackBar({
          snackBarMessage: 'Successfully updated mail settings',
        });
      })
      .catch(e => {
        this.setState({ isSaving: false });
        console.log('Error', e);
      });
  };

  sendTestMail = () => {
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
      sendEmail({
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
      })
        .then(
          this.props.actions.openSnackBar({
            snackBarMessage: `Mail sent successfully to ${receiverEmail}`,
          }),
        )
        .catch(e => {
          console.log('Error', e);
        });
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
    } else if (type === 'Sendgrid') {
      saveDisabled = sendgridToken === '';
    }

    return (
      <Paper>
        {loading ? (
          <CircularLoader height={40} />
        ) : (
          <React.Fragment>
            <FlexContainer>
              <OutlinedTextField
                label="SMTP Host"
                placeholder="SMTP Host"
                value={smtpHost || ''}
                name="smtpHost"
                onChange={this.handleChange}
                style={{ width: '34%' }}
              />
              <OutlinedTextField
                label="From Email"
                placeholder="From Email"
                value={email || ''}
                name="email"
                onChange={this.handleChange}
                style={{ width: '33%' }}
              />
              <OutlinedTextField
                label="From Name"
                placeholder="From Name"
                value={name || ''}
                name="name"
                onChange={this.handleChange}
                style={{ width: '28%' }}
              />
            </FlexContainer>
            <FlexContainer
              style={{ alignItems: 'baseline', marginBottom: '1rem' }}
            >
              <OutlinedTextField
                label="SMTP Port"
                placeholder="SMTP Port"
                value={port || ''}
                name="port"
                onChange={this.handleChange}
                style={{ width: '20%' }}
              />
              <OutlinedTextField
                label="Frontend Url"
                placeholder="Frontend Url"
                value={frontendUrl || ''}
                name="frontendUrl"
                onChange={this.handleChange}
                style={{ width: '30%' }}
              />
              <FormControl variant="outlined">
                <InputLabel htmlFor="tssc">
                  Trust Self-Signed Certificate
                </InputLabel>
                <OutlinedSelect
                  value={trustselfsignedcerts}
                  onChange={this.handleChange}
                  input={
                    <OutlinedInput
                      labelWidth={'205'}
                      name="trustselfsignedcerts"
                      id="tssc"
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
                    />
                  }
                >
                  <MenuItem value="tls">TLS</MenuItem>
                  <MenuItem value="ssl">SSL</MenuItem>
                  <MenuItem value="starttls">STARTTLS</MenuItem>
                </OutlinedSelect>
              </FormControl>
            </FlexContainer>
            <FormLabel component="legend">Mail Gateway</FormLabel>
            <RadioGroup
              aria-label="Mail Gateway"
              name="type"
              value={type}
              onChange={this.handleMailTypeChange}
            >
              <FormControlLabel
                value="Disable"
                control={<Radio />}
                label="Disable"
              />
              <FormControlLabel value="SMTP" control={<Radio />} label="SMTP" />
              <FormControlLabel
                value="Sendgrid"
                control={<Radio />}
                label={
                  <span>
                    Sendgrid API (See{' '}
                    <a
                      href="https://sendgrid.com/docs/ui/account-and-settings/api-keys/#creating-an-api-key"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      here
                    </a>{' '}
                    on how to get this token)
                  </span>
                }
              />
            </RadioGroup>
            <FlexContainer>
              <OutlinedTextField
                label="Sendgrid Token"
                placeholder="Sendgrid Token"
                value={sendgridToken || ''}
                fullWidth={true}
                name="sendgridToken"
                onChange={this.handleChange}
                disabled={type !== 'Sendgrid'}
                style={{ width: '63%' }}
              />
            </FlexContainer>
            <FlexContainer>
              <OutlinedTextField
                label="Username"
                placeholder="Username"
                value={username || ''}
                name="username"
                onChange={this.handleChange}
                style={{ width: '49%' }}
              />
              <OutlinedTextField
                label="Password"
                placeholder="Password"
                value={password || ''}
                name="password"
                onChange={this.handleChange}
                style={{ width: '49%' }}
              />
            </FlexContainer>
            <ExpansionPanel style={{ margin: '1rem 0' }}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Send Test Email</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <OutlinedTextField
                  label="Receiver Email"
                  placeholder="Receiver Email"
                  value={receiverEmail || ''}
                  name="receiverEmail"
                  onChange={this.handleChange}
                  style={{ width: '85%' }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.sendTestMail}
                  disabled={type === 'Disabled'}
                >
                  Send Mail
                </Button>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <Button
              variant="contained"
              color="primary"
              onClick={this.saveSettings}
              disabled={saveDisabled}
              style={{ minWidth: '70px' }}
            >
              {isSaving ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Save'
              )}
            </Button>
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

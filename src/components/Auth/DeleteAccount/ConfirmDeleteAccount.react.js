import React from 'react';
import PropTypes from 'prop-types';
import CloseButton from '../../shared/CloseButton';
import { withRouter } from 'react-router';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { connect } from 'react-redux';
import uiActions from '../../../redux/actions/ui';
import CircularProgress from '@material-ui/core/CircularProgress';
import Translate from '../../Translate/Translate.react';
import appActions from '../../../redux/actions/app';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { deleteAccount } from '../../../apis';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { OutlinedInput } from '../AuthStyles';

const DangerButton = styled(Button)`
  color: #cb2431;
  border-color: #cb2431;
`;

const WarningContainer = styled.div`
  background-color: #fffbdd;
  color: #735c0f;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(27, 31, 35, 0.15);
`;

const deleteCookie = (name, options = {}) => {
  let cookieString = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  if (options.domain) {
    cookieString = `${cookieString}domain=${options.domain};`;
  }
  if (options.path) {
    cookieString = `${cookieString}path=${options.path};`;
  }
  document.cookie = cookieString;
};

class ConfirmDeleteAccount extends React.Component {
  static propTypes = {
    actions: PropTypes.object,
    email: PropTypes.string,
    history: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      confirmed: false,
      emailError: '',
      emailInput: '',
      loading: false,
    };
  }

  handleClose = event => {
    this.props.actions.closeModal();
  };

  handleConfirm = event => {
    this.setState({ loading: true });
    const { confirmed } = this.state;
    const { actions, history } = this.props;
    if (confirmed) {
      deleteAccount()
        .then(response => {
          this.setState({ loading: false });
          deleteCookie('loggedIn', { domain: '.susi.ai', path: '/' });
          deleteCookie('emailId', { domain: '.susi.ai', path: '/' });
          actions.logout().then(() => {
            actions.closeModal();
            actions.openSnackBar({
              snackBarMessage: 'Account deleted successfully',
            });
            history.push('/');
          });
        })
        .catch(error => {
          this.setState({ loading: false });
          console.error('Some error occured');
          actions.openSnackBar({
            snackBarMessage: 'Invalid Password! Try again later',
          });
        });
    }
  };

  handleEmailChange = event => {
    const { email } = this.props;
    const { value } = event.target;
    const emailError = !(email === value);
    if (emailError) {
      this.emailErrorMessage = 'Email does not match';
      this.setState({ confirmed: false, emailInput: value, emailError });
    } else {
      this.emailErrorMessage = '';
      this.setState({ confirmed: true, emailInput: value, emailError });
    }
  };

  render() {
    const { email } = this.props;
    const { emailInput, confirmed, loading } = this.state;
    return (
      <React.Fragment>
        <DialogTitle>
          Are you absolutely sure?
          <CloseButton onClick={this.handleClose} />
        </DialogTitle>
        <DialogContent>
          <WarningContainer>
            Unexpected bad things will happen if you don’t read this!
          </WarningContainer>
          <DialogContentText>
            This action <strong>cannot</strong> be undone. This will permanently
            remove the account corresponding to the email id{' '}
            <strong>{email}</strong>.
            <br />
            <br />
            <strong>Please type in your email id to confirm.</strong>
          </DialogContentText>
          <FormControl error={this.emailErrorMessage !== ''}>
            <OutlinedInput
              name="email"
              value={emailInput}
              placeholder="Email"
              onChange={this.handleEmailChange}
              width="29rem"
            />
            <FormHelperText error={this.emailErrorMessage !== ''}>
              {this.emailErrorMessage}
            </FormHelperText>
          </FormControl>
        </DialogContent>
        {/* Remove Device Button */}
        <DangerButton
          onClick={this.handleConfirm}
          confirmed={confirmed}
          disabled={!confirmed}
          variant="outlined"
        >
          {loading ? (
            <CircularProgress color="default" size={24} />
          ) : (
            <Translate text="I understand the consequences, Delete My Account." />
          )}
        </DangerButton>
      </React.Fragment>
    );
  }
}

function mapStateToProps(store) {
  return {
    email: store.app.email,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...uiActions, ...appActions }, dispatch),
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ConfirmDeleteAccount),
);

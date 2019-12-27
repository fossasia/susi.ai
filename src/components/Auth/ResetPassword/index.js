import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import FormHelperText from '@material-ui/core/FormHelperText';
import CircularProgress from '@material-ui/core/CircularProgress';
import zxcvbn from 'zxcvbn';
import PropTypes from 'prop-types';
import { PasswordField, FormControl, Button } from '../AuthStyles';
import Translate from '../../Translate/Translate.react';
import isPassword from '../../../utils/isPassword';
import PasswordStrengthBar from '../../shared/PasswordStrengthBar';
import { checkResetPasswordToken, resetPassword } from '../../../apis';
import uiActions from '../../../redux/actions/ui';

class ResetPassword extends Component {
  static propTypes = {
    location: PropTypes.object,
    actions: PropTypes.object,
    history: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      newPassword: '',
      newPasswordErrorMessage: '',
      newPasswordStrength: '',
      newPasswordScore: -1,
      confirmNewPassword: '',
      newPasswordConfirmErrorMessage: '',
      invalidToken: false,
    };
    this.token = this.props.location.search.split('=')[1] || '';
  }
  async componentDidMount() {
    const { actions } = this.props;
    try {
      let { message } = await checkResetPasswordToken({ token: this.token });
      actions.openSnackBar({
        snackBarMessage: message,
        snackBarDuration: 4000,
      });
    } catch (error) {
      actions.openSnackBar({
        snackBarMessage: 'Invalid request!',
        snackBarDuration: 4000,
      });
      this.setState({ invalidToken: true });
    }
  }

  componentWillUnmount() {
    this.props.history.push('/');
  }

  handleTextFieldChange = event => {
    switch (event.target.name) {
      case 'newPassword': {
        const {
          confirmNewPassword,
          newPasswordConfirmErrorMessage,
        } = this.state;
        const newPassword = event.target.value.trim();
        const newPasswordError = !isPassword(newPassword);
        const newPasswordScore = !newPasswordError
          ? zxcvbn(newPassword).score
          : -1;
        const newPasswordStrength = !newPasswordError
          ? [
              <Translate key={1} text="Too Insecure" />,
              <Translate key={2} text="Bad" />,
              <Translate key={3} text="Weak" />,
              <Translate key={4} text="Good" />,
              <Translate key={5} text="Strong" />,
            ][newPasswordScore]
          : '';

        const newPasswordConfirmError =
          (confirmNewPassword || newPasswordConfirmErrorMessage) &&
          !(confirmNewPassword === newPassword);

        this.setState({
          newPassword,
          newPasswordErrorMessage: newPasswordError ? (
            <Translate text="Atleast 8 characters, 1 special character, number, 1 capital letter" />
          ) : (
            ''
          ),
          newPasswordScore,
          newPasswordStrength,
          newPasswordConfirmErrorMessage: newPasswordConfirmError ? (
            <Translate text="Password does not match" />
          ) : (
            ''
          ),
        });
        break;
      }
      case 'confirmNewPassword': {
        const { newPassword } = this.state;
        const confirmNewPassword = event.target.value.trim();
        const newPasswordConfirmError = !(
          confirmNewPassword && confirmNewPassword === newPassword
        );
        this.setState({
          confirmNewPassword,
          newPasswordConfirmErrorMessage: newPasswordConfirmError ? (
            <Translate text="Password does not match" />
          ) : (
            ''
          ),
        });
        break;
      }
      default:
        break;
    }
  };

  onEnterKey = e => {
    if (e.keyCode === 13) {
      this.handleSubmit();
    }
  };

  handleSubmit = async () => {
    const { actions } = this.props;
    const { newPassword } = this.state;
    this.setState({ loading: true });
    try {
      let message = await resetPassword({
        token: this.token,
        newpass: newPassword,
      });
      actions.openSnackBar({
        snackBarMessage: message,
        snackBarDuration: 4000,
      });
      actions.openModal({ modalType: 'login' });
      this.setState({ loading: false });
    } catch (error) {
      actions.openSnackBar({
        snackBarMessage: `Failed ${error.message}`,
        snackBarDuration: 4000,
      });
      this.setState({ loading: false });
    }
  };

  render() {
    const {
      loading,
      invalidToken,
      newPassword,
      newPasswordErrorMessage,
      confirmNewPassword,
      newPasswordConfirmErrorMessage,
      newPasswordScore,
      newPasswordStrength,
    } = this.state;
    const isValid =
      !invalidToken &&
      !newPasswordConfirmErrorMessage &&
      !newPasswordErrorMessage &&
      newPassword &&
      confirmNewPassword;
    return (
      <React.Fragment>
        <DialogTitle>
          <Translate text="Reset Password" />
        </DialogTitle>
        <DialogContent>
          <form autoComplete="false">
            <FormControl
              error={newPasswordErrorMessage !== ''}
              disabled={loading}
            >
              <PasswordField
                name="newPassword"
                value={newPassword}
                placeholder="New Password"
                onChange={this.handleTextFieldChange}
                onKeyUp={this.onEnterKey}
              />
              <FormHelperText error={newPasswordErrorMessage !== ''}>
                {newPasswordErrorMessage}
              </FormHelperText>
            </FormControl>
            <div style={{ textAlign: 'center' }}>
              <PasswordStrengthBar score={newPasswordScore} />
              <span>{newPasswordStrength}</span>
            </div>
            <FormControl
              error={newPasswordConfirmErrorMessage !== ''}
              disabled={loading}
            >
              <PasswordField
                name="confirmNewPassword"
                value={confirmNewPassword}
                placeholder="Confirm Password"
                onChange={this.handleTextFieldChange}
                onKeyUp={this.onEnterKey}
              />
              <FormHelperText error={newPasswordConfirmErrorMessage !== ''}>
                {newPasswordConfirmErrorMessage}
              </FormHelperText>
            </FormControl>
          </form>
          <Button
            onClick={this.handleSubmit}
            variant="contained"
            color="primary"
            disabled={!isValid || loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <Translate text="SUBMIT" />
            )}
          </Button>
        </DialogContent>
      </React.Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch),
  };
}

export default withRouter(
  connect(
    null,
    mapDispatchToProps,
  )(ResetPassword),
);

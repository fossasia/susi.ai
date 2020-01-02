import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import zxcvbn from 'zxcvbn';
import styled from 'styled-components';
import Button from '../../shared/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import _PasswordField from 'material-ui-password-field';
import CircularProgress from '@material-ui/core/CircularProgress';
import Translate from '../../Translate/Translate.react';
import appActions from '../../../redux/actions/app';
import uiActions from '../../../redux/actions/ui';
import PasswordStrengthBar from '../../shared/PasswordStrengthBar';
import isPassword from '../../../utils/isPassword';
import Recaptcha from '../../shared/Recaptcha';

const PasswordField = styled(_PasswordField)`
  height: 35px;
  border-radius: 4;
  border: 1px solid #ced4da;
  padding: 0px 12px;
  width: 22.5rem;
  @media (max-width: 520px) {
    width: 100%;
    max-width: 17rem;
  }
`;

const Form = styled(FormControl)`
  @media (max-width: 520px) {
    width: 100%;
  }
`;

const ForgotPasswordLink = styled.div`
  margin: 1rem 0;
  color: #1da1f5;
  cursor: pointer;
  width: fit-content;
  a {
    text-decoration: none;
  }
  :hover {
    text-decoration: underline;
  }
`;

const LabelContainer = styled.div`
  width: 30%;
  min-width: 9rem;
  float: left;
  margin-top: 12px;
`;

class ChangePassword extends Component {
  static propTypes = {
    history: PropTypes.object,
    settings: PropTypes.object,
    actions: PropTypes.object,
    email: PropTypes.string,
    captchaKey: PropTypes.string,
    isCaptchaEnabled: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      password: '',
      newPassword: '',
      newPasswordErrorMessage: '',
      newPasswordStrength: '',
      newPasswordScore: -1,
      confirmNewPassword: '',
      newPasswordConfirmErrorMessage: '',
      success: false,
      loading: false,
      showCaptchaErrorMessage: false,
      captchaResponse: '',
    };
  }

  onCaptchaLoad = () => {
    this.setState({
      showCaptchaErrorMessage: true,
    });
  };

  onCaptchaSuccess = captchaResponse => {
    if (captchaResponse) {
      this.setState({
        showCaptchaErrorMessage: false,
        captchaResponse,
      });
    }
  };

  handleCloseResetPassword = () => {
    const { success } = this.state;
    this.props.actions.closeModal();
    if (success) {
      this.props.history.push('/logout');
    } else {
      this.setState({
        password: '',
        newPassword: '',
        newPasswordErrorMessage: '',
        newPasswordStrength: '',
        newPasswordScore: -1,
        confirmNewPassword: '',
        newPasswordConfirmErrorMessage: '',
        success: false,
        loading: false,
      });
    }
  };

  // Handle changes to current, new and confirm new passwords
  handleTextFieldChange = event => {
    switch (event.target.name) {
      case 'password': {
        const password = event.target.value.trim();
        this.setState({
          password,
        });
        break;
      }
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

  changePassword = async event => {
    event.preventDefault();
    const {
      password,
      newPassword,
      newPasswordErrorMessage,
      newPasswordConfirmErrorMessage,
      captchaResponse,
      showCaptchaErrorMessage,
    } = this.state;
    const { actions, email } = this.props;

    if (
      !(
        newPasswordErrorMessage ||
        newPasswordConfirmErrorMessage ||
        showCaptchaErrorMessage
      )
    ) {
      this.setState({
        loading: true,
      });
      try {
        let payload = await actions.getChangePassword({
          email,
          password: encodeURIComponent(password),
          newPassword: encodeURIComponent(newPassword),
          captchaResponse,
        });
        let dialogMessage;
        let success;
        if (payload.accepted) {
          dialogMessage = `${payload.message}\n Please login again.`;
          success = true;
        } else {
          dialogMessage = `${payload.message}\n Please Try Again.`;
          success = false;
        }

        this.props.actions.openModal({
          modalType: 'confirm',
          title: success ? 'Success' : 'Failure',
          handleConfirm: this.handleCloseResetPassword,
          content: <p>{dialogMessage}</p>,
        });

        this.setState({
          success,
          loading: false,
        });
      } catch (error) {
        this.props.actions.openModal({
          modalType: 'confirm',
          title: 'Failure',
          handleConfirm: this.handleCloseResetPassword,
          content: <p>Failed. Try Again</p>,
        });
        this.setState({
          loading: false,
        });
      }
    }
  };

  render() {
    const {
      password,
      newPassword,
      newPasswordErrorMessage,
      confirmNewPassword,
      newPasswordConfirmErrorMessage,
      newPasswordScore,
      newPasswordStrength,
      loading,
      showCaptchaErrorMessage,
    } = this.state;
    const { actions, captchaKey, isCaptchaEnabled } = this.props;
    const isValid =
      !newPasswordErrorMessage &&
      !newPasswordConfirmErrorMessage &&
      (isCaptchaEnabled ? !showCaptchaErrorMessage : true) &&
      password &&
      newPassword &&
      confirmNewPassword;

    return (
      <React.Fragment>
        <form autoComplete="false">
          <LabelContainer>Current Password</LabelContainer>
          <Form disabled={loading}>
            <PasswordField
              name="password"
              value={password}
              onChange={this.handleTextFieldChange}
              style={{ marginBottom: '20px' }}
            />{' '}
          </Form>
          <LabelContainer>New Password</LabelContainer>
          <Form error={newPasswordErrorMessage !== ''} disabled={loading}>
            <PasswordField
              name="newPassword"
              placeholder="Must be between 8-64 characters"
              value={newPassword}
              onChange={this.handleTextFieldChange}
            />
            <FormHelperText error={newPasswordErrorMessage !== ''}>
              {newPasswordErrorMessage}
            </FormHelperText>
          </Form>
          <div style={{ textAlign: 'center' }}>
            <PasswordStrengthBar score={newPasswordScore} />
            <span>{newPasswordStrength}</span>
          </div>
          <LabelContainer>Verify Password</LabelContainer>
          <div>
            <Form
              error={newPasswordConfirmErrorMessage !== ''}
              disabled={loading}
            >
              <PasswordField
                name="confirmNewPassword"
                placeholder="Must match the new password"
                value={confirmNewPassword}
                onChange={this.handleTextFieldChange}
              />
              <FormHelperText error={newPasswordConfirmErrorMessage !== ''}>
                {newPasswordConfirmErrorMessage}
              </FormHelperText>
            </Form>
          </div>
          {isCaptchaEnabled && captchaKey && (
            <Recaptcha
              captchaKey={captchaKey}
              onCaptchaLoad={this.onCaptchaLoad}
              onCaptchaSuccess={this.onCaptchaSuccess}
              error={showCaptchaErrorMessage}
            />
          )}
        </form>
        <ForgotPasswordLink
          onClick={() => actions.openModal({ modalType: 'forgotPassword' })}
        >
          Forgot your password?
        </ForgotPasswordLink>
        <div>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={!isValid || loading}
            onClick={this.changePassword}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <Translate text="Save Changes" />
            )}
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(store) {
  const { email } = store.app;
  const { captchaKey } = store.app.apiKeys;
  const { changePassword: isCaptchaEnabled = true } = store.app.captchaConfig;
  return {
    email,
    captchaKey,
    isCaptchaEnabled,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...appActions, ...uiActions }, dispatch),
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ChangePassword),
);

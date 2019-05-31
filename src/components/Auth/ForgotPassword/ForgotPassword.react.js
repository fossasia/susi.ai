import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseButton from '../../shared/CloseButton';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Translate from '../../Translate/Translate.react';
import appActions from '../../../redux/actions/app';
import uiActions from '../../../redux/actions/ui';
import { isEmail } from '../../../utils';

class ForgotPassword extends Component {
  static propTypes = {
    actions: PropTypes.object,
    openSnackBar: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailErrorMessage: '',
      success: false,
      loading: false,
    };
  }

  handleDialogClose = () => {
    const { actions } = this.props;

    this.setState({
      email: '',
      emailErrorMessage: '',
      success: false,
      loading: false,
    });

    actions.closeModal();
  };

  handleTextFieldChange = event => {
    const email = event.target.value.trim();
    const emailError = !isEmail(email);
    this.setState({
      email,
      emailErrorMessage: emailError ? <Translate text="Invalid Email" /> : '',
    });
  };

  handleSubmit = event => {
    const { actions } = this.props;
    const { email, emailErrorMessage } = this.state;

    if (email && !emailErrorMessage) {
      this.setState({ loading: true });
      actions
        .getForgotPassword({ email })
        .then(({ payload }) => {
          let snackBarMessage = payload.message;
          let success;
          if (payload.accepted) {
            success = true;
          } else {
            success = false;
            snackBarMessage = 'Please Try Again';
          }
          this.setState({
            success,
            loading: false,
          });
          actions.openSnackBar({
            snackBarMessage,
          });
        })
        .catch(error => {
          this.setState({
            loading: false,
            success: false,
          });
          if (error.statusCode === 422) {
            actions.openSnackBar({
              snackBarMessage: 'Email does not exist.',
            });
          } else {
            actions.openSnackBar({
              snackBarMessage: 'Failed. Try Again',
            });
          }
        });
    }
  };

  onEnterKey = e => {
    if (e.keyCode === 13) {
      this.handleSubmit();
    }
  };

  render() {
    const { email, emailErrorMessage, loading } = this.state;
    const isValid = !emailErrorMessage && email;
    return (
      <React.Fragment>
        <DialogTitle>
          <Translate text="Forgot Password ?" />
        </DialogTitle>
        <div style={{ margin: '1.1rem 0' }}>
          <FormControl error={emailErrorMessage !== ''}>
            <InputLabel>Email</InputLabel>
            <Input
              value={email}
              onChange={this.handleTextFieldChange}
              aria-describedby="email-error-text"
              style={{ width: '256px' }}
              onKeyUp={this.onEnterKey}
              autofocus={true}
            />
            <FormHelperText error={emailErrorMessage !== ''}>
              {emailErrorMessage}
            </FormHelperText>
          </FormControl>
        </div>
        <div style={{ margin: '10px 0' }}>
          {/* Reset Button */}
          <Button
            onClick={this.handleSubmit}
            color="primary"
            variant="contained"
            style={{
              width: '200px',
              margin: '10px auto',
              display: 'block',
            }}
            disabled={!isValid || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Reset'}
          </Button>
        </div>
        <CloseButton onClick={this.handleDialogClose} />
      </React.Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...appActions, ...uiActions }, dispatch),
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(ForgotPassword);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Close from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Translate from '../../Translate/Translate.react';
import appActions from '../../../redux/actions/app';
import uiActions from '../../../redux/actions/ui';
import { isEmail } from '../../../utils';
import './ForgotPassword.css';

const styles = {
  paperStyle: {
    width: '100%',
    textAlign: 'center',
    padding: '10px',
  },
  underlineFocusStyle: {
    color: '#4285f4',
  },
  closingStyle: {
    position: 'absolute',
    zIndex: 1200,
    fill: '#444',
    width: '26px',
    height: '26px',
    right: '10px',
    top: '10px',
    cursor: 'pointer',
  },
};

class ForgotPassword extends Component {
  static propTypes = {
    actions: PropTypes.object,
    openSnackBar: PropTypes.func,
    modalProps: PropTypes.object,
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
    event.preventDefault();

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
    const { modalProps, actions } = this.props;
    const isValid = !emailErrorMessage && email;
    return (
      <Dialog
        open={
          modalProps &&
          modalProps.isModalOpen &&
          modalProps.modalType === 'forgotPassword'
        }
        onClose={actions.closeModal}
        maxWidth={'sm'}
        fullWidth={true}
        onKeyUp={this.onEnterKey}
      >
        <div className="forgotPwdForm">
          <h3>
            <Translate text="Forgot Password ?" />
          </h3>
          <div style={{ margin: '1.1rem 0' }}>
            <FormControl error={emailErrorMessage !== ''}>
              <InputLabel>Email</InputLabel>
              <Input
                value={email}
                onChange={this.handleTextFieldChange}
                aria-describedby="email-error-text"
                style={{ width: '256px' }}
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
        </div>
        <Close style={styles.closingStyle} onClick={this.handleDialogClose} />
      </Dialog>
    );
  }
}

function mapStateToProps(store) {
  return {
    modalProps: store.ui.modalProps,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...appActions, ...uiActions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ForgotPassword);

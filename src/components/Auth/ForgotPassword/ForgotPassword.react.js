import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import Close from 'material-ui/svg-icons/navigation/close';
import Dialog from 'material-ui/Dialog';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import Translate from '../../Translate/Translate.react';
import actions from '../../../redux/actions/app';
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
    openForgotPassword: PropTypes.bool,
    onRequestClose: PropTypes.func,
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
    const { onRequestClose } = this.props;

    this.setState({
      email: '',
      emailErrorMessage: '',
      success: false,
      loading: false,
    });

    onRequestClose();
  };

  handleTextFieldChange = event => {
    if (event.target.name === 'email') {
      const email = event.target.value.trim();
      const emailError = !isEmail(email);
      this.setState({
        email,
        emailErrorMessage: emailError ? <Translate text="Invalid Email" /> : '',
      });
    }
  };

  handleSubmit = event => {
    event.preventDefault();

    const { actions, openSnackBar } = this.props;
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
          openSnackBar({
            snackBarMessage,
            snackBarDuration: 8000,
          });
        })
        .catch(error => {
          this.setState({
            loading: false,
            success: false,
          });
          openSnackBar({
            snackBarMessage: 'Failed. Try Again',
            snackBarDuration: 6000,
          });
        });
    }
  };

  render() {
    const { email, emailErrorMessage, loading } = this.state;
    const { openForgotPassword } = this.props;
    const isValid = !emailErrorMessage && email;

    return (
      <Dialog
        className="dialogStyle"
        modal={false}
        open={openForgotPassword}
        autoScrollBodyContent={true}
        bodyStyle={{
          padding: 0,
          textAlign: 'center',
        }}
        contentStyle={{ width: '35%', minWidth: '300px' }}
        onRequestClose={this.handleDialogClose}
      >
        <div className="forgotPwdForm">
          <Paper zDepth={0} style={styles.paperStyle}>
            <h3>
              <Translate text="Forgot Password ?" />
            </h3>
            <form onSubmit={this.handleSubmit}>
              <div>
                <TextField
                  name="email"
                  floatingLabelText={<Translate text="Email" />}
                  errorText={emailErrorMessage}
                  value={email}
                  underlineFocusStyle={styles.underlineFocusStyle}
                  floatingLabelFocusStyle={styles.underlineFocusStyle}
                  onChange={this.handleTextFieldChange}
                />
              </div>
              <div style={{ margin: '10px 0px' }}>
                {/* Reset Button */}
                <RaisedButton
                  type="submit"
                  label={!loading && 'Reset'}
                  backgroundColor={
                    UserPreferencesStore.getTheme() === 'light'
                      ? '#4285f4'
                      : '#19314B'
                  }
                  labelColor="#fff"
                  style={{ width: '200px', margin: '10px 0px' }}
                  disabled={!isValid || loading}
                  icon={loading && <CircularProgress size={24} />}
                />
              </div>
            </form>
          </Paper>
        </div>
        <Close
          style={styles.closingStyle}
          onTouchTap={this.handleDialogClose}
        />
      </Dialog>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(ForgotPassword);

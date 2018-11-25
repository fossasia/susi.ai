import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import Translate from '../../Translate/Translate.react';
import actions from '../../../redux/actions/app';
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
};

class ForgotPassword extends Component {
  static propTypes = {
    actions: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailErrorMessage: '',
      success: false,
      dialogMessage: '',
      loading: false,
    };
  }

  handleTextFieldChange = event => {
    if (event.target.name === 'email') {
      const email = event.target.value.trim();
      const validEmail = new RegExp(
        ['^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$'].join(''),
        'i',
      ).test(email);
      const emailError = !(validEmail && email);
      this.setState({
        email,
        emailErrorMessage: emailError ? <Translate text="Invalid Email" /> : '',
        dialogMessage: '',
      });
    }
  };

  handleSubmit = event => {
    event.preventDefault();

    const { actions } = this.props;
    const { email, emailErrorMessage } = this.state;

    this.setState({ dialogMessage: '' });
    if (email && !emailErrorMessage) {
      this.setState({ loading: true });
      actions
        .getForgotPassword({ email })
        .then(({ payload }) => {
          let dialogMessage = payload.message;
          let success;
          if (payload.accepted) {
            success = true;
          } else {
            success = false;
            dialogMessage = 'Please Try Again';
          }
          this.setState({
            success,
            dialogMessage,
            loading: false,
          });
        })
        .catch(error => {
          this.setState({
            loading: false,
            success: false,
            dialogMessage: 'Failed. Try Again',
          });
        });
    }
  };

  render() {
    const {
      email,
      emailErrorMessage,
      dialogMessage,
      success,
      loading,
    } = this.state;
    const isValid = !emailErrorMessage && email;

    return (
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
              {dialogMessage && (
                <div style={{ color: success ? '#388e3c' : '#f44336' }}>
                  {dialogMessage}
                </div>
              )}
            </div>
            <div style={{ margin: '10px 0px' }}>
              {/* Reset Button */}
              <RaisedButton
                type="submit"
                label={!loading ? 'Reset' : undefined}
                backgroundColor={
                  UserPreferencesStore.getTheme() === 'light'
                    ? '#4285f4'
                    : '#19314B'
                }
                labelColor="#fff"
                style={{ width: '200px', margin: '10px 0px' }}
                disabled={!isValid || loading}
                icon={loading ? <CircularProgress size={24} /> : undefined}
              />
            </div>
          </form>
        </Paper>
      </div>
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

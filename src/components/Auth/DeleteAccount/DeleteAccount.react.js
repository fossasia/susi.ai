import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// Components
import PasswordField from 'material-ui-password-field';
import CircularProgress from '@material-ui/core/CircularProgress';
import Translate from '../../Translate/Translate.react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import _Paper from '@material-ui/core/Paper';
import { checkPassword, checkAccountPermission } from '../../../apis';
import styled from 'styled-components';
import uiActions from '../../../redux/actions/ui';

const DeleteButton = styled(Button)`
  background-color: #ff0000;
  color: white;
  :hover {
    background-color: #b20000;
  }
`;

const Paper = styled(_Paper)`
  margin: 5rem auto;
  padding: 0.625rem;
  text-align: center;
  width: 25rem;
  @media (max-width: 450px) {
    width: 18.75rem;
  }
`;

class DeleteAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      passwordError: false,
      loading: false,
    };
    this.passwordErrorMessage = '';
  }

  componentDidMount() {
    const { actions, accessToken } = this.props;
    if (accessToken) {
      checkAccountPermission()
        .then(response => {})
        .catch(error => {
          actions.openSnackBar({ snackBarMessage: 'Not logged In!' });
        });
    } else {
      actions.openSnackBar({ snackBarMessage: 'Not logged In!' });
    }
  }

  handleChange = event => {
    let password;
    let state = this.state;
    password = event.target.value;
    state.password = password;
    state.passwordError = !password;
    if (this.state.passwordError) {
      this.passwordErrorMessage = 'Password field cannot be blank';
      state.validForm = false;
    } else {
      this.passwordErrorMessage = '';
      state.validForm = true;
    }
    this.setState(state);
  };

  handleChange = event => {
    const password = event.target.value;
    const passwordError = !password;
    if (passwordError) {
      this.passwordErrorMessage = 'Password field cannot be blank';
      this.setState({ password, passwordError, validForm: false });
    } else {
      this.passwordErrorMessage = '';
      this.setState({ password, passwordError, validForm: true });
    }
  };

  handleSubmit = event => {
    this.setState({ loading: true });
    const { actions, email } = this.props;
    let password = this.state.password.trim();
    checkPassword({ login: email, password: password })
      .then(payload => {
        if (payload.accepted) {
          this.setState({ loading: false });
          actions.openModal({ modalType: 'deleteAccount' });
        }
      })
      .catch(error => {
        this.setState({ loading: false });
        actions.openSnackBar({
          snackBarMessage: 'Account deletion failed! Incorrect Password.',
        });
      });
  };

  handleCancel = event => {
    this.props.history.push('/');
  };

  render() {
    const body = {
      margin: '5rem auto',
      padding: '0.625rem',
      textAlign: 'center',
    };

    const fieldStyle = {
      width: '16rem',
    };
    const submitButton = {
      margin: '0.625rem 0',
      textAlign: 'center',
    };
    const { loading, password, validForm } = this.state;
    console.log(loading, 'Loading');
    return (
      <div style={body}>
        <Paper elevation={5}>
          <h1 style={{ marginBottom: '30px' }}>Delete Account</h1>
          <div>
            <h4 style={{ fontWeight: 'normal' }}>
              Please enter your password to confirm deletion
            </h4>
          </div>
          <div>
            <form onSubmit={this.handleSubmit}>
              <div>
                <FormControl error={this.passwordErrorMessage !== ''}>
                  <PasswordField
                    name="password"
                    style={fieldStyle}
                    value={password}
                    onChange={this.handleChange}
                    errorText={this.passwordErrorMessage}
                  />
                  <FormHelperText error={this.passwordErrorMessage !== ''}>
                    {this.passwordErrorMessage}
                  </FormHelperText>
                </FormControl>
              </div>
              <div style={submitButton}>
                <DeleteButton
                  variant="contained"
                  onClick={this.handleSubmit}
                  disabled={!validForm}
                  style={{ marginRight: '10px' }}
                >
                  {loading ? (
                    <CircularProgress color="default" size={24} />
                  ) : (
                    <Translate text="Delete Account" />
                  )}
                </DeleteButton>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleCancel}
                >
                  <Translate text="Cancel" />
                </Button>
              </div>
            </form>
          </div>
        </Paper>
      </div>
    );
  }
}

DeleteAccount.propTypes = {
  history: PropTypes.object,
  email: PropTypes.string,
  accessToken: PropTypes.string,
  actions: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch),
  };
}

function mapStateToProps(store) {
  return {
    email: store.app.email,
    accessToken: store.app.accessToken,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DeleteAccount);

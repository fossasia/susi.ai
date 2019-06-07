import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// Components
import { PasswordField } from '../AuthStyles';
import CloseButton from '../../shared/CloseButton';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Translate from '../../Translate/Translate.react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import { checkPassword, checkAccountPermission } from '../../../apis';
import styled from 'styled-components';
import uiActions from '../../../redux/actions/ui';

const DeleteButton = styled(Button)`
  background-color: #ff0000;
  margin-right: 0.625rem;
  width: 10.375rem;
  color: white;
  :hover {
    background-color: #b20000;
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

  handleDialogClose = () => {
    const { actions } = this.props;
    this.setState({
      password: '',
      passwordError: false,
    });
    actions.closeModal();
  };

  handleSubmit = event => {
    this.setState({ loading: true });
    const { actions, email } = this.props;
    let password = this.state.password.trim();
    checkPassword({ login: email, password: password })
      .then(payload => {
        if (payload.accepted) {
          this.setState({ loading: false });
          actions.openModal({ modalType: 'confirmDeleteAccount' });
        }
      })
      .catch(error => {
        this.setState({ loading: false });
        actions.openSnackBar({
          snackBarMessage: 'Account deletion failed! Incorrect Password.',
        });
      });
  };

  render() {
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
      <React.Fragment>
        <DialogTitle>
          <Translate text="Delete Account" />
          <CloseButton onClick={this.handleDialogClose} />
        </DialogTitle>
        <DialogContent>
          <h4 style={{ fontWeight: 'normal' }}>
            Please enter your password to confirm deletion
          </h4>
          <form onSubmit={this.handleSubmit}>
            <div>
              <FormControl error={this.passwordErrorMessage !== ''}>
                <PasswordField
                  name="password"
                  style={fieldStyle}
                  value={password}
                  onChange={this.handleChange}
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
                style={{ marginRight: '10px', width: '' }}
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
                onClick={this.handleDialogClose}
              >
                <Translate text="Cancel" />
              </Button>
            </div>
          </form>
        </DialogContent>
      </React.Fragment>
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

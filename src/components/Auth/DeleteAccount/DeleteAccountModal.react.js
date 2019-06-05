import React from 'react';
import PropTypes from 'prop-types';
import CloseButton from '../../shared/CloseButton';
import _OutlinedInput from '@material-ui/core/OutlinedInput';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { connect } from 'react-redux';
import uiActions from '../../../redux/actions/ui';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { deleteAccount } from '../../../apis';

const OutlinedInput = styled(_OutlinedInput)`
  height: 2.8rem
  border-radius: 4;
  padding: 0px 0.625rem;
  width: 26rem;
  margin-top: 0px;
`;

const DeleteButton = styled(Button)`
  box-shadow: none;
  margin-top: 0.625rem;
  border: 1px solid rgba(27,31,35,0.2);
  border-radius: 0.25em;
  color: ${props => (props.confirmed ? '#fff' : 'rgba(203,36,49,0.4)')},
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
  white-space: nowrap;
  vertical-align: middle;
  background-color: ${props => (props.confirmed ? '#cb2431' : '#e5e5e5')} ;
`;

const ConfirmationHeadingWrapper = styled.div`
  background-color: #f6f8fa;
  color: #24292e;
  padding: 1rem;
  border: 1px solid rgba(27, 31, 35, 0.15);
  font-size: 0.875rem;
  text-align: left;
  font-weight: 600;
  line-height: 1.5;
`;

const WarningWrapper = styled.div`
  background-color: #fffbdd;
  color: #735c0f;
  padding: 1rem;
  border: 1px solid rgba(27, 31, 35, 0.15);
  font-size: 0.875rem;
  text-align: left;
  line-height: 1.5;
`;

const ContentWrapper = styled.div`
  background-color: #ffffff;
  color: #24292e;
  padding: 1rem;
  border: 1px solid rgba(27, 31, 35, 0.15);
  font-size: 0.857rem;
  text-align: left;
  font-weight: 400;
  line-height: 1.5;
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

class DeleteAccountModal extends React.Component {
  static propTypes = {
    actions: PropTypes.object,
    email: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.state = {
      confirmed: false,
      emailError: '',
      emailInput: '',
    };
  }

  handleClose = event => {
    this.props.actions.closeModal();
  };

  handleConfirm = event => {
    const { confirmed } = this.state;
    const { actions } = this.props;
    if (confirmed) {
      deleteAccount()
        .then(response => {
          deleteCookie('loggedIn', { domain: '.susi.ai', path: '/' });
          deleteCookie('emailId', { domain: '.susi.ai', path: '/' });
          actions.openSnackBar({
            snackBarMessage: 'Account deleted successfully',
          });
        })
        .catch(error => {
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
    const { emailInput, confirmed } = this.state;
    return (
      <div>
        <ConfirmationHeadingWrapper>
          Are you absolutely sure?
          <CloseButton onClick={this.handleClose} />
        </ConfirmationHeadingWrapper>
        <WarningWrapper>
          Unexpected bad things will happen if you don’t read this!
        </WarningWrapper>

        <ContentWrapper>
          <p style={{ marginTop: '0px', marginBottom: '10px' }}>
            This action <strong>cannot</strong> be undone. This will permanently
            remove the account corresponding to the email id{' '}
            <strong>{email}</strong>.
          </p>
          <p style={{ marginTop: '0px', marginBottom: '10px' }}>
            Please type in your email id to confirm.
          </p>
          <div style={{ textAlign: 'center' }}>
            <FormControl error={this.emailErrorMessage !== ''}>
              <OutlinedInput
                name="email"
                value={emailInput}
                placeholder="Email"
                onChange={this.handleEmailChange}
              />
              <FormHelperText error={this.emailErrorMessage !== ''}>
                {this.emailErrorMessage}
              </FormHelperText>
            </FormControl>
          </div>
          {/* Remove Device Button */}
          <div style={{ textAlign: 'center' }}>
            <DeleteButton
              onClick={this.handleConfirm}
              confirmed={confirmed}
              disabled={!confirmed}
            >
              I understand the consequences, Delete My Account.
            </DeleteButton>
          </div>
        </ContentWrapper>
      </div>
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
    actions: bindActionCreators(uiActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DeleteAccountModal);

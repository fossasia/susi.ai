import PropTypes from 'prop-types';
import { cookieDomain } from '../../utils/helperFunctions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import appActions from '../../redux/actions/app';
import uiActions from '../../redux/actions/ui';

// Clear cookie by setting expiry date
const deleteCookie = function(name, options = {}) {
  let cookieString = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  if (options.domain) {
    cookieString = `${cookieString}domain=${options.domain};`;
  }
  if (options.path) {
    cookieString = `${cookieString}path=${options.path};`;
  }
  document.cookie = cookieString;
};

const Logout = ({ actions, history }) => {
  deleteCookie('loggedIn', { domain: cookieDomain, path: '/' });
  deleteCookie('serverUrl', { domain: cookieDomain, path: '/' });
  deleteCookie('emailId', { domain: cookieDomain, path: '/' });
  deleteCookie('uuid', { domain: cookieDomain, path: '/' });

  if (history) {
    actions.logout().then(() => {
      actions.openSnackBar({
        snackBarMessage: 'You have logged out successfully',
      });
    });
    history.push('/');
  }
  return null;
};

Logout.propTypes = {
  actions: PropTypes.object,
  history: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...appActions, ...uiActions }, dispatch),
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(Logout);

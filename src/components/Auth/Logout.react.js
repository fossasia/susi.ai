import PropTypes from 'prop-types';
import { isProduction } from '../../utils/helperFunctions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../redux/actions/app';

const cookieDomain = isProduction() ? '.susi.ai' : '';

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

const Logout = props => {
  deleteCookie('loggedIn', { domain: cookieDomain, path: '/' });
  deleteCookie('serverUrl', { domain: cookieDomain, path: '/' });
  deleteCookie('emailId', { domain: cookieDomain, path: '/' });
  deleteCookie('username', { domain: cookieDomain, path: '/' });
  deleteCookie('uuid', { domain: cookieDomain, path: '/' });

  if (props.history) {
    props.actions.logout().then(() => {
      props.openSnackBar({
        snackBarMessage: 'You have logged out successfully',
      });
    });
    props.history.push('/');
  }
  return null;
};

Logout.propTypes = {
  openSnackBar: PropTypes.func,
  history: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(Logout);

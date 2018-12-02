import PropTypes from 'prop-types';
import { isProduction } from '../../utils/helperFunctions';

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
  // Clear cookies
  deleteCookie('loggedIn', { domain: cookieDomain, path: '/' });
  deleteCookie('serverUrl', { domain: cookieDomain, path: '/' });
  deleteCookie('emailId', { domain: cookieDomain, path: '/' });
  deleteCookie('username', { domain: cookieDomain, path: '/' });
  deleteCookie('showAdmin', { domain: cookieDomain, path: '/' });
  deleteCookie('uuid', { domain: cookieDomain, path: '/' });

  // Redirect to landing page
  if (props.history) {
    props.history.push('/');
  }
  window.location.reload();
  return null;
};

Logout.propTypes = {
  history: PropTypes.object,
};

export default Logout;

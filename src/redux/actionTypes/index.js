import _ from 'lodash';

import messageActionTypes from './message';
import settingsActionTypes from './settings';
import threadActionTypes from './thread';
import unreadThreadActionTypes from './unreadThread';
import userIdentityActionTypes from './userIdentity';

export default _.mapKeys([
  'APP_GET_API_KEYS',
  ...messageActionTypes,
  ...settingsActionTypes,
  ...threadActionTypes,
  ...unreadThreadActionTypes,
  ...userIdentityActionTypes,
]);

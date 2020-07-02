/* eslint-disable camelcase */
import customAvatar_0 from '../../public/customAvatars/0.png';
import customAvatar_1 from '../../public/customAvatars/1.png';
import customAvatar_2 from '../../public/customAvatars/2.png';
import customAvatar_3 from '../../public/customAvatars/3.png';
import customAvatar_4 from '../../public/customAvatars/4.png';
import customAvatar_5 from '../../public/customAvatars/5.png';
import customAvatar_6 from '../../public/customAvatars/6.png';
import customAvatar_7 from '../../public/customAvatars/7.png';
import customAvatar_8 from '../../public/customAvatars/8.png';
import customAvatar_9 from '../../public/customAvatars/9.png';
import defaultAvatar from '../../public/defaultAvatar.png';

const host = window.location.protocol + '//' + window.location.host;

const avatars = [
  {
    id: 0,
    url: host + customAvatar_0,
  },
  {
    id: 1,
    url: host + customAvatar_1,
  },
  {
    id: 2,
    url: host + customAvatar_2,
    // source: https://openclipart.org/detail/296942/suit-man-colour
  },
  {
    id: 3,
    url: host + customAvatar_3,
    // source: https://openclipart.org/detail/297165/face-woman
  },
  {
    id: 4,
    url: host + customAvatar_4,
    // source: https://openclipart.org/detail/277089/female-avatar-5
  },
  {
    id: 5,
    url: host + customAvatar_5,
    // source: https://openclipart.org/detail/276775/female-avatar-doctor
  },
  {
    id: 6,
    url: host + customAvatar_6,
    // source: https://openclipart.org/detail/261881/cartoon-man-avatar-2
  },
  {
    id: 7,
    url: host + customAvatar_7,
    // source: https://openclipart.org/detail/263352/the-african-martin
  },
  {
    id: 8,
    url: host + customAvatar_8,
    // source: https://openclipart.org/detail/264138/professional-man-avatar
  },
  {
    id: 9,
    url: host + customAvatar_9,
    // source: https://openclipart.org/detail/297167/face-man
  },
  {
    id: 10,
    url: host + defaultAvatar,
  },
];
export default avatars;

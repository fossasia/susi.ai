import Chat from '@material-ui/icons/Chat';
import Dashboard from '@material-ui/icons/Dashboard';

const LINKS = accessToken => {
  return [
    {
      label: 'Chat',
      url: '/chat',
      Icon: Chat,
    },
    {
      label: 'Skills',
      url: '/',
      Icon: Dashboard,
    },
  ];
};

export default LINKS;

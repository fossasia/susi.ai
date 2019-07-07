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
      sublinks: accessToken
        ? [
            { label: 'Dashboard', url: '/skills/dashboard' },
            { label: 'Browse Skills', url: '/' },
            { label: 'Create Skill', url: '/skills/skillCreator' },
            { label: 'Create Skill Bot', url: '/skills/botbuilder' },
          ]
        : [{ label: 'Browse', url: '/' }],
    },
  ];
};

export default LINKS;

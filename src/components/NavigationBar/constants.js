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
            { label: 'Browse Skills', url: '/' },
            { label: 'Create Skill', url: '/myskills' },
            { label: 'Create Skill Bot', url: '/botbuilder' },
          ]
        : [{ label: 'Browse Skills', url: '/' }],
    },
  ];
};

export default LINKS;

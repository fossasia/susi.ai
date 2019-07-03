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
      url: '/skills',
      Icon: Dashboard,
      sublinks: accessToken
        ? [
            { label: 'Dashboard', url: '/skills/dashboard' },
            { label: 'Browse Skills', url: '/skills' },
            { label: 'Create Skill', url: '/skills/skillWizard' },
            { label: 'Create Skill Bot', url: '/skills/botbuilder/botwizard' },
          ]
        : [{ label: 'Browse', url: '/skills' }],
    },
  ];
};

export default LINKS;

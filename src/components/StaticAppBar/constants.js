import Info from '@material-ui/icons/Info';
import Chat from '@material-ui/icons/Chat';
import Dashboard from '@material-ui/icons/Dashboard';
import ListIcon from '@material-ui/icons/List';

const LINKS = (accessToken, isAdmin) => {
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
            { label: 'Browse', url: '/skills' },
            { label: 'Botbuilder', url: '/skills/botbuilder' },
            { label: 'Create Skill', url: '/skills/skillCreator' },
            { label: 'Create Bot', url: '/skills/botbuilder/botwizard' },
            { label: 'Dashboard', url: '/skills/dashboard' },
          ]
        : [{ label: 'Browse', url: '/skills' }],
    },
    {
      label: 'About',
      url: '/',
      Icon: Info,
      sublinks: [
        { label: 'Overview', url: '/' },
        { label: 'Devices', url: '/about/devices' },
        { label: 'Blog', url: '/about/blog' },
        { label: 'Team', url: '/about/team' },
        { label: 'Support', url: '/about/support' },
      ],
    },
    isAdmin
      ? {
          label: 'Admin',
          url: '/admin',
          Icon: ListIcon,
          sublinks: [
            { label: 'Admin', url: '/admin' },
            { label: 'Users', url: '/admin/users' },
            { label: 'Skills', url: '/admin/skills' },
            { label: 'System Settings', url: '/admin/settings' },
            { label: 'Logs', url: '/admin/logs' },
          ],
        }
      : {},
  ];
};

export default LINKS;

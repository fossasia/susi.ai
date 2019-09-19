import tableStyles from '../../shared/table';

const COULMNS = [
  {
    title: 'S.No.',
    field: 'serialNum',
    sorter: false,
    cellStyle: {
      ...tableStyles,
    },
  },
  {
    title: 'Email ID',
    field: 'email',
    sorter: false,
    cellStyle: {
      ...tableStyles,
    },
    key: 'email',
  },
  {
    title: 'User Name',
    field: 'userName',
    cellStyle: {
      ...tableStyles,
    },
  },
  {
    title: 'Activation Status',
    field: 'confirmed',
    sorter: false,
    cellStyle: {
      ...tableStyles,
    },
  },
  {
    title: 'Signup',
    field: 'signup',
    cellStyle: {
      ...tableStyles,
    },
    customSort: (a, b) =>
      new Date(a.signup === '-' ? 'Thu Jan 01 1970' : a.signup) -
      new Date(b.signup === '-' ? 'Thu Jan 01 1970' : b.signup),
  },
  {
    title: 'Last Login',
    field: 'lastLogin',
    cellStyle: {
      ...tableStyles,
    },
    customSort: (a, b) =>
      new Date(a.lastLogin === '-' ? 'Thu Jan 01 1970' : a.lastLogin) -
      new Date(b.lastLogin === '-' ? 'Thu Jan 01 1970' : b.lastLogin),
  },
  {
    title: 'IP of Last Login',
    field: 'ipLastLogin',
    cellStyle: {
      ...tableStyles,
    },
  },
  {
    title: 'User Role',
    field: 'userRole',
    sorter: false,
    cellStyle: {
      ...tableStyles,
    },
  },
];

export default COULMNS;

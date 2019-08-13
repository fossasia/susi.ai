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
  },
  {
    title: 'Last Login',
    field: 'lastLogin',
    cellStyle: {
      ...tableStyles,
    },
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

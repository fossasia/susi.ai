const COULMNS = [
  {
    title: 'S.No.',
    field: 'serialNum',
    sorter: false,
    cellStyle: {
      width: '2%',
    },
  },
  {
    title: 'Email ID',
    field: 'email',
    sorter: false,
    cellStyle: {
      width: '10%',
    },
    key: 'email',
  },
  {
    title: 'User Name',
    field: 'userName',
    cellStyle: {
      width: '5%',
    },
  },
  {
    title: 'Activation Status',
    field: 'confirmed',
    sorter: false,
    cellStyle: {
      width: '10%',
    },
  },
  {
    title: 'Signup',
    field: 'signup',
    cellStyle: {
      width: '5%',
    },
  },
  {
    title: 'Last Login',
    field: 'lastLogin',
    cellStyle: {
      width: '5%',
    },
  },
  {
    title: 'IP of Last Login',
    field: 'ipLastLogin',
    cellStyle: {
      width: '5%',
    },
  },
  {
    title: 'User Role',
    field: 'userRole',
    sorter: false,
    cellStyle: {
      width: '7%',
    },
  },
];

export default COULMNS;

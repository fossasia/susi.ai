export const DEVICE = [
  {
    title: 'Device Name',
    field: 'deviceName',
    cellStyle: {
      width: '10%',
    },
  },
  {
    title: 'Mac Id',
    field: 'macId',
    cellStyle: {
      width: '10%',
    },
  },
  {
    title: 'Room',
    field: 'room',
    cellStyle: {
      width: '10%',
    },
  },
  {
    title: 'Email',
    field: 'email',
    cellStyle: {
      width: '10%',
    },
  },
  {
    title: 'Date Added',
    field: 'dateAdded',
    cellStyle: {
      width: '10%',
    },
    customSort: (a, b) =>
      new Date(a.dateAdded === '-' ? 'Thu Jan 01 1970' : a.dateAdded) -
      new Date(b.dateAdded === '-' ? 'Thu Jan 01 1970' : b.dateAdded),
  },
  {
    title: 'Last Active',
    field: 'lastActive',
    cellStyle: {
      width: '10%',
    },
    customSort: (a, b) =>
      new Date(a.lastActive === '-' ? 'Thu Jan 01 1970' : a.lastActive) -
      new Date(b.lastActive === '-' ? 'Thu Jan 01 1970' : b.lastActive),
  },
  {
    title: 'Last Login IP',
    field: 'lastLoginIP',
    cellStyle: {
      width: '10%',
    },
  },
  {
    title: 'Location',
    field: 'location',
    cellStyle: {
      width: '10%',
    },
  },
];

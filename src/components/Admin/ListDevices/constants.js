import { singleLineStyle } from '../../shared/table';

export const DEVICE = [
  {
    title: 'Device Name',
    field: 'deviceName',
    cellStyle: {
      ...singleLineStyle,
    },
  },
  {
    title: 'Mac Id',
    field: 'macId',
    cellStyle: {
      ...singleLineStyle,
    },
  },
  {
    title: 'Room',
    field: 'room',
    cellStyle: {
      ...singleLineStyle,
    },
  },
  {
    title: 'Email',
    field: 'email',
    cellStyle: {
      ...singleLineStyle,
    },
  },
  {
    title: 'Date Added',
    field: 'dateAdded',
    cellStyle: {
      ...singleLineStyle,
    },
    customSort: (a, b) =>
      new Date(a.dateAdded === '-' ? 'Thu Jan 01 1970' : a.dateAdded) -
      new Date(b.dateAdded === '-' ? 'Thu Jan 01 1970' : b.dateAdded),
  },
  {
    title: 'Last Active',
    field: 'lastActive',
    cellStyle: {
      ...singleLineStyle,
    },
    customSort: (a, b) =>
      new Date(a.lastActive === '-' ? 'Thu Jan 01 1970' : a.lastActive) -
      new Date(b.lastActive === '-' ? 'Thu Jan 01 1970' : b.lastActive),
  },
  {
    title: 'Last Login IP',
    field: 'lastLoginIP',
    cellStyle: {
      ...singleLineStyle,
    },
  },
  {
    title: 'Location',
    field: 'location',
    cellStyle: {
      ...singleLineStyle,
    },
  },
];

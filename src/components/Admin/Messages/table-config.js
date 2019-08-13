import tableStyles from '../../shared/table';

const TABLE_CONFIG = [
  {
    title: 'Recipients',
    field: 'recipients',
    cellStyle: {
      ...tableStyles,
    },
  },
  {
    title: 'Trigger',
    field: 'trigger',
    cellStyle: {
      ...tableStyles,
    },
  },
  {
    title: 'On Screen Message',
    field: 'userMessage',
    cellStyle: {
      ...tableStyles,
    },
  },
  {
    title: 'Email Subject',
    field: 'subject',
    cellStyle: {
      ...tableStyles,
    },
  },
  {
    title: 'Email Text',
    field: 'emailText',
    cellStyle: {
      ...tableStyles,
    },
  },
  {
    title: 'Options',
    field: 'options',
    cellStyle: {
      ...tableStyles,
    },
  },
];

export default TABLE_CONFIG;

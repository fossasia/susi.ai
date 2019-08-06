import tableStyles from '../../../shared/table';

const SLIDESHOW = [
  {
    title: 'Link to',
    field: 'redirectLink',
    cellStyle: {
      width: '25%',
      ...tableStyles,
    },
  },
  {
    title: 'Information',
    field: 'info',
    cellStyle: {
      width: '30%',
      ...tableStyles,
    },
  },
  {
    title: 'Image Path',
    field: 'image_name',
    cellStyle: {
      width: '30%',
      ...tableStyles,
    },
  },
];

export default SLIDESHOW;

export const getActiveColumn = groups => {
  return [
    {
      title: 'Name',
      field: 'skillName',
      cellStyle: {
        width: '20%',
      },
      filtering: false,
    },
    {
      title: 'Group',
      field: 'group',
      lookup: groups,
      cellStyle: {
        width: '10%',
      },
    },
    {
      title: 'Language',
      field: 'language',
      cellStyle: {
        width: '10%',
      },
      filtering: false,
    },
    {
      title: 'Type',
      field: 'type',
      lookup: { private: 'Private', public: 'Public' },
      cellStyle: {
        width: '10%',
      },
    },
    {
      title: 'Author',
      field: 'author',
      cellStyle: {
        width: '10%',
      },
      filtering: false,
    },
    {
      title: 'Review Status',
      field: 'reviewed',
      lookup: { Approved: 'Reviewed', 'Not Reviewed': 'Not Reviewed' },
      cellStyle: {
        width: '15%',
      },
    },
    {
      title: 'Edit Status',
      field: 'editable',
      lookup: { Editable: 'Editable', 'Not Editable': 'Not Editable' },
      cellStyle: {
        width: '15%',
      },
    },
  ];
};

export const getDeletedColumn = groups => {
  return [
    {
      title: 'Name',
      field: 'skillName',
      cellStyle: {
        width: '30%',
      },
      filtering: false,
    },
    {
      title: 'Model',
      field: 'model',
      cellStyle: {
        width: '15%',
      },
      filtering: false,
    },
    {
      title: 'Group',
      field: 'group',
      cellStyle: {
        width: '25%',
      },
      lookup: groups,
    },
    {
      title: 'Language',
      field: 'language',
      filtering: false,
    },
  ];
};

export const REPORT = [
  {
    title: 'Name',
    field: 'skillName',
    cellStyle: {
      width: '25%',
    },
  },
  {
    title: 'Language',
    field: 'language',
    cellStyle: {
      width: '25%',
    },
  },
  {
    title: 'Model',
    field: 'model',
    cellStyle: {
      width: '20%',
    },
  },
  {
    title: 'Group',
    field: 'group',
    cellStyle: {
      width: '25%',
    },
  },
];

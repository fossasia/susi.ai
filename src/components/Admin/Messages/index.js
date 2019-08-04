import React from 'react';
import MaterialTable from 'material-table';
import TABLE_CONFIG from './table-config';
import MESSAGE_CONFIG from './message-config';

const Messages = () => {
  return (
    <MaterialTable
      options={{
        actionsColumnIndex: -1,
        pageSize: 10,
      }}
      columns={TABLE_CONFIG}
      data={MESSAGE_CONFIG}
      title=""
      style={{
        padding: '1rem',
        margin: '2rem',
      }}
    />
  );
};

export default Messages;

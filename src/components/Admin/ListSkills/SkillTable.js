/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import { getColumnConfig } from './constants';
import { ActionSpan, ActionSeparator } from '../../shared/TableActionStyles';

const SkillTable = props => {
  const { data, groups, loading, handleOpen, handleDelete } = props;
  return (
    <MaterialTable
      isLoading={loading}
      options={{
        filtering: true,
        actionsColumnIndex: -1,
        pageSize: 10,
      }}
      columns={getColumnConfig(groups)}
      data={data}
      title=""
      style={{
        padding: '1rem',
      }}
      actions={[
        rowData => ({
          onEdit: (event, rowData) => {
            handleOpen(
              rowData.skillName,
              rowData.model,
              rowData.group,
              rowData.language,
              rowData.reviewStatus,
              rowData.editStatus,
              rowData.staffPickStatus,
              rowData.systemSkillStatus,
              rowData.skillTag,
            );
          },
          onDelete: (event, rowData) => {
            handleDelete(
              rowData.skillName,
              rowData.model,
              rowData.group,
              rowData.language,
            );
          },
        }),
      ]}
      components={{
        // eslint-disable-next-line react/display-name
        Action: ({ action }) => (
          <React.Fragment>
            <ActionSpan onClick={event => action.onEdit(event, props.data)}>
              Edit
            </ActionSpan>
            <ActionSeparator> | </ActionSeparator>
            <ActionSpan onClick={event => action.onDelete(event, props.data)}>
              Delete
            </ActionSpan>
          </React.Fragment>
        ),
      }}
    />
  );
};

SkillTable.propTypes = {
  data: PropTypes.array,
  groups: PropTypes.object,
  loading: PropTypes.bool,
  handleOpen: PropTypes.func,
  handleDelete: PropTypes.func,
  actions: PropTypes.object,
};

export default SkillTable;

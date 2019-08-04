import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import { getColumnConfig } from './constants';
import { ActionSpan, ActionSeparator } from '../../shared/TableActionStyles';

class SkillTable extends Component {
  render() {
    const { data, groups, loading, handleOpen, handleDelete } = this.props;
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
          {
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
          },
        ]}
        components={{
          Action: props => (
            <React.Fragment>
              <ActionSpan
                onClick={event => props.action.onEdit(event, props.data)}
              >
                Edit
              </ActionSpan>
              <ActionSeparator> | </ActionSeparator>
              <ActionSpan
                onClick={event => props.action.onDelete(event, props.data)}
              >
                Delete
              </ActionSpan>
            </React.Fragment>
          ),
        }}
      />
    );
  }
}

SkillTable.propTypes = {
  data: PropTypes.array,
  groups: PropTypes.object,
  loading: PropTypes.bool,
  handleOpen: PropTypes.func,
  handleDelete: PropTypes.func,
  actions: PropTypes.object,
};

export default SkillTable;

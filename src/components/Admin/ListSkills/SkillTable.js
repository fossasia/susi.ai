/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import { getColumnConfig } from './constants';
import { ActionSpan, ActionSeparator } from '../../shared/TableActionStyles';

import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

tableIcons.Add.displayName = 'Add';
tableIcons.Check.displayName = 'Check';
tableIcons.Clear.displayName = 'Clear';
tableIcons.Delete.displayName = 'Delete';
tableIcons.DetailPanel.displayName = 'DetailPanel';
tableIcons.Edit.displayName = 'Edit';
tableIcons.Export.displayName = 'Export';
tableIcons.Filter.displayName = 'Filter';
tableIcons.FirstPage.displayName = 'FirstPage';
tableIcons.LastPage.displayName = 'LastPage';
tableIcons.NextPage.displayName = 'NextPage';
tableIcons.PreviousPage.displayName = 'PreviousPage';
tableIcons.ResetSearch.displayName = 'ResetSearch';
tableIcons.Search.displayName = 'Search';
tableIcons.SortArrow.displayName = 'SortArrow';
tableIcons.ThirdStateCheck.displayName = 'ThirdStateCheck';
tableIcons.ViewColumn.displayName = 'ViewColumn';

const SkillTable = (props) => {
  const { data, groups, loading, handleOpen, handleDelete } = props;
  return (
    <MaterialTable
      isLoading={loading}
      options={{
        filtering: true,
        actionsColumnIndex: -1,
        pageSize: 25,
        pageSizeOptions: [25, 50, 100, 200, 500],
      }}
      icons={tableIcons}
      columns={getColumnConfig(groups)}
      data={data}
      title=""
      style={{
        padding: '1rem',
      }}
      actions={[
        (rowData) => ({
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
            <ActionSpan
              onClick={(event) => {
                action.action(props.data).onEdit(event, props.data);
              }}
            >
              Edit
            </ActionSpan>
            <ActionSeparator> | </ActionSeparator>
            <ActionSpan
              onClick={(event) =>
                action.action(props.data).onDelete(event, props.data)
              }
            >
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

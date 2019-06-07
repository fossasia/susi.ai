import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';
import TrashIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';

const styles = {
  tableViewStyle: {
    width: '120px',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
  },
  tableModifyStyle: {
    width: '40px',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    paddingLeft: '0px',
  },
};

const TableComplex = props => {
  const { tableViewStyle, tableModifyStyle } = styles;
  return (
    <div>
      <Table
        height={'inherit'}
        selectable={false}
        multiSelectable={false}
        fixedHeader={false}
        style={{ width: 'auto', tableLayout: 'auto' }}
      >
        {/* Table header columns for Table View */}
        <TableHead
          displaySelectAll={false}
          adjustForCheckbox={false}
          enableSelectAll={false}
        >
          <TableRow>
            <TableCell style={tableViewStyle}>Device Name</TableCell>
            <TableCell style={tableViewStyle}>Mac Address</TableCell>
            <TableCell style={tableViewStyle}>Room</TableCell>
            <TableCell style={tableViewStyle}>Geolocation</TableCell>
            {/* Table header columns for edit and delete icon */}
            <TableCell style={tableModifyStyle} />
            <TableCell style={tableModifyStyle} />
          </TableRow>
        </TableHead>
        <TableBody
          displayRowCheckbox={false}
          deselectOnClickaway={true}
          showRowHover={false}
          stripedRows={false}
        >
          {props.tableData &&
            props.tableData.map((row, index) => (
              <TableRow key={index}>
                <TableCell
                  style={{
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                  }}
                >
                  {/*
                  editIdx denotes the row number which is being edited
                  On changing value of device name, handleChange() function is called
                  This function shows the updated value of device name in the textfield
                */}
                  {props.editIdx === index ? (
                    <TextField
                      name={index.toString()}
                      onChange={e => props.handleChange(e, 'devicename', index)}
                      value={row.devicename}
                    />
                  ) : (
                    row.devicename
                  )}
                </TableCell>
                <TableCell
                  style={{
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                    paddingLeft: '0px',
                    paddingRight: '0px',
                  }}
                >
                  {row.macid}
                </TableCell>
                <TableCell
                  style={{
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                  }}
                >
                  {/*
                  On changing of the value of room, handleChange() function is called
                  This function shows the updated value of room in the textfield
                */}
                  {props.editIdx === index ? (
                    <TextField
                      name={index.toString()}
                      onChange={e => props.handleChange(e, 'room', index)}
                      value={row.room}
                    />
                  ) : (
                    row.room
                  )}
                </TableCell>
                <TableCell
                  style={{
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                  }}
                >
                  {/* If location info is not available, display a message */}
                  {!(
                    row.latitude === 'Latitude not available.' ||
                    row.longitude === 'Longitude not available.'
                  )
                    ? `${row.latitude}, ${row.longitude}`
                    : 'Location not available'}
                </TableCell>
                <TableCell style={tableModifyStyle}>
                  {/*
                  Decide between edit icon and check icon for each row,
                  depending on the value of editIdx.
                */}
                  {props.editIdx === index ? (
                    <CheckIcon
                      onClick={() => props.stopEditing(index)}
                      style={{ cursor: 'pointer' }}
                    />
                  ) : (
                    <EditIcon
                      onClick={() => props.startEditing(index)}
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                </TableCell>
                <TableCell style={tableModifyStyle}>
                  {/*
                  Handle opening of delete confirmation dialog on clicking delete icon
                */}
                  <TrashIcon
                    onClick={() => props.handleRemoveConfirmation(index)}
                    style={{ cursor: 'pointer' }}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

TableComplex.propTypes = {
  tableData: PropTypes.array,
  startEditing: PropTypes.func,
  stopEditing: PropTypes.func,
  handleChange: PropTypes.func,
  handleRemove: PropTypes.func,
  handleRemoveConfirmation: PropTypes.func,
  editIdx: PropTypes.number,
};

export default TableComplex;

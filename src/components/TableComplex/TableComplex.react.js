import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import EditIcon from 'material-ui/svg-icons/image/edit';
import TrashIcon from 'material-ui/svg-icons/action/delete';
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import TextField from 'material-ui/TextField';

// eslint-disable-next-line
export default class TableComplex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stripedRows: false,
      showRowHover: false,
      selectable: false,
      multiSelectable: false,
      enableSelectAll: false,
      deselectOnClickaway: true,
      showCheckboxes: false,
      height: 'inherit',
    };
  }

  render() {
    return (
      <div>
        <Table
          height={this.state.height}
          selectable={this.state.selectable}
          multiSelectable={this.state.multiSelectable}
          fixedHeader={false}
          style={{ width: 'auto', tableLayout: 'auto' }}
        >
          {/* Table header columns for Table View */}
          <TableHeader
            displaySelectAll={this.state.showCheckboxes}
            adjustForCheckbox={this.state.showCheckboxes}
            enableSelectAll={this.state.enableSelectAll}
          >
            <TableRow>
              <TableHeaderColumn
                style={{
                  width: '120px',
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                }}
              >
                Device Name
              </TableHeaderColumn>
              <TableHeaderColumn
                style={{
                  width: '120px',
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                }}
              >
                Mac Address
              </TableHeaderColumn>
              <TableHeaderColumn
                style={{
                  width: '120px',
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                }}
              >
                Room
              </TableHeaderColumn>
              <TableHeaderColumn
                style={{
                  width: '120px',
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                }}
              >
                Geolocation
              </TableHeaderColumn>
              {/* Table header columns for edit and delete icon */}
              <TableHeaderColumn
                style={{
                  width: '40px',
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                  paddingLeft: '0px',
                }}
              />
              <TableHeaderColumn
                style={{
                  width: '40px',
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                  paddingLeft: '0px',
                }}
              />
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
          >
            {/* eslint-disable-next-line */}
            {this.props.tableData &&
              this.props.tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableRowColumn
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
                    {this.props.editIdx === index ? (
                      <TextField
                        name={index.toString()}
                        onChange={e =>
                          this.props.handleChange(e, 'devicename', index)
                        }
                        value={row.devicename}
                        style={{ fontSize: '13px', width: '80px' }}
                      />
                    ) : (
                      row.devicename
                    )}
                  </TableRowColumn>
                  <TableRowColumn
                    style={{
                      whiteSpace: 'normal',
                      wordWrap: 'break-word',
                      paddingLeft: '0px',
                      paddingRight: '0px',
                    }}
                  >
                    {row.macid}
                  </TableRowColumn>
                  <TableRowColumn
                    style={{
                      whiteSpace: 'normal',
                      wordWrap: 'break-word',
                    }}
                  >
                    {/*
                    On changing of the value of room, handleChange() function is called
                    This function shows the updated value of room in the textfield
                  */}
                    {this.props.editIdx === index ? (
                      <TextField
                        name={index.toString()}
                        onChange={e =>
                          this.props.handleChange(e, 'room', index)
                        }
                        value={row.room}
                        style={{ fontSize: '13px', width: '80px' }}
                      />
                    ) : (
                      row.room
                    )}
                  </TableRowColumn>
                  <TableRowColumn
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
                      ? row.latitude + ', ' + row.longitude
                      : 'Location not available'}
                  </TableRowColumn>
                  <TableRowColumn
                    style={{
                      width: '40px',
                      whiteSpace: 'normal',
                      wordWrap: 'break-word',
                      paddingLeft: '0px',
                    }}
                  >
                    {/*
                    Decide between edit icon and check icon for each row,
                    depending on the value of editIdx.
                  */}
                    {this.props.editIdx === index ? (
                      <CheckIcon
                        onClick={() => this.props.stopEditing(index)}
                        style={{ cursor: 'pointer' }}
                      />
                    ) : (
                      <EditIcon
                        onClick={() => this.props.startEditing(index)}
                        style={{ cursor: 'pointer' }}
                      />
                    )}
                  </TableRowColumn>
                  <TableRowColumn
                    style={{
                      width: '40px',
                      whiteSpace: 'normal',
                      wordWrap: 'break-word',
                      paddingLeft: '0px',
                    }}
                  >
                    {/*
                    Handle opening of delete confirmation dialog on clicking delete icon
                  */}
                    <TrashIcon
                      onClick={() => this.props.handleRemoveConfirmation(index)}
                      style={{ cursor: 'pointer' }}
                    />
                  </TableRowColumn>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

TableComplex.propTypes = {
  tableData: PropTypes.array,
  startEditing: PropTypes.func,
  stopEditing: PropTypes.func,
  handleChange: PropTypes.func,
  handleRemove: PropTypes.func,
  handleRemoveConfirmation: PropTypes.func,
  editIdx: PropTypes.number,
};

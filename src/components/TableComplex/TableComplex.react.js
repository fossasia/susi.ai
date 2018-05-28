import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

// eslint-disable-next-line
export default class TableComplex extends Component {

  constructor(props) {
    super(props)
    this.state = {
      stripedRows: false,
      showRowHover: false,
      selectable: false,
      multiSelectable: false,
      enableSelectAll: false,
      deselectOnClickaway: true,
      showCheckboxes: false,
      height: 'inherit',
    }
  }

  render() {
    return (
      <div>
        <Table
          height={this.state.height}
          selectable={this.state.selectable}
          multiSelectable={this.state.multiSelectable}
        >
          <TableHeader
            displaySelectAll={this.state.showCheckboxes}
            adjustForCheckbox={this.state.showCheckboxes}
            enableSelectAll={this.state.enableSelectAll}
          >
            <TableRow>
              <TableHeaderColumn style={{width:'50px'}}>S. No.</TableHeaderColumn>
              <TableHeaderColumn style={{width:'120px'}}>Mac Address</TableHeaderColumn>
              <TableHeaderColumn style={{width:'120px'}}>Name of Device</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
          >

          {/* eslint-disable-next-line */}
            {this.props.tableData.map( (row, index) => (
              <TableRow key={index}>
                <TableRowColumn style={{width:'50px'}}>{index+1}</TableRowColumn>
                <TableRowColumn style={{width:'120px'}}>{row.macid}</TableRowColumn>
                <TableRowColumn style={{width:'120px'}}>{row.devicename}</TableRowColumn>
              </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

TableComplex.propTypes={
  tableData:PropTypes.array
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { fetchApiKeys } from '../../../apis/index';

class SystemSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apiKeys: [],
      loading: true,
    };
  }

  componentDidMount() {
    fetchApiKeys()
      .then(payload => {
        let apiKeys = [];
        let i = 1;
        let keys = Object.keys(payload.keys);
        keys.forEach(j => {
          const apiKey = {
            serialNum: i,
            keyName: j,
            value: payload.keys[j],
          };
          ++i;
          apiKeys.push(apiKey);
        });
        this.setState({
          apiKeys: apiKeys,
          loading: false,
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="tabs">
        <h3 className="h3">Config Keys</h3>
        <Table style={{ maxWidth: '40rem' }}>
          <TableHead>
            <TableRow>
              <TableCell>S.No.</TableCell>
              <TableCell align="right">Key Name</TableCell>
              <TableCell align="right">Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.apiKeys.map(row => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.serialNum}
                </TableCell>
                <TableCell align="right">{row.keyName}</TableCell>
                <TableCell align="right">{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

SystemSettings.propTypes = {
  history: PropTypes.object,
};

export default SystemSettings;

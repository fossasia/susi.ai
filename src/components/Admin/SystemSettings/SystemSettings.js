import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { fetchApiKeys, createApiKey, deleteApiKey } from '../../../apis/index';

class SystemSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apiKeys: [],
      loading: true,
      keyName: '',
      keyValue: '',
      showUpdateDialog: false,
      showDeleteDialog: false,
      showCreateDialog: false,
    };
  }

  componentDidMount() {
    this.fetchApiKeys();
  }

  fetchApiKeys = () => {
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
  };

  confirmCreate = () => {
    const { keyName, keyValue } = this.state;
    createApiKey({ keyName, keyValue })
      .then(this.fetchApiKeys)
      .catch(error => {
        console.log(error);
      });
    this.handleClose();
  };

  confirmDelete = () => {
    const { keyName } = this.state;
    deleteApiKey({ keyName })
      .then(this.fetchApiKeys)
      .catch(error => {
        console.log(error);
      });
    this.handleClose();
  };

  handleUpdate = row => {
    this.setState({
      keyName: row.keyName,
      keyValue: row.value,
      showUpdateDialog: true,
    });
  };

  handleDelete = row => {
    this.setState({
      keyName: row.keyName,
      showDeleteDialog: true,
    });
  };

  handleCreate = () => {
    this.setState({
      showCreateDialog: true,
    });
  };

  handleClose = () => {
    this.setState({
      showUpdateDialog: false,
      showDeleteDialog: false,
      showCreateDialog: false,
    });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    const {
      keyName,
      keyValue,
      showCreateDialog,
      showUpdateDialog,
      showDeleteDialog,
    } = this.state;
    return (
      <div className="tabs">
        <h3 className="h3">Config Keys</h3>
        <Table style={{ maxWidth: '40rem' }}>
          <TableHead>
            <TableRow>
              <TableCell>S.No.</TableCell>
              <TableCell align="right">Key Name</TableCell>
              <TableCell align="right">Value</TableCell>
              <TableCell align="right">Action</TableCell>
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
                <TableCell align="right">
                  <span
                    style={{ cursor: 'pointer', color: '#49A9EE' }}
                    onClick={() => {
                      this.handleUpdate(row);
                    }}
                  >
                    Edit
                  </span>
                  <span style={{ marginLeft: '5px', marginRight: '5px' }}>
                    {' '}
                    |{' '}
                  </span>
                  <span
                    style={{ cursor: 'pointer', color: '#49A9EE' }}
                    onClick={() => {
                      this.handleDelete(row);
                    }}
                  >
                    Delete
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleCreate}
          style={{ marginTop: '20px' }}
        >
          Add Config Key
        </Button>
        <Dialog
          title={showCreateDialog ? 'Create Key' : 'Update Key'}
          open={showCreateDialog || showUpdateDialog}
          maxWidth={'sm'}
          fullWidth={true}
          onClose={this.handleClose}
        >
          <DialogTitle>
            {showCreateDialog ? 'Create Key' : 'Update Key'}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Key Name"
              placeholder="Key Name"
              margin="normal"
              value={keyName}
              fullWidth={true}
              name="keyName"
              onChange={this.handleChange}
            />
            <TextField
              label="Key Value"
              placeholder="Key Value"
              margin="normal"
              name="keyValue"
              value={keyValue}
              fullWidth={true}
              onChange={this.handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button
              key={1}
              color="primary"
              onClick={
                showCreateDialog ? this.confirmCreate : this.confirmUpdate
              }
            >
              {showCreateDialog ? 'Create' : 'Update'}
            </Button>
            <Button key={2} color="primary" onClick={this.handleClose}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          title="Delete Key"
          open={showDeleteDialog}
          maxWidth={'sm'}
          fullWidth={true}
          onClose={this.handleClose}
        >
          <DialogTitle>Delete Key</DialogTitle>
          <DialogContent>
            Are you sure you want to delete{' '}
            <span className="skillName">{keyName}</span>?
          </DialogContent>
          <DialogActions>
            <Button key={1} color="secondary" onClick={this.confirmDelete}>
              Delete
            </Button>
            <Button key={2} color="primary" onClick={this.handleClose}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

SystemSettings.propTypes = {
  history: PropTypes.object,
};

export default SystemSettings;

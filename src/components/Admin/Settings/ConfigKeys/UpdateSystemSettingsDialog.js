import React from 'react';
import PropTypes from 'prop-types';
import OutlinedTextField from '../../../shared/OutlinedTextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { createApiKey } from '../../../../apis';

class UpdateSystemSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyName: this.props.keyName || '',
      keyValue: this.props.keyValue || '',
      apiType: this.props.apiType || 'public',
    };
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSave = async () => {
    const { keyName, keyValue, apiType } = this.state;
    const { handleConfirm } = this.props;
    try {
      await createApiKey({ keyName, keyValue, apiType });
      handleConfirm();
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { type, handleClose } = this.props;
    const { keyName, keyValue } = this.state;
    const disabled = keyName.trim() === '' || keyValue.trim() === '';
    return (
      <React.Fragment>
        <DialogTitle>{`${type} key`}</DialogTitle>
        <DialogContent>
          <OutlinedTextField
            label="Key Name"
            placeholder="Key Name"
            value={keyName || ''}
            fullWidth={true}
            name="keyName"
            onChange={this.handleChange}
            disabled={type === 'Update'}
          />
          <OutlinedTextField
            label="Key Value"
            placeholder="Key Value"
            name="keyValue"
            value={keyValue || ''}
            fullWidth={true}
            onChange={this.handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button
            key={1}
            color="primary"
            onClick={this.handleSave}
            disabled={disabled}
          >
            {type}
          </Button>
          <Button key={2} color="primary" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </React.Fragment>
    );
  }
}

UpdateSystemSettings.propTypes = {
  type: PropTypes.string,
  apiType: PropTypes.string,
  keyName: PropTypes.string,
  keyValue: PropTypes.string,
  handleConfirm: PropTypes.func,
  handleClose: PropTypes.func,
};

export default UpdateSystemSettings;

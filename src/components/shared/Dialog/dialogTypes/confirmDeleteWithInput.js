import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '../../../shared/Button';
import Translate from '../../../Translate/Translate.react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const WarningContainer = styled.div`
  background-color: #fffbdd;
  color: #735c0f;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(27, 31, 35, 0.15);
`;

const DangerButton = styled(Button)`
  color: #cb2431;
  border-color: #cb2431;
`;

class ConfirmDeleteWithInput extends Component {
  static propTypes = {
    name: PropTypes.string,
    handleConfirm: PropTypes.func,
    handleClose: PropTypes.func,
    entityType: PropTypes.string.isRequired,
  };

  state = {
    inputValue: '',
  };

  // Handle changes in input
  handleChange = event => {
    this.setState({
      inputValue: event.target.value,
    });
  };

  render() {
    const { handleConfirm, handleClose, name, entityType } = this.props;

    const { inputValue } = this.state;
    const shouldDisable = !(inputValue === name);
    return (
      <div>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogContent>
          <WarningContainer>
            Unexpected bad things will happen if you don&apos;t read this!
          </WarningContainer>
          <DialogContentText>
            This action <strong>cannot</strong> be undone. This will permanently
            delete the {entityType} corresponding to the {entityType} name{' '}
            <strong>{name}</strong>.
            <br />
            <br />
            <strong>
              Please type in the name of the {entityType} to confirm.
            </strong>
          </DialogContentText>
          <OutlinedInput
            value={inputValue}
            autoFocus
            onChange={this.handleChange}
            margin="dense"
            label={`${entityType} name`}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary" variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <DangerButton
            variant="outlined"
            disabled={shouldDisable}
            onClick={handleConfirm}
          >
            <Translate text={`I understand, delete ${entityType}`} />
          </DangerButton>
        </DialogActions>
      </div>
    );
  }
}

export default ConfirmDeleteWithInput;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '../../../shared/Button';
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

class ConfirmDeleteWithInput extends Component {
  static propTypes = {
    name: PropTypes.string,
    handleConfirm: PropTypes.func,
    handleClose: PropTypes.func,
    entityType: PropTypes.string.isRequired,
  };

  state = {
    inputValue: '',
    loading: false,
  };

  // Handle changes in input
  handleChange = event => {
    this.setState({
      inputValue: event.target.value,
    });
  };

  render() {
    const { handleConfirm, handleClose, name, entityType } = this.props;

    const { inputValue, loading } = this.state;
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
        <DialogActions style={{ justifyContent: 'space-around' }}>
          <Button
            key={0}
            variant="contained"
            color="primary"
            handleClick={handleClose}
            buttonText="Cancel"
          />
          <Button
            key={1}
            color="secondary"
            variant="contained"
            handleClick={() => {
              this.setState({ loading: true });
              handleConfirm();
            }}
            isLoading={loading}
            buttonText={`I understand, delete ${entityType}`}
            disabled={shouldDisable || loading}
          />
        </DialogActions>
      </div>
    );
  }
}

export default ConfirmDeleteWithInput;

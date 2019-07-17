import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import Translate from '../../Translate/Translate.react';
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

class DeleteSkill extends Component {
  static propTypes = {
    skillName: PropTypes.string,
    handleConfirm: PropTypes.func,
    handleClose: PropTypes.func,
  };

  state = {
    skill: '',
  };

  // Handle changes in skill name
  handleChange = event => {
    this.setState({
      skill: event.target.value,
    });
  };

  render() {
    console.log(this.props);
    const { skillName = '', handleConfirm, handleClose } = this.props;
    const { skill } = this.state;
    const shouldDisable = !!skillName && !(skill === skillName);
    return (
      <div>
        <DialogTitle id="form-dialog-title">
          Are you absolutely sure?
        </DialogTitle>
        <DialogContent>
          <WarningContainer>
            Unexpected bad things will happen if you don&apos;t read this!
          </WarningContainer>
          <DialogContentText>
            This action <strong>cannot</strong> be undone. This will permanently
            remove the skill corresponding to the skill name{' '}
            <strong>{skillName}</strong>.
            <br />
            <br />
            <strong>Please type in the name of the skill to confirm.</strong>
          </DialogContentText>
          <OutlinedInput
            value={skill}
            autoFocus
            onChange={this.handleChange}
            margin="dense"
            label="Skill Name"
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
            <Translate text="I understand, remove skill" />
          </DangerButton>
        </DialogActions>
      </div>
    );
  }
}

export default DeleteSkill;

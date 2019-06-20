import React from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const RestoreSkill = props => {
  const { skillName, handleClose, handleConfirm } = props;
  return (
    <React.Fragment>
      <DialogTitle>Restore Skill</DialogTitle>
      <DialogContent>
        Are you sure you want to restore{' '}
        <span className="skillName">{skillName}</span>?
      </DialogContent>
      <DialogActions>
        <Button key={1} onClick={handleConfirm}>
          Restore
        </Button>
        <Button key={2} onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

RestoreSkill.propTypes = {
  skillName: PropTypes.string,
  handleClose: PropTypes.func,
  handleConfirm: PropTypes.func,
};

export default RestoreSkill;

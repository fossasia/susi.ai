import React from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const DeleteSkill = props => {
  const { skillName, handleConfirm, handleClose } = props;
  return (
    <React.Fragment>
      <DialogTitle>Delete Skill</DialogTitle>
      <DialogContent>
        Are you sure you want to delete{' '}
        <span className="skillName">{skillName}</span>?
      </DialogContent>
      <DialogActions>
        <Button key={1} color="secondary" onClick={handleConfirm}>
          Delete
        </Button>
        <Button key={2} color="primary" onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

DeleteSkill.propTypes = {
  skillName: PropTypes.string,
  handleConfirm: PropTypes.func,
  handleClose: PropTypes.func,
};

export default DeleteSkill;

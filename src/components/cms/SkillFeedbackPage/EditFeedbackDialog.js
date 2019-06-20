import React from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';

const EditFeedback = props => {
  const {
    handleConfirm,
    handleClose,
    feedback,
    errorText,
    handleEditFeedback,
  } = props;
  return (
    <React.Fragment>
      <DialogTitle>Edit Feedback</DialogTitle>
      <DialogContent>
        <FormControl fullWidth={true}>
          <Input
            id="edit-feedback"
            placeholder="Skill Feedback"
            defaultValue={feedback || ''}
            multiLine={true}
            fullWidth={true}
            onChange={handleEditFeedback}
            aria-describedby="edit-feedback-helper-text"
          />
          <FormHelperText id="edit-feedback-helper-text" error>
            {errorText}
          </FormHelperText>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button key={1} color="secondary" onClick={handleConfirm}>
          Edit
        </Button>
        <Button key={0} color="primary" onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

EditFeedback.propTypes = {
  handleConfirm: PropTypes.func,
  handleClose: PropTypes.func,
  handleEditFeedback: PropTypes.func,
  feedback: PropTypes.string,
  errorText: PropTypes.string,
};

export default EditFeedback;

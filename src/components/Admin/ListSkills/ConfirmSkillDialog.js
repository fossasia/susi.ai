import React from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const ConfirmSkill = props => {
  const { title, content, handleConfirm } = props;
  return (
    <React.Fragment>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <p>{content}</p>
      </DialogContent>
      <DialogActions>
        <Button key={1} onClick={handleConfirm}>
          Ok
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

ConfirmSkill.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  handleConfirm: PropTypes.func,
};

export default ConfirmSkill;

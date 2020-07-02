import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import OutlinedTextField from '../../shared/OutlinedTextField';
import FormControl from '@material-ui/core/FormControl';
import Button from '../../shared/Button';
import FiveStarRatingWidget from '../../shared/FiveStarRatingWidget';
import { RATING_TO_HINT_MAP } from '../../../constants/ratingHints';
import isMobileView from '../../../utils/isMobileView';

const EditFeedback = (props) => {
  const {
    handleConfirm,
    handleClose,
    feedback,
    handleEditFeedback,
    handleEditRating,
    rating,
  } = props;

  const [loader, updateLoader] = useState(false);
  const [newFeedback, updateNewFeedback] = useState(feedback);
  const [newRating, updateRating] = useState(rating);
  const mobileView = isMobileView();

  const handleEdit = async () => {
    updateLoader(true);
    await handleEditRating(newRating);
    handleConfirm();
  };

  const handelChange = (e) => {
    updateNewFeedback(e.target.value);
  };

  return (
    <React.Fragment>
      <DialogTitle>Edit Feedback</DialogTitle>
      <DialogContent>
        <FiveStarRatingWidget
          rating={newRating}
          id="edit-rating"
          widgetHoverColors="#ffbb28"
          widgetSpacings="5px"
          widgetDimensions={mobileView ? '30px' : '50px'}
          changeRating={(Rating) => {
            updateRating(Rating);
          }}
        />
        <div style={{ textAlign: 'center', fontSize: '1rem' }}>
          {RATING_TO_HINT_MAP[newRating]}
        </div>
        <FormControl fullWidth={true}>
          <OutlinedTextField
            id="edit-feedback"
            label="Skill Feedback"
            placeholder="Skill Feedback"
            defaultValue={feedback || ''}
            multiLine={true}
            disabled={loader}
            fullWidth={true}
            onChange={(e) => {
              handleEditFeedback();
              handelChange(e);
            }}
            aria-describedby="edit-feedback-helper-text"
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          key={0}
          color="primary"
          variant="contained"
          handleClick={handleClose}
          buttonText="Cancel"
        />
        <Button
          key={1}
          color="primary"
          variant="contained"
          handleClick={handleEdit}
          style={{ marginRight: '1em' }}
          disabled={
            (newRating === rating && newFeedback.trim().length === 0) || loader
          }
          isLoading={loader}
          buttonText="Edit"
        />
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
  rating: PropTypes.number,
  handleEditRating: PropTypes.func,
};

export default EditFeedback;

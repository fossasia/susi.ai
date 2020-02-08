import React from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '../../shared/Button';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import uiActions from '../../../redux/actions/ui';
import OutlinedTextField from '../../shared/OutlinedTextField';

class ReportSkill extends React.Component {
  state = {
    feedbackMessage: '',
    loading: false,
  };

  saveReportFeedback = feedbackMessage => {
    this.setState({
      feedbackMessage,
    });
  };

  render() {
    const { feedbackMessage, loading } = this.state;
    const { handleConfirm, handleClose } = this.props;
    return (
      <React.Fragment>
        <DialogTitle>Flag as inappropriate</DialogTitle>
        <DialogContent>
          <OutlinedTextField
            multiline={true}
            fullWidth={true}
            onChange={(event, val) =>
              this.saveReportFeedback(event.target.value)
            }
            label="Feedback message"
            placeholder="Leave a feedback message"
          />
        </DialogContent>
        <DialogActions style={{ justifyContent: 'space-around' }}>
          <Button
            key={0}
            color="primary"
            variant="contained"
            handleClick={() => {
              this.setState({ loading: true });
              handleConfirm();
            }}
            disabled={
              !(feedbackMessage !== undefined && feedbackMessage.trim()) ||
              loading
            }
            isLoading={loading}
            buttonText="Report"
          />
          <Button
            key={1}
            color="primary"
            variant="contained"
            handleClick={handleClose}
            buttonText="Cancel"
            style={{ marginRight: '1em' }}
          />
        </DialogActions>
      </React.Fragment>
    );
  }
}

ReportSkill.propTypes = {
  skillName: PropTypes.string,
  handleConfirm: PropTypes.func,
  handleClose: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch),
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(ReportSkill);

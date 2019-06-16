import React from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import uiActions from '../../../redux/actions/ui';
import TextField from '@material-ui/core/TextField';

class ReportSkill extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feedbackMessage: '',
    };
  }

  saveReportFeedback = feedbackMessage => {
    this.setState({
      feedbackMessage,
    });
  };

  render() {
    const { feedbackMessage } = this.state;
    const { handleConfirm, handleClose } = this.props;
    return (
      <React.Fragment>
        <DialogTitle>Flag as inappropriate</DialogTitle>
        <DialogContent>
          <TextField
            multiline={true}
            fullWidth={true}
            onChange={(event, val) =>
              this.saveReportFeedback(event.target.value)
            }
            label="Feedback message"
            placeholder="Leave a feedback message"
          />
        </DialogContent>
        <DialogActions>
          <Button
            key={0}
            color="secondary"
            onClick={handleConfirm}
            disabled={
              !(feedbackMessage !== undefined && feedbackMessage.trim())
            }
          >
            Report
          </Button>
          <Button key={1} color="primary" onClick={handleClose}>
            Cancel
          </Button>
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

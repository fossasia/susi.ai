import React from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import { connect } from 'react-redux';

class DeleteSkillWithInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteDisabled: true,
    };
  }

  handleDeleteText = event => {
    const { code } = this.props;
    const name = code.match(/^::name\s(.*)$/m);
    // console.log(name[1])
    if (event.target.value === name[1]) {
      this.setState({
        deleteDisabled: false,
      });
    } else {
      this.setState({
        deleteDisabled: true,
      });
    }
  };
  render() {
    const { handleClose, handleConfirm } = this.props;
    const { deleteDisabled } = this.state;
    return (
      <React.Fragment>
        <DialogTitle>Delete Skill</DialogTitle>
        <DialogContent>
          <FormControl fullWidth={true}>
            <Input
              placeholder="Enter Skill Name"
              fullWidth={true}
              onChange={this.handleDeleteText}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <DialogActions>
            <Button
              key={1}
              variant="contained"
              color="primary"
              style={{ marginLeft: 10 }}
              onClick={handleConfirm}
              disabled={deleteDisabled}
            >
              Delete
            </Button>
            <Button key={0} color="primary" onClick={handleClose}>
              Cancel
            </Button>
          </DialogActions>
        </DialogActions>
      </React.Fragment>
    );
  }
}

DeleteSkillWithInput.propTypes = {
  handleClose: PropTypes.func,
  handleConfirm: PropTypes.func,
  code: PropTypes.string,
};

function mapStateToProps(store) {
  return {
    code: store.create.skill.code,
  };
}

export default connect(
  mapStateToProps,
  null,
)(DeleteSkillWithInput);

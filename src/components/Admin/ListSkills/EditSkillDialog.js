import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export default class EditSkillDialog extends Component {
  static propTypes = {
    keyName: PropTypes.string,
    handleConfirm: PropTypes.func,
    handleClose: PropTypes.func,
    skillName: PropTypes.string,
    skillEditStatus: PropTypes.bool,
    skillReviewStatus: PropTypes.bool,
    skillStaffPickStatus: PropTypes.bool,
    systemSkillStatus: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    const {
      skillReviewStatus,
      skillEditStatus,
      skillStaffPickStatus,
      systemSkillStatus,
    } = this.props;
    this.state = {
      skillReviewStatus,
      skillEditStatus,
      skillStaffPickStatus,
      systemSkillStatus,
    };
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  render() {
    const { skillName, handleConfirm, handleClose } = this.props;
    const {
      skillReviewStatus,
      skillEditStatus,
      skillStaffPickStatus,
      systemSkillStatus,
    } = this.state;
    return (
      <React.Fragment>
        <DialogTitle>Skill Settings for {skillName}</DialogTitle>
        <DialogContent>
          <Container>
            <FormControlLabel
              control={
                <Checkbox
                  checked={skillReviewStatus}
                  onChange={this.handleChange('skillReviewStatus')}
                  color="primary"
                />
              }
              label="Reviewed"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={skillEditStatus}
                  onChange={this.handleChange('skillEditStatus')}
                  color="primary"
                />
              }
              label="Editable"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={skillStaffPickStatus}
                  onChange={this.handleChange('skillStaffPickStatus')}
                  color="primary"
                />
              }
              label="Staff Pick"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={systemSkillStatus}
                  onChange={this.handleChange('systemSkillStatus')}
                  color="primary"
                />
              }
              label="System Skill"
            />
          </Container>
        </DialogContent>
        <DialogActions>
          <Button
            key={1}
            onClick={() =>
              handleConfirm(
                skillReviewStatus,
                skillEditStatus,
                skillStaffPickStatus,
                systemSkillStatus,
              )
            }
          >
            Change
          </Button>
          <Button key={2} onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </React.Fragment>
    );
  }
}

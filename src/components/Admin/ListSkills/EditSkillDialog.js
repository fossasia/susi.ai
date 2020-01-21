import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '../../shared/Button';
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
      loading: false,
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
      loading,
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
        <DialogActions style={{ justifyContent: 'space-around' }}>
          <Button
            key={1}
            variant="contained"
            color="primary"
            handleClick={() => {
              this.setState({ loading: true });
              handleConfirm(
                skillReviewStatus,
                skillEditStatus,
                skillStaffPickStatus,
                systemSkillStatus,
              );
            }}
            isLoading={loading}
            disabled={loading}
            buttonText="Change"
          />
          <Button
            key={2}
            variant="contained"
            color="primary"
            handleClick={handleClose}
            style={{ marginRight: '1em' }}
            buttonText="Cancel"
          />
        </DialogActions>
      </React.Fragment>
    );
  }
}

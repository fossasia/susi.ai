import React from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { changeUserRole } from '../../../apis/index';
class ChangeUserRole extends React.Component {
  constructor(props) {
    super(props);
    const { userRole } = this.props;
    this.state = {
      userRole,
    };
  }

  handleChange = () => {
    const { userRole: role } = this.state;
    const { userEmail: user } = this.props;
    changeUserRole({ user, role })
      .then(payload => {})
      .catch(error => {
        const { statusCode } = error;
        if (statusCode === 401) {
          if (window.console) {
            console.log(error.responseText);
            console.log('Error 401: Permission Denied!');
          }
        } else if (statusCode === 503) {
          if (window.console) {
            console.log(error.responseText);
          }
          console.log('Error 503: Server not responding!');
          document.location.reload();
        } else {
          console.log(error);
        }
      });
  };

  handleUserRoleChange = (event, index, value) => {
    this.setState({
      userRole: event.target.value,
    });
  };

  render() {
    const { userEmail, handleClose } = this.props;
    const { userRole } = this.state;
    return (
      <React.Fragment>
        <DialogTitle>
          Select new User Role for
          <span style={{ fontWeight: 'bold', marginLeft: '5px' }}>
            {userEmail}
          </span>
        </DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <RadioGroup value={userRole} onChange={this.handleUserRoleChange}>
              <FormControlLabel
                value="user"
                control={<Radio color="primary" />}
                label="USER"
              />
              <FormControlLabel
                value="reviewer"
                control={<Radio color="primary" />}
                label="REVIEWER"
              />
              <FormControlLabel
                value="operator"
                control={<Radio color="primary" />}
                label="OPERATOR"
              />
              <FormControlLabel
                value="admin"
                control={<Radio color="primary" />}
                label="ADMIN"
              />
              <FormControlLabel
                value="superadmin"
                control={<Radio color="primary" />}
                label="SUPERADMIN"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button key={1} color="primary" onClick={this.handleChange}>
            Change
          </Button>
          <Button key={2} color="primary" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </React.Fragment>
    );
  }
}

ChangeUserRole.propTypes = {
  keyName: PropTypes.string,
  handleConfirm: PropTypes.func,
  handleClose: PropTypes.func,
  skillName: PropTypes.string,
  skillEditStatus: PropTypes.bool,
  skillReviewStatus: PropTypes.bool,
  skillStaffPickStatus: PropTypes.bool,
  systemSkillStatus: PropTypes.bool,
};

export default ChangeUserRole;

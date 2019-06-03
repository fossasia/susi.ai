import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import uiActions from '../../redux/actions/ui';
import Translate from '../Translate/Translate.react';
import SettingsTabWrapper from './SettingsTabWrapper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import settingActions from '../../redux/actions/settings';
import { setUserSettings } from '../../apis';

class ThemeChangeTab extends React.Component {
  constructor(props) {
    super(props);
    const { theme } = this.props;
    this.initialTheme = theme;
  }

  handleCustomTheme = () => {
    this.props.actions.openModal({ modalType: 'themeChange' });
  };

  handleSubmit = () => {
    const { actions, theme } = this.props;
    setUserSettings({ theme })
      .then(data => {
        if (data.accepted) {
          actions.openSnackBar({
            snackBarMessage: 'Settings updated',
          });
          actions.setUserSettings({ theme });
        } else {
          actions.openSnackBar({
            snackBarMessage: 'Failed to save Settings',
          });
        }
      })
      .catch(error => {
        actions.openSnackBar({
          snackBarMessage: 'Failed to save Settings',
        });
      });
  };

  render() {
    const { theme } = this.props;
    return (
      <SettingsTabWrapper currTheme={theme} heading="Select Theme">
        <RadioGroup
          style={{ textAlign: 'left', margin: 20 }}
          onChange={this.props.handleThemeChange}
          name="Theme"
          value={theme}
        >
          <FormControlLabel
            value="light"
            control={<Radio color="primary" />}
            label={<Translate text="Light" />}
          />
          <FormControlLabel
            value="dark"
            control={<Radio color="primary" />}
            label={<Translate text="Dark" />}
          />
          <FormControlLabel
            value="custom"
            control={<Radio color="primary" />}
            label={<Translate text="Custom" />}
          />
        </RadioGroup>
        <Button
          disabled={theme !== 'custom'}
          onClick={this.handleCustomTheme}
          variant="contained"
          color="primary"
        >
          <Translate text="Edit theme" />
        </Button>
        <div style={{ marginTop: '1rem' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleSubmit}
            disabled={theme === this.initialTheme}
          >
            <Translate text="Save Changes" />
          </Button>
        </div>
      </SettingsTabWrapper>
    );
  }
}

ThemeChangeTab.propTypes = {
  handleThemeChange: PropTypes.func,
  handleSelectChange: PropTypes.func,
  theme: PropTypes.string,
  actions: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...uiActions, ...settingActions }, dispatch),
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(ThemeChangeTab);

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import uiActions from '../../redux/actions/ui';
import Translate from '../Translate/Translate.react';
import SettingsTabWrapper from './SettingsTabWrapper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '../shared/Button';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import settingActions from '../../redux/actions/settings';
import { setUserSettings } from '../../apis';

class ThemeChangeTab extends React.Component {
  state = {
    loading: false,
  };
  initialTheme = this.props.theme;

  handleCustomTheme = () => {
    this.props.actions.openModal({ modalType: 'themeChange' });
  };

  handleSubmit = async () => {
    const { actions, theme, userEmailId } = this.props;
    this.setState({ loading: true });
    this.initialTheme = theme;
    let payload = {
      theme,
    };
    payload = userEmailId !== '' ? { ...payload, email: userEmailId } : payload;
    try {
      let data = await setUserSettings(payload);
      if (data.accepted) {
        actions.openSnackBar({
          snackBarMessage: 'Settings updated',
        });
        actions.setUserSettings({ theme });
        this.setState({ loading: false });
      } else {
        actions.openSnackBar({
          snackBarMessage: 'Failed to save Settings',
        });
        this.setState({ loading: false });
      }
    } catch (error) {
      actions.openSnackBar({
        snackBarMessage: 'Failed to save Settings',
      });
    }
  };

  render() {
    const { theme } = this.props;
    const { loading } = this.state;
    const disabled = theme === this.initialTheme || loading;
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
          color="primary"
          variant="contained"
          disabled={theme !== 'custom'}
          handleClick={this.handleCustomTheme}
          buttonText="Edit theme"
        />
        <div style={{ marginTop: '1rem' }}>
          <Button
            color="primary"
            variant="contained"
            handleClick={this.handleSubmit}
            disabled={disabled || loading}
            isLoading={loading}
            buttonText="Save Changes"
          />
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
  userEmailId: PropTypes.string,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...uiActions, ...settingActions }, dispatch),
  };
}

function mapStateToProps(store) {
  return {
    // Admin access : email Id of the user being accesed
    userEmailId: store.settings.userSettingsViewedByAdmin.email,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ThemeChangeTab);

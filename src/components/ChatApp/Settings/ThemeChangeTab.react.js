import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import uiActions from '../../../redux/actions/ui';
import Translate from '../../Translate/Translate.react';
import SettingsTabWrapper from './SettingsTabWrapper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const ThemeChangeTab = props => {
  const {
    actions,
    handleThemeChanger,
    theme,
    themeVal,
    handleSelectChange,
  } = props;
  const handleThemeChange = () => {
    actions.openModal({ modalType: 'themeChange' });
    handleThemeChanger();
  };
  return (
    <SettingsTabWrapper heading="Select Theme" theme={themeVal}>
      <RadioGroup
        style={{ textAlign: 'left', margin: 20 }}
        onChange={handleSelectChange}
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
        onClick={handleThemeChange}
        variant="contained"
        color="primary"
      >
        <Translate text="Edit theme" />
      </Button>
    </SettingsTabWrapper>
  );
};

ThemeChangeTab.propTypes = {
  containerStyle: PropTypes.object,
  handleSelectChange: PropTypes.func,
  handleThemeChanger: PropTypes.func,
  radioIconStyle: PropTypes.object,
  theme: PropTypes.string,
  themeForegroundColor: PropTypes.string,
  themeVal: PropTypes.string,
  tabHeadingStyle: PropTypes.object,
  actions: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch),
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(ThemeChangeTab);

import React from 'react';
import Translate from '../../Translate/Translate.react';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import ThemeChanger from './ThemeChanger';
import PropTypes from 'prop-types';

const ThemeChangeTab = props => {
  return (
    <div style={props.containerStyle}>
      <span>
        <div
          style={{
            marginTop: '10px',
            marginBottom: '5px',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          <Translate text="Select Theme" />
        </div>
        {props.theme === 'light' ? (
          <hr className="break-line-light" style={{ height: '2px' }} />
        ) : (
          <hr className="break-line-dark" />
        )}
      </span>
      <RadioButtonGroup
        style={{ textAlign: 'left', margin: 20 }}
        onChange={props.handleSelectChange}
        name="Theme"
        valueSelected={props.theme}
      >
        <RadioButton
          style={{ width: '20%', display: 'block' }}
          iconStyle={props.radioIconStyle}
          labelStyle={{ color: props.themeForegroundColor }}
          value="light"
          label={<Translate text="Light" />}
        />
        <RadioButton
          style={{ width: '20%', display: 'block' }}
          iconStyle={props.radioIconStyle}
          labelStyle={{ color: props.themeForegroundColor }}
          value="dark"
          label={<Translate text="Dark" />}
        />
        <RadioButton
          style={{
            width: '20%',
            display: props.isLoggedIn ? 'inline-block' : 'none',
          }}
          iconStyle={props.radioIconStyle}
          labelStyle={{ color: props.themeForegroundColor }}
          value="custom"
          label={<Translate text="Custom" />}
        />
      </RadioButtonGroup>
      <RaisedButton
        label={<Translate text="Edit theme" />}
        disabled={props.theme !== 'custom'}
        backgroundColor="#4285f4"
        labelColor="#fff"
        onClick={props.handleThemeChanger}
      />
      <ThemeChanger
        themeOpen={props.themeOpen}
        onRequestClose={() => props.onThemeRequestClose}
      />
    </div>
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
  onThemeRequestClose: PropTypes.func,
  isLoggedIn: PropTypes.string,
  themeOpen: PropTypes.bool,
};

export default ThemeChangeTab;

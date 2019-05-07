import React from 'react';
import Translate from '../../Translate/Translate.react';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

const MobileTab = props => {
  return (
    <div style={props.containerStyle}>
      <div>
        <div style={props.tabHeadingStyle}>
          <Translate text="Mobile" />
        </div>
        <div
          style={{
            marginTop: '0px',
            marginBottom: '0px',
            fontSize: '14px',
          }}
        >
          <Translate text="Expand your experience, get closer, and stay current" />
        </div>
        <hr color="#f8f8f8" />
        <div style={props.headingStyle}>
          <Translate text="Add your phone number" />
        </div>
        <div
          style={{
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
          }}
        >
          <Translate text="In future, we will text a verification code to your number. Standard SMS fees may apply." />
        </div>
        <div
          style={{
            marginTop: '2rem',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div style={{ marginRight: '2rem' }}>
            <Translate text="Country/region : " />
          </div>
          <div>
            <Select
              style={{
                width: '12rem',
              }}
              value={props.countryCode ? props.countryCode : 'US'}
              onChange={props.handleCountryChange}
            >
              {props.countries}
            </Select>
          </div>
        </div>
        <div
          style={{
            marginTop: '1rem',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div style={{ marginRight: '2rem' }}>Phone number :</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                top: '-2px',
                position: 'relative',
              }}
            >
              <TextField
                style={{ width: '45px' }}
                name="selectedCountry"
                disabled={true}
                value={
                  props.countryData[
                    props.countryCode ? props.countryCode : 'US'
                  ].countryCallingCodes[0]
                }
              />
            </div>
            <div style={{ marginLeft: '10px', width: '9rem' }}>
              <FormControl error={props.phoneNoError !== ''}>
                <InputLabel>Phone Number</InputLabel>
                <Input
                  value={props.phoneNo}
                  onChange={props.handleTelephoneNoChange}
                  aria-describedby="phone-error-text"
                />
                <FormHelperText error={props.phoneNoError !== ''}>
                  {props.phoneNoError}
                </FormHelperText>
              </FormControl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

MobileTab.propTypes = {
  phoneNo: PropTypes.string,
  countries: PropTypes.array,
  countryCode: PropTypes.string,
  countryData: PropTypes.object,
  containerStyle: PropTypes.object,
  floatingLabelStyle: PropTypes.object,
  phoneNoError: PropTypes.string,
  headingStyle: PropTypes.object,
  tabHeadingStyle: PropTypes.object,
  themeBackgroundColor: PropTypes.string,
  themeForegroundColor: PropTypes.string,
  themeVal: PropTypes.string,
  underlineStyle: PropTypes.object,
  handleCountryChange: PropTypes.func,
  handleTelephoneNoChange: PropTypes.func,
};

export default MobileTab;

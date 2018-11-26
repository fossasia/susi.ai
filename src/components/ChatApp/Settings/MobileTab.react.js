import React from 'react';
import Translate from '../../Translate/Translate.react';
import DropDownMenu from 'material-ui/DropDownMenu';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';

const MobileTab = props => {
  return (
    <span style={props.containerStyle}>
      <div>
        <div
          style={{
            marginTop: '10px',
            marginBottom: '5px',
            marginLeft: '30px',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          <Translate text="Mobile" />
        </div>
        <div
          style={{
            marginTop: '0px',
            marginBottom: '0px',
            marginLeft: '30px',
            fontSize: '14px',
          }}
        >
          <Translate text="Expand your experience, get closer, and stay current" />
        </div>
        <hr color="#f8f8f8" />
        <div
          style={{
            marginTop: '0px',
            marginBottom: '0px',
            marginLeft: '30px',
            fontSize: '15px',
            fontWeight: 'bold',
          }}
        >
          <Translate text="Add your phone number" />
        </div>
        <div
          style={{
            marginTop: '10px',
            marginBottom: '0px',
            marginLeft: '30px',
            fontSize: '14px',
          }}
        >
          <Translate text="In future, we will text a verification code to your number. Standard SMS fees may apply." />
        </div>
        <div
          style={{
            marginTop: '10px',
            marginBottom: '0px',
            marginLeft: '30px',
            fontSize: '14px',
          }}
        >
          <Translate text="Country/region : " />
          <DropDownMenu
            maxHeight={300}
            style={{
              width: '250px',
              position: 'relative',
              top: '15px',
              marginRight: '27px',
            }}
            labelStyle={{ color: props.themeForegroundColor }}
            menuStyle={{ backgroundColor: props.themeBackgroundColor }}
            menuItemStyle={{ color: props.themeForegroundColor }}
            value={props.countryCode ? props.countryCode : 'US'}
            onChange={props.handleCountryChange}
          >
            {props.countries}
          </DropDownMenu>
        </div>
        <div
          style={{
            marginTop: '45px',
            marginBottom: '0px',
            marginLeft: '30px',
            fontSize: '14px',
          }}
        >
          <span style={{ float: 'left', marginBottom: '35px' }}>
            Phone number :
          </span>
          <div
            style={{
              width: '250px',
              marginLeft: '33px',
              display: 'inline-block',
            }}
          >
            <TextField
              name="selectedCountry"
              disabled={true}
              underlineDisabledStyle={
                props.themeVal === 'dark' ? props.underlineStyle : null
              }
              inputStyle={{
                color: props.themeVal === 'dark' ? '#fff' : '#333',
              }}
              floatingLabelStyle={props.floatingLabelStyle}
              value={
                props.countryData[props.countryCode ? props.countryCode : 'US']
                  .countryCallingCodes[0]
              }
              style={{
                width: '45px',
                marginTop: '-18px',
                float: 'left',
              }}
            />

            <TextField
              name="phonenumber"
              style={{
                width: '150px',
                float: 'left',
                marginTop: '-42px',
                marginLeft: '10px',
              }}
              onChange={props.handleTelephoneNoChange}
              inputStyle={{
                color: props.themeVal === 'dark' ? '#fff' : '#333',
                paddingBottom: '4px',
                fontSize: '16px',
              }}
              floatingLabelStyle={props.floatingLabelStyle}
              value={props.phoneNo}
              errorText={props.phoneNoError}
              floatingLabelText={<Translate text="Phone number" />}
            />
          </div>
        </div>
      </div>
    </span>
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
  themeBackgroundColor: PropTypes.string,
  themeForegroundColor: PropTypes.string,
  themeVal: PropTypes.string,
  underlineStyle: PropTypes.object,
  handleCountryChange: PropTypes.func,
  handleTelephoneNoChange: PropTypes.func,
};

export default MobileTab;

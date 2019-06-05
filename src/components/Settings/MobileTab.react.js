import React from 'react';
import Translate from '../Translate/Translate.react';
import SettingsTabWrapper from './SettingsTabWrapper';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TabHeading } from './SettingStyles';
import countryData from 'country-data';
import Button from '@material-ui/core/Button';
import settingActions from '../../redux/actions/settings';
import uiActions from '../../redux/actions/ui';
import MenuItem from '@material-ui/core/MenuItem';
import { sortCountryLexographical } from '../../utils/helperFunctions';
import { isPhoneNumber } from '../../utils';
import { setUserSettings } from '../../apis';

class MobileTab extends React.Component {
  constructor(props) {
    super(props);
    const { phoneNo, countryCode, countryDialCode } = this.props;
    this.state = {
      phoneNo,
      phoneNoError: '',
      countryCode,
      countryDialCode,
    };
  }

  handleTelephoneNoChange = event => {
    const { value } = event.target;
    const re = /^\d*$/;
    if (value === '' || re.test(value)) {
      this.setState({ phoneNo: value });
    }
    if (!isPhoneNumber(value)) {
      this.setState({ phoneNoError: 'Invalid phone number' });
    } else {
      this.setState({ phoneNoError: '' });
    }
  };

  handleCountryChange = (event, index) => {
    const { value } = event.target;
    this.setState({
      countryCode: value,
      countryDialCode:
        countryData.countries[value ? value : 'US'].countryCallingCodes[0],
    });
  };

  handleSubmit = () => {
    const { actions } = this.props;
    const { phoneNo, countryCode, countryDialCode } = this.state;
    const payload = { phoneNo, countryCode, countryDialCode };
    setUserSettings(payload)
      .then(data => {
        if (data.accepted) {
          actions.openSnackBar({
            snackBarMessage: 'Settings updated',
          });
          actions.setUserSettings(payload);
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
    const { phoneNo, phoneNoError, countryCode } = this.state;
    sortCountryLexographical(countryData);
    let countries = countryData.countries.all.map((country, i) => {
      if (countryData.countries.all[i].countryCallingCodes[0]) {
        return (
          <MenuItem value={countryData.countries.all[i].alpha2} key={i}>
            {countryData.countries.all[i].name +
              ' ' +
              countryData.countries.all[i].countryCallingCodes[0]}
          </MenuItem>
        );
      }
      return null;
    });
    return (
      <SettingsTabWrapper heading="Mobile">
        <div
          style={{ marginTop: '0px', marginBottom: '0px', fontSize: '14px' }}
        >
          <Translate text="Expand your experience, get closer, and stay current" />
        </div>
        <hr color="#f8f8f8" />
        <TabHeading>
          <Translate text="Add your phone number" />
        </TabHeading>
        <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
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
            <Translate text="Country/region :" />
          </div>
          <div>
            <Select
              style={{
                width: '12rem',
              }}
              value={countryCode ? countryCode : 'US'}
              onChange={this.handleCountryChange}
            >
              {countries}
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
                  countryData.countries[countryCode ? countryCode : 'US']
                    .countryCallingCodes[0]
                }
              />
            </div>
            <div
              style={{
                marginLeft: '10px',
                width: '8rem',
              }}
            >
              <FormControl error={phoneNoError !== ''}>
                <InputLabel>Phone Number</InputLabel>
                <Input
                  value={phoneNo}
                  onChange={this.handleTelephoneNoChange}
                  aria-describedby="phone-error-text"
                />
                <FormHelperText error={phoneNoError !== ''}>
                  {phoneNoError}
                </FormHelperText>
              </FormControl>
            </div>
          </div>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleSubmit}
          disabled={
            (countryCode === this.props.countryCode) &
            (phoneNo === this.props.phoneNo)
          }
        >
          <Translate text="Save Changes" />
        </Button>
      </SettingsTabWrapper>
    );
  }
}

MobileTab.propTypes = {
  phoneNo: PropTypes.string,
  countryCode: PropTypes.string,
  countryDialCode: PropTypes.string,
  actions: PropTypes.object,
};

function mapStateToProps(store) {
  return {
    theme: store.settings.theme,
    phoneNo: store.settings.phoneNo,
    countryCode: store.settings.countryCode,
    countryDialCode: store.settings.countryDialCode,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...settingActions, ...uiActions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MobileTab);

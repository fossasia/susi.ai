import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Translate from '../Translate/Translate.react';
import './RemoveDeviceDialog.css';

const styles = {
  paperStyle: {
    width: '100%',
    textAlign: 'center',
    padding: '0px',
  },
  fieldStyle: {
    height: '35px',
    borderRadius: 4,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '0px 10px',
    width: '250px',
    marginTop: '0px',
  },
  inputStyle: {
    height: '35px',
    marginBottom: '10px',
  },
};

class RemoveDeviceDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      devicename: '',
      correctName: false,
    };
  }

  componentDidMount = () => {
    let field = this.returnDiv;
    let removeDeviceBtn = this.removeDeviceButton;
    let deviceName = this.deviceName;
    const fieldWidth = field.style.width;
    const fieldStyle = {
      padding: '0px',
      color: '#900',
    };
    const removeDeviceBtnStyle = {
      width: fieldWidth + 6,
      transition: 'none',
    };
    const deviceNameStyle = {
      width: fieldWidth - 16,
    };
    field.style = fieldStyle;
    removeDeviceBtn.style = removeDeviceBtnStyle;
    deviceName.style = deviceNameStyle;
  };
  // Handle changes in device name
  handleChange = event => {
    this.setState({
      devicename: event.target.value,
      correctName: event.target.value === this.props.devicename,
    });
  };

  render() {
    const { paperStyle, fieldStyle, inputStyle } = styles;
    return (
      <div
        className="removeDeviceForm"
        id="returnDiv"
        ref={el => (this.returnDiv = el)}
      >
        <Paper zDepth={0} style={paperStyle}>
          <div
            style={{
              backgroundColor: '#f6f8fa',
              color: '#24292e',
              padding: '16px',
              border: '1px solid rgba(27,31,35,0.15)',
              fontSize: '14px',
              textAlign: 'left',
              fontWeight: '600',
              lineHeight: '1.5',
            }}
          >
            Are you absolutely sure?
          </div>
          <div
            style={{
              backgroundColor: '#fffbdd',
              color: '#735c0f',
              padding: '16px',
              border: '1px solid rgba(27,31,35,0.15)',
              fontSize: '14px',
              textAlign: 'left',
              lineHeight: '1.5',
            }}
          >
            Unexpected bad things will happen if you don't read this!
          </div>
          <div
            style={{
              backgroundColor: '#ffffff',
              color: '#24292e',
              padding: '16px',
              border: '1px solid rgba(27,31,35,0.15)',
              fontSize: '14px',
              textAlign: 'left',
              fontWeight: '400',
              lineHeight: '1.5',
            }}
          >
            <p style={{ marginTop: '0px', marginBottom: '10px' }}>
              This action <strong>cannot</strong> be undone. This will
              permanently remove the device corresponding to the device name{' '}
              <strong>{this.props.devicename}</strong>.
            </p>
            <p style={{ marginTop: '0px', marginBottom: '10px' }}>
              Please type in the name of the device to confirm.
            </p>
            <div
              style={{ textAlign: 'center' }}
              ref={el => (this.deviceName = el)}
            >
              <TextField
                id="devicename"
                name="devicename"
                value={this.state.devicename}
                inputStyle={inputStyle}
                style={fieldStyle}
                placeholder=""
                underlineStyle={{ display: 'none' }}
                onChange={this.handleChange}
                autoComplete="off"
                width="100%"
              />
            </div>
            {/* Remove Device Button */}
            <div style={{ textAlign: 'center' }}>
              <RaisedButton
                id="removeDeviceButton"
                onClick={() => this.props.handleRemove(this.props.deviceIndex)}
                label={<Translate text="I understand, remove device" />}
                backgroundColor="#cb2431"
                style={{
                  boxShadow: 'none',
                  marginTop: '10px',
                  border: '1px solid rgba(27,31,35,0.2)',
                  borderRadius: '0.25em',
                }}
                labelStyle={{
                  color: this.state.correctName
                    ? '#fff'
                    : 'rgba(203,36,49,0.4)',
                  padding: '6px 12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  lineHeight: '20px',
                  whiteSpace: 'nowrap',
                  verticalAlign: 'middle',
                }}
                disabled={!this.state.correctName}
                ref={el => (this.removeDeviceButton = el)}
              />
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

RemoveDeviceDialog.propTypes = {
  onLoginSignUp: PropTypes.func,
  devicename: PropTypes.string,
  deviceIndex: PropTypes.number,
  handleRemove: PropTypes.func,
};

export default RemoveDeviceDialog;

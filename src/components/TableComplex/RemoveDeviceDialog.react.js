import React, { Component } from 'react';
import PropTypes from 'prop-types';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import Translate from '../Translate/Translate.react';
import './RemoveDeviceDialog.css';

const styles = {
  fieldStyle: {
    height: '2.5rem',
    width: '17.5rem',
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

  // Handle changes in device name
  handleChange = event => {
    this.setState({
      devicename: event.target.value,
      correctName: event.target.value === this.props.devicename,
    });
  };

  render() {
    const { fieldStyle } = styles;
    return (
      <div className="removeDeviceForm">
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
          Unexpected bad things will happen if you don&apos;t read this!
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
            This action <strong>cannot</strong> be undone. This will permanently
            remove the device corresponding to the device name{' '}
            <strong>{this.props.devicename}</strong>.
          </p>
          <p style={{ marginTop: '0px', marginBottom: '10px' }}>
            Please type in the name of the device to confirm.
          </p>
          <div style={{ textAlign: 'center', padding: '0 8px' }}>
            <OutlinedInput
              name="devicename"
              value={this.state.devicename}
              style={fieldStyle}
              onChange={this.handleChange}
            />
          </div>
          {/* Remove Device Button */}
          <div style={{ textAlign: 'center' }}>
            <Button
              onClick={() => this.props.handleRemove(this.props.deviceIndex)}
              label={<Translate text="I understand, remove device" />}
              backgroundColor="#cb2431"
              color="primary"
              variant="contained"
              style={{
                boxShadow: 'none',
                marginTop: '10px',
                color: this.state.correctName ? '#fff' : 'rgba(203,36,49,0.4)',
                padding: '6px 12px',
                border: '1px solid rgba(27, 31, 35, 0.2)',
                fontWeight: '600',
              }}
              disabled={!this.state.correctName}
            >
              <Translate text="I understand, remove device" />
            </Button>
          </div>
        </div>
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

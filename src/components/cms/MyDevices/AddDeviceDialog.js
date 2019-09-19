import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import _DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import _Close from '@material-ui/icons/Close';

const DialogContent = styled(_DialogContent)`
  text-align: left;
`;

const Close = styled(_Close)`
  float: right;
  cursor: pointer;
`;

const AddDevice = ({ handleClose }) => {
  return (
    <React.Fragment>
      <Close onClick={handleClose} />
      <DialogContent>
        In order to add a device to your SUSI.AI account you need to setup a
        smart device such as a SUSI.AI speaker locally. Please perform the
        following steps:
        <ol>
          <li>
            Setup your SUSI.AI smart device. To create a smart device you can
            use a computer board such as Raspberry PI with a voicehat and
            speakers and install the SUSI.AI Linux distribution. You can{' '}
            <a
              href="https://github.com/fossasia/susi_installer/releases"
              target="_blank"
              rel="noopener noreferrer"
            >
              download the latest software releases here
            </a>
            .
          </li>
          <li>Start your new SUSI.AI smart device.</li>
          <li>
            The device will open a hotspot. Connect to the WiFi network
            &quot;SUSI.AI&quot; from your smartphone or desktop computer and
            open the browser. You will be redirected to the setup page.
            Alternatively you can follow the setup guide in the{' '}
            <a
              href="https://play.google.com/store/apps/details?id=ai.susi"
              target="_blank"
              rel="noopener noreferrer"
            >
              SUSI.AI Android app
            </a>
            .
          </li>
          <li>
            Enter the desired name for your device, WiFi credentials of your
            home network and the SUSI.AI online account info. Then press
            &quot;Finish Setup&quot;.
          </li>
          <li>
            The smart speaker now restarts and will try to connect to your home
            network and the SUSI.AI online server to register the device.
          </li>
          <li>
            The device will show up in your SUSI.AI account once it successfully
            connects to the Internet. If the device is not able to connect, it
            will restart after a while and you will be able to go through the
            setup process again.
          </li>
        </ol>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleClose}>
          OK
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

AddDevice.propTypes = {
  handleClose: PropTypes.func,
};

export default AddDevice;

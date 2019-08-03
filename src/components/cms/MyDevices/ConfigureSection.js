import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Select from '../../shared/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {
  Overlay,
  OverlayContainer,
  CustomButton,
  Bold,
  SpeechToTextDiv,
  SaveButton,
} from './styles';

const serviceMenu = ['Google', 'IBM Watson'];

const ConfigureSection = props => {
  const {
    synchronizePublicSkills,
    synchronizePrivateSkills,
    speechToText,
    textToSpeech,
    userName,
    email,
    isLocalEnv,
    handleCheck,
    handleChangeSpeech,
    handleRemoveConfirmation,
  } = props;
  return (
    <OverlayContainer>
      {!isLocalEnv && (
        <Overlay>
          You need to access this page on your device to configure your device.
        </Overlay>
      )}
      <h1>Configure</h1>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              name="synchronizePublicSkills"
              checked={synchronizePublicSkills}
              onChange={handleCheck}
              color="primary"
              disabled={!isLocalEnv}
            />
          }
          label="(Coming Soon) Synchronize local skills with SUSI.AI skills database regularly"
        />
        <CustomButton
          variant="contained"
          color="primary"
          size="small"
          disabled={!isLocalEnv}
        >
          Synchronize Now
        </CustomButton>
        <FormControlLabel
          control={
            <Checkbox
              name="synchronizePrivateSkills"
              checked={synchronizePrivateSkills}
              onChange={handleCheck}
              color="primary"
              disabled={!isLocalEnv}
            />
          }
          label="(Coming Soon) Synchronize (upload) private skills I create locally with my online account when online"
        />
        <CustomButton
          variant="contained"
          color="primary"
          size="small"
          disabled={!isLocalEnv}
        >
          Upload Now
        </CustomButton>
      </div>
      <div style={{ paddingLeft: '35px' }}>
        <Bold>Speech Recognition and Voice Output on Device</Bold>
        <SpeechToTextDiv>
          Speech to Text:{' '}
          <Select
            name="speechToText"
            value={speechToText}
            onChange={handleChangeSpeech}
            disabled={!isLocalEnv}
          >
            {serviceMenu.map((service, index) => {
              return (
                <MenuItem value={service} key={index}>
                  {service}
                </MenuItem>
              );
            })}
          </Select>
        </SpeechToTextDiv>
        <SpeechToTextDiv>
          Text to Speech:{' '}
          <Select
            name="textToSpeech"
            value={textToSpeech}
            onChange={handleChangeSpeech}
            disabled={!isLocalEnv}
          >
            {serviceMenu.map((service, index) => {
              return (
                <MenuItem value={service} key={index}>
                  {service}
                </MenuItem>
              );
            })}
          </Select>
        </SpeechToTextDiv>
        <SaveButton
          variant="contained"
          color="primary"
          size="small"
          disabled={!isLocalEnv}
        >
          Save Changes
        </SaveButton>
        <Bold>
          Device linked to SUSI.AI account {userName !== '' ? userName : email}
        </Bold>{' '}
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleRemoveConfirmation}
          disabled={!isLocalEnv}
        >
          Unlink
        </Button>
      </div>
    </OverlayContainer>
  );
};

ConfigureSection.propTypes = {
  accessToken: PropTypes.string,
  userName: PropTypes.string,
  email: PropTypes.string,
  isLocalEnv: PropTypes.bool,
  handleCheck: PropTypes.func,
  handleChangeSpeech: PropTypes.func,
  handleRemoveConfirmation: PropTypes.func,
  synchronizePublicSkills: PropTypes.bool,
  synchronizePrivateSkills: PropTypes.bool,
  speechToText: PropTypes.string,
  textToSpeech: PropTypes.string,
};

function mapStateToProps(store) {
  return {
    accessToken: store.app.accessToken || '',
    email: store.app.email,
    userName: store.settings.userName,
    isLocalEnv: store.app.isLocalEnv,
  };
}

export default connect(
  mapStateToProps,
  null,
)(ConfigureSection);

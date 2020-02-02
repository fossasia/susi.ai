import React from 'react';
import { connect } from 'react-redux';
import Button from '../shared/Button';
import Translate from '../Translate/Translate.react';
import SettingsTabWrapper from './SettingsTabWrapper';
import Switch from '@material-ui/core/Switch';
import PropTypes from 'prop-types';
import settingActions from '../../redux/actions/settings';
import uiActions from '../../redux/actions/ui';
import { FlexContainer } from '../shared/Container';
import { bindActionCreators } from 'redux';
import { setUserSettings } from '../../apis';

class ChatAppTab extends React.Component {
  state = {
    enterAsSend: this.props.enterAsSend,
    loading: false,
  };

  handleEnterAsSend = (event, isInputChecked) => {
    this.setState({
      enterAsSend: isInputChecked,
    });
  };

  handleSubmit = async () => {
    const { actions, userEmailId } = this.props;
    const { enterAsSend } = this.state;
    this.setState({ loading: true });
    let payload = {
      enterAsSend,
    };
    payload = userEmailId !== '' ? { ...payload, email: userEmailId } : payload;
    try {
      let data = await setUserSettings(payload);
      if (data.accepted) {
        actions.openSnackBar({
          snackBarMessage: 'Settings updated',
        });
        actions.setUserSettings({ enterAsSend });
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
    const { enterAsSend, loading } = this.state;
    const { enterAsSend: _enterAsSend } = this.props;
    const disabled = enterAsSend === _enterAsSend || loading;
    return (
      <SettingsTabWrapper heading="Preferences">
        <FlexContainer>
          <div>
            <Translate text="Send message by pressing ENTER" />
          </div>
          <div>
            <Switch
              color="primary"
              className="settings-toggle"
              onChange={this.handleEnterAsSend}
              checked={enterAsSend}
            />
          </div>
        </FlexContainer>
        <Button
          color="primary"
          variant="contained"
          handleClick={this.handleSubmit}
          disabled={disabled || loading}
          isLoading={loading}
          buttonText="Save Changes"
          style={{ margin: '1.5rem 0' }}
        />
      </SettingsTabWrapper>
    );
  }
}

ChatAppTab.propTypes = {
  enterAsSend: PropTypes.bool,
  actions: PropTypes.object,
  userEmailId: PropTypes.string,
};

function mapStateToProps(store) {
  const userSettingsViewedByAdmin = store.settings.userSettingsViewedByAdmin;
  const { email } = userSettingsViewedByAdmin;
  const settings = email !== '' ? userSettingsViewedByAdmin : store.settings;
  return {
    enterAsSend: settings.enterAsSend,
    userEmailId: email, // Admin access : email Id of the user being accesed
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
)(ChatAppTab);

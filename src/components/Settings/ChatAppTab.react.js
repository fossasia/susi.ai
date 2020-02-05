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
  constructor(props) {
    super(props);
    const { enterAsSend, hideBubble } = this.props;
    this.state = {
      enterAsSend,
      hideBubble,
      loading: false,
    };
  }

  handleEnterAsSend = (event, isInputChecked) => {
    this.setState({
      enterAsSend: isInputChecked,
    });
  };

  handleHideBubble = (event, isInputChecked) => {
    this.setState({
      hideBubble: isInputChecked,
    });
  };

  handleSubmit = async () => {
    const { actions, userEmailId } = this.props;
    const { enterAsSend, hideBubble } = this.state;
    this.setState({ loading: true });
    let payload = {
      enterAsSend,
      hideBubble,
    };
    payload = userEmailId !== '' ? { ...payload, email: userEmailId } : payload;
    try {
      let data = await setUserSettings(payload);
      if (data.accepted) {
        actions.openSnackBar({
          snackBarMessage: 'Settings updated',
        });
        actions.setUserSettings({ enterAsSend, hideBubble });
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
    const { enterAsSend, loading, hideBubble } = this.state;
    const { enterAsSend: _enterAsSend, hideBubble: _hideBubble } = this.props;
    const disabled =
      (enterAsSend === _enterAsSend && hideBubble === _hideBubble) || loading;
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
        <FlexContainer>
          <div>
            <Translate text="Hide Floating Chat-Button" />
          </div>
          <div>
            <Switch
              color="primary"
              className="settings-toggle"
              onChange={this.handleHideBubble}
              checked={hideBubble}
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
  hideBubble: PropTypes.bool,
  actions: PropTypes.object,
  userEmailId: PropTypes.string,
};

function mapStateToProps(store) {
  const userSettingsViewedByAdmin = store.settings.userSettingsViewedByAdmin;
  const { email } = userSettingsViewedByAdmin;
  const settings = email !== '' ? userSettingsViewedByAdmin : store.settings;
  return {
    enterAsSend: settings.enterAsSend,
    hideBubble: settings.hideBubble,
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

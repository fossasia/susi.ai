import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Translate from '../../Translate/Translate.react';
import SettingsTabWrapper from './SettingsTabWrapper';
import Switch from '@material-ui/core/Switch';
import PropTypes from 'prop-types';
import settingActions from '../../../redux/actions/settings';
import uiActions from '../../../redux/actions/ui';
import { FlexContainer } from '../../shared/Container';
import { bindActionCreators } from 'redux';
import { setUserSettings } from '../../../apis';

class ChatAppTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enterAsSend: this.props.enterAsSend,
    };
  }

  handleEnterAsSend = (event, isInputChecked) => {
    this.setState({
      enterAsSend: isInputChecked,
    });
  };

  handleSubmit = () => {
    const { actions } = this.props;
    const { enterAsSend } = this.state;
    setUserSettings({ enterAsSend })
      .then(data => {
        if (data.accepted) {
          actions.openSnackBar({
            snackBarMessage: 'Settings updated',
          });
          actions.setUserSettings({ enterAsSend });
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
    const { enterAsSend } = this.state;
    return (
      <SettingsTabWrapper heading="Preferences">
        <FlexContainer>
          <div className="reduceSettingDiv">
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
          variant="contained"
          color="primary"
          onClick={this.handleSubmit}
          disabled={enterAsSend === this.props.enterAsSend}
        >
          <Translate text="Save Changes" />
        </Button>
      </SettingsTabWrapper>
    );
  }
}

ChatAppTab.propTypes = {
  enterAsSend: PropTypes.bool,
  actions: PropTypes.object,
};

function mapStateToProps(store) {
  return {
    enterAsSend: store.settings.enterAsSend,
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

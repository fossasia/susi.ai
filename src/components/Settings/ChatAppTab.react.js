import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
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
    this.state = {
      enterAsSend: this.props.enterAsSend,
      loading: false,
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
    this.setState({ loading: true });
    setUserSettings({ enterAsSend })
      .then(data => {
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
      })
      .catch(error => {
        actions.openSnackBar({
          snackBarMessage: 'Failed to save Settings',
        });
      });
  };

  render() {
    const { enterAsSend, loading } = this.state;
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
          disabled={enterAsSend === this.props.enterAsSend || loading}
          style={{ margin: '1.5rem 0', width: '10rem' }}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <Translate text="Save Changes" />
          )}
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

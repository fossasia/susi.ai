import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { StylesProvider } from '@material-ui/styles';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { theme } from './MUItheme';
import VerifyAccount from './components/Auth/VerifyAccount/VerifyAccount';
import Blog from './components/About/Blog';
import ChatApp from './components/ChatApp/ChatApp.react';
import Contact from './components/About/Contact/Contact.react';
import Devices from './components/About/Devices';
import Logout from './components/Auth/Logout';
import NotFound from './components/NotFound/NotFound.react';
import Overview from './components/About/Overview';
import Settings from './components/Settings/Settings.react';
import Support from './components/About/Support';
import Team from './components/About/Team';
import Terms from './components/About/Terms/Terms.react';
import Privacy from './components/About/Privacy/Privacy.react';
import appActions from './redux/actions/app';
import uiActions from './redux/actions/ui';
import ProtectedRoute from './components/shared/ProtectedRoute';
import DeviceProtectedRoute from './components/shared/DeviceProtectedRoute';
import DialogSection from '../src/components/shared/Dialog';
import settingActions from './redux/actions/settings';
import BrowseSkill from './components/cms/BrowseSkill/BrowseSkill';
import BrowseSkillByCategory from './components/cms/BrowseSkill/BrowseSkillByCategory';
import BrowseSkillByLanguage from './components/cms/BrowseSkill/BrowseSkillByLanguage';
import SkillListing from './components/cms/SkillPage/SkillListing';
import SkillFeedbackPage from './components/cms/SkillFeedbackPage/SkillFeedbackPage';
import Dashboard from './components/cms/Dashboard';
import SkillVersion from './components/cms/SkillVersion/SkillVersion';
import SkillHistory from './components/cms/SkillHistory/SkillHistory';
import SkillRollBack from './components/cms/SkillRollBack/SkillRollBack';
import SkillWizard from './components/cms/SkillCreator/SkillWizard';
import BotBuilderWrap from './components/cms/BotBuilder/BotBuilderWrap';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer/Footer.react';
import CookiePolicy from './components/CookiePolicy/CookiePolicy.react';
import Admin from './components/Admin/Admin';
import CustomSnackbar from './components/shared/CustomSnackbar';
import AppBanner from './components/shared/AppBanner';
import DeviceSetupPage from './components/smart-speaker/Setup';
import ConfigureSpeaker from './components/smart-speaker/Configure';
import ScrollTopButton from './components/shared/ScrollTopButton';

import withTracker from './withTracker';
import GoogleAnalytics from 'react-ga';
import { isProduction } from './utils/helperFunctions';
import { checkDeviceWiFiAccessPoint, fetchActiveDeviceMacId } from './apis';

const RootContainer = styled.div`
  min-height: calc(100vh - 120px);
  margin-top: 50px;
`;

const EnhancedBrowseSkill = withTracker(BrowseSkill);
const EnhancedBrowseSkillByCategory = withTracker(BrowseSkillByCategory);
const EnhancedBrowseSkillByLanguage = withTracker(BrowseSkillByLanguage);
const EnhancedSkillListing = withTracker(SkillListing);
const EnhancedSkillFeedbackPage = withTracker(SkillFeedbackPage);
const EnhancedDashboard = withTracker(Dashboard);
const EnhancedSkillVersion = withTracker(SkillVersion);
const EnhancedSkillHistory = withTracker(SkillHistory);
const EnhancedSkillRollBack = withTracker(SkillRollBack);
const EnhancedSkillWizard = withTracker(SkillWizard);
const EnhancedBotBuilderWrap = withTracker(BotBuilderWrap);
const EnhancedOverview = withTracker(Overview);
const EnhancedDevices = withTracker(Devices);
const EnhancedTeam = withTracker(Team);
const EnhancedBlog = withTracker(Blog);
const EnhancedContact = withTracker(Contact);
const EnhancedSupport = withTracker(Support);
const EnhancedConfigureSpeaker = withTracker(ConfigureSpeaker);
const EnhancedTerms = withTracker(Terms);
const EnhancedPrivacy = withTracker(Privacy);
const EnhancedVerifyAccount = withTracker(VerifyAccount);
const EnhancedSettings = withTracker(Settings);
const EnhancedNotFound = withTracker(NotFound);

class App extends Component {
  static propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    actions: PropTypes.object,
    accessToken: PropTypes.string,
    snackBarProps: PropTypes.object,
    showCookiePolicy: PropTypes.bool,
    modalProps: PropTypes.object,
    visited: PropTypes.bool,
    isLocalEnv: PropTypes.bool,
    mode: PropTypes.string,
  };

  state = {
    activeDeviceMacId: '',
    deviceAccessPoint: false,
  };

  componentDidMount = async () => {
    const { accessToken, actions, isLocalEnv } = this.props;
    if (!isLocalEnv) {
      this.setState({ deviceAccessPoint: false });
    } else {
      try {
        let payload = await fetchActiveDeviceMacId();
        this.setState({ activeDeviceMacId: payload.macid });
      } catch (error) {
        console.log(error, 'error');
      }

      try {
        let payload = await checkDeviceWiFiAccessPoint();
        this.setState({ deviceAccessPoint: payload.status === 'true' });
      } catch (error) {
        console.log('Error, catched', error);
        this.setState({ deviceAccessPoint: false });
      }
    }

    let isGAInitialised = false;

    window.addEventListener('offline', this.onUserOffline);
    window.addEventListener('online', this.onUserOnline);

    let { payload } = await actions.getApiKeys();
    const {
      keys: { googleAnalyticsKey = null },
    } = payload;

    if (accessToken && !isProduction()) {
      let { payload } = await actions.getApiKeys({ apiType: 'user' });
      const userKeys = payload.keys;
      if (userKeys && userKeys.googleAnalyticsKey) {
        isGAInitialised = true;
        userKeys.googleAnalyticsKey &&
          GoogleAnalytics.initialize(userKeys.googleAnalyticsKey);
      }
    }

    if (!isGAInitialised) {
      googleAnalyticsKey && GoogleAnalytics.initialize(googleAnalyticsKey);
    }

    actions.getCaptchaConfig();
    if (accessToken) {
      actions.getAdmin();
      actions.getUserSettings().catch(e => {
        console.log(e);
      });
    }
  };

  componentWillUnmount = () => {
    window.removeEventListener('offline', this.onUserOffline);
    window.removeEventListener('online', this.onUserOnline);
  };

  onUserOffline = () => {
    const { actions } = this.props;
    actions.openSnackBar({
      snackBarMessage: 'It seems you are offline!',
    });
  };

  onUserOnline = () => {
    const { actions } = this.props;
    actions.openSnackBar({
      snackBarMessage: 'Welcome back!',
    });
  };

  render() {
    const {
      actions,
      snackBarProps: {
        snackBarMessage,
        isSnackBarOpen,
        snackBarDuration,
        snackBarPosition,
        variant,
      },
      modalProps: { isModalOpen },
      location: { pathname },
      showCookiePolicy,
      isLocalEnv,
      mode,
      location,
      // visited,
    } = this.props;

    const { deviceAccessPoint, activeDeviceMacId } = this.state;

    const renderFooterPagesList = [
      deviceAccessPoint ? null : '/',
      '/about',
      '/team',
      '/blog',
      '/devices',
      '/support',
      '/privacy',
      '/terms',
      '/contact',
    ];

    const hideBubble = [
      'skillWizard',
      'botWizard',
      'admin',
      'edit',
      deviceAccessPoint ? '' : null,
    ];

    const skillListRegex = new RegExp('^/');
    const pathLength = pathname.split('/').length;
    const renderAppBanner = isLocalEnv ? (
      <AppBanner macId={activeDeviceMacId} />
    ) : null;
    const renderAppBar =
      pathname !== '/chat' && !deviceAccessPoint ? <NavigationBar /> : null;
    const renderFooter =
      ((skillListRegex.test(pathname) && pathLength > 2 && pathLength <= 4) ||
        renderFooterPagesList.includes(pathname)) &&
      !pathname.includes('/admin/') ? (
        <Footer />
      ) : null;

    const renderCookiePolicy =
      showCookiePolicy === true ? <CookiePolicy /> : null;
    // const renderDialog = isModalOpen || !visited  ?  <DialogSection /> : null;
    const renderDialog =
      isModalOpen ||
      mode === 'fullScreen' ||
      location.pathname === '/resetpass' ? (
        <DialogSection />
      ) : null;
    const renderChatBubble =
      hideBubble.includes(location.pathname.split('/')[1]) ||
      (hideBubble.includes(location.pathname.split('/')[3]) &&
        deviceAccessPoint) ? null : (
        <ChatApp />
      );
    return (
      <StylesProvider injectFirst>
        <MuiThemeProvider theme={theme}>
          <div>
            {renderDialog}
            {isSnackBarOpen && (
              <CustomSnackbar
                autoHideDuration={snackBarDuration}
                open={isSnackBarOpen}
                message={snackBarMessage}
                onClose={actions.closeSnackBar}
                anchorOrigin={snackBarPosition}
                variant={variant}
              />
            )}
            {renderAppBar}
            {renderAppBanner}
            {renderChatBubble}
            <ScrollTopButton />
            <RootContainer>
              <Switch>
                {!deviceAccessPoint ? (
                  <Route exact path="/" component={EnhancedBrowseSkill} />
                ) : (
                  <Route exact path="/" component={DeviceSetupPage} />
                )}
                <Route
                  exact
                  path="/resetPass"
                  component={EnhancedBrowseSkill}
                />
                <Route
                  exact
                  path="/category/:category"
                  component={EnhancedBrowseSkillByCategory}
                />
                <Route
                  exact
                  path="/language/:language"
                  component={EnhancedBrowseSkillByLanguage}
                />
                <Route
                  exact
                  path="/:category/:skills/:lang"
                  component={EnhancedSkillListing}
                />
                <Route
                  exact
                  path="/:category/:skills/:lang/feedbacks"
                  component={EnhancedSkillFeedbackPage}
                />
                <ProtectedRoute
                  exact
                  path="/dashboard/"
                  component={EnhancedDashboard}
                />
                <Route
                  exact
                  path="/:category/:skill/versions/:lang"
                  component={EnhancedSkillVersion}
                />
                <Route
                  exact
                  path="/:category/:skill/compare/:lang/:oldid/:recentid"
                  component={EnhancedSkillHistory}
                />
                <Route
                  exact
                  path="/:category/:skill/edit/:lang/:latestid/:revertid"
                  component={EnhancedSkillRollBack}
                />
                <DeviceProtectedRoute
                  exact
                  path="/:category/:skill/edit/:lang"
                  component={EnhancedSkillWizard}
                />
                <DeviceProtectedRoute
                  exact
                  path="/:category/:skill/edit/:lang/:commit"
                  component={EnhancedSkillWizard}
                />
                <ProtectedRoute
                  exact
                  path="/myskills"
                  component={EnhancedDashboard}
                />
                <ProtectedRoute
                  path="/mydevices"
                  component={EnhancedDashboard}
                />
                <ProtectedRoute
                  exact
                  path="/skillWizard"
                  component={EnhancedSkillWizard}
                />
                <ProtectedRoute
                  path="/botWizard"
                  component={EnhancedBotBuilderWrap}
                />
                <Route
                  path="/configure-speaker"
                  component={EnhancedConfigureSpeaker}
                />
                <ProtectedRoute path="/mybots" component={EnhancedDashboard} />
                <Route exact path="/about" component={EnhancedOverview} />
                <Route exact path="/devices" component={EnhancedDevices} />
                <Route exact path="/team" component={EnhancedTeam} />
                <Route exact path="/blog" component={EnhancedBlog} />
                <Route exact path="/contact" component={EnhancedContact} />
                <Route exact path="/support" component={EnhancedSupport} />
                <Route exact path="/terms" component={EnhancedTerms} />
                <Route exact path="/privacy" component={EnhancedPrivacy} />
                <Route
                  exact
                  path="/verify-account"
                  component={EnhancedVerifyAccount}
                />
                <Route exact path="/logout" component={Logout} />
                <Route path="/admin" component={Admin} />
                <ProtectedRoute
                  exact
                  path="/settings"
                  component={EnhancedSettings}
                />
                <Route
                  exact
                  path="/*:path(error-404|)"
                  component={EnhancedNotFound}
                />
              </Switch>
            </RootContainer>
            <div>{renderFooter}</div>
            {renderCookiePolicy}
          </div>
        </MuiThemeProvider>
      </StylesProvider>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...appActions, ...uiActions, ...settingActions },
      dispatch,
    ),
  };
}

function mapStateToProps(store) {
  return {
    ...store.router,
    ...store.ui,
    accessToken: store.app.accessToken,
    showCookiePolicy: store.app.showCookiePolicy,
    visited: store.app.visited,
    isLocalEnv: store.app.isLocalEnv,
    googleAnalyticsKey: store.app.apiKeys.googleAnalyticsKey,
    mode: store.ui.mode,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

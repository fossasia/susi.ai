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
import Contact from './components/Contact/Contact.react';
import Devices from './components/About/Devices';
import Logout from './components/Auth/Logout';
import NotFound from './components/NotFound/NotFound.react';
import Overview from './components/About/Overview';
import Settings from './components/Settings/Settings.react';
import Support from './components/About/Support';
import Team from './components/About/Team';
import Terms from './components/Terms/Terms.react';
import Privacy from './components/Privacy/Privacy.react';
import appActions from './redux/actions/app';
import uiActions from './redux/actions/ui';
import ProtectedRoute from './components/shared/ProtectedRoute';
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
import DeviceWizard from './components/cms/MyDevices/DeviceWizard';
import AppBanner from './components/shared/AppBanner';
import withTracker from './withTracker';
import GoogleAnalytics from 'react-ga';

const RootContainer = styled.div`
  min-height: calc(100vh - 120px);
  margin-top: 50px;
`;

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
  };

  componentDidMount = () => {
    const { accessToken, actions } = this.props;

    window.addEventListener('offline', this.onUserOffline);
    window.addEventListener('online', this.onUserOnline);

    actions.getApiKeys().then(({ payload }) => {
      const {
        keys: { googleAnalyticsKey = null },
      } = payload;
      googleAnalyticsKey && GoogleAnalytics.initialize(googleAnalyticsKey);
    });
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
      // visited,
    } = this.props;
    const skillListRegex = new RegExp('^/');
    const pathLength = pathname.split('/').length;
    const renderFooterPagesList = [
      '/',
      '/about',
      '/team',
      '/blog',
      '/devices',
      '/support',
      '/privacy',
      '/terms',
      '/contact',
    ];
    const renderAppBanner = isLocalEnv ? <AppBanner /> : null;
    const renderAppBar = pathname !== '/chat' ? <NavigationBar /> : null;
    const renderFooter =
      (skillListRegex.test(pathname) && pathLength > 2 && pathLength <= 4) ||
      renderFooterPagesList.includes(pathname) ? (
        <Footer />
      ) : null;

    const renderCookiePolicy =
      showCookiePolicy === true ? <CookiePolicy /> : null;
    // const renderDialog = isModalOpen || !visited  ?  <DialogSection /> : null;
    const renderDialog = isModalOpen ? <DialogSection /> : null;

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
            {pathname !== '/chat' ? <ChatApp showChatBubble={true} /> : null}
            <RootContainer>
              <Switch>
                <Route exact path="/" component={withTracker(BrowseSkill)} />
                <Route exact path="/chat" component={withTracker(ChatApp)} />
                <Route
                  exact
                  path="/category/:category"
                  component={withTracker(BrowseSkillByCategory)}
                />
                <Route
                  exact
                  path="/language/:language"
                  component={withTracker(BrowseSkillByLanguage)}
                />
                <Route
                  exact
                  path="/:category/:skills/:lang"
                  component={withTracker(SkillListing)}
                />
                <Route
                  exact
                  path="/:category/:skills/:lang/feedbacks"
                  component={withTracker(SkillFeedbackPage)}
                />
                <ProtectedRoute
                  exact
                  path="/mydevices/:macID"
                  component={withTracker(DeviceWizard)}
                />
                <ProtectedRoute
                  exact
                  path="/dashboard/"
                  component={withTracker(Dashboard)}
                />
                <Route
                  exact
                  path="/:category/:skill/versions/:lang"
                  component={withTracker(SkillVersion)}
                />
                <Route
                  exact
                  path="/:category/:skill/compare/:lang/:oldid/:recentid"
                  component={withTracker(SkillHistory)}
                />
                <Route
                  exact
                  path="/:category/:skill/edit/:lang/:latestid/:revertid"
                  component={withTracker(SkillRollBack)}
                />
                <Route
                  exact
                  path="/:category/:skill/edit/:lang"
                  component={withTracker(SkillWizard)}
                />
                <Route
                  exact
                  path="/:category/:skill/edit/:lang/:commit"
                  component={withTracker(SkillWizard)}
                />
                <ProtectedRoute
                  exact
                  path="/myskills"
                  component={withTracker(Dashboard)}
                />
                <ProtectedRoute
                  exact
                  path="/mydevices"
                  component={withTracker(Dashboard)}
                />
                <ProtectedRoute
                  exact
                  path="/skillWizard"
                  component={withTracker(SkillWizard)}
                />
                <ProtectedRoute
                  path="/botWizard"
                  component={withTracker(BotBuilderWrap)}
                />
                <ProtectedRoute
                  path="/mybots"
                  component={withTracker(Dashboard)}
                />
                <Route exact path="/about" component={withTracker(Overview)} />
                <Route exact path="/devices" component={withTracker(Devices)} />
                <Route exact path="/team" component={withTracker(Team)} />
                <Route exact path="/blog" component={withTracker(Blog)} />
                <Route exact path="/contact" component={withTracker(Contact)} />
                <Route exact path="/support" component={withTracker(Support)} />
                <Route exact path="/terms" component={withTracker(Terms)} />
                <Route exact path="/privacy" component={withTracker(Privacy)} />
                <Route
                  exact
                  path="/verify-account"
                  component={withTracker(VerifyAccount)}
                />
                <Route exact path="/logout" component={Logout} />
                <Route path="/admin" component={Admin} />
                <ProtectedRoute
                  exact
                  path="/settings"
                  component={withTracker(Settings)}
                />
                <Route
                  exact
                  path="/*:path(error-404|)"
                  component={withTracker(NotFound)}
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
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

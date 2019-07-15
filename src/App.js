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
import DialogSection from '../src/components/Dialog/DialogSection.react';
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
  };

  componentDidMount = () => {
    const { accessToken, actions } = this.props;

    window.addEventListener('offline', this.onUserOffline);
    window.addEventListener('online', this.onUserOnline);

    actions.getApiKeys();
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
            {pathname !== '/chat' ? <ChatApp showChatBubble={true} /> : null}
            <RootContainer>
              <Switch>
                <Route exact path="/" component={BrowseSkill} />
                <Route exact path="/chat" component={ChatApp} />
                <Route
                  exact
                  path="/category/:category"
                  component={BrowseSkillByCategory}
                />
                <Route
                  exact
                  path="/language/:language"
                  component={BrowseSkillByLanguage}
                />
                <Route
                  exact
                  path="/:category/:skills/:lang"
                  component={SkillListing}
                />
                <Route
                  exact
                  path="/:category/:skills/:lang/feedbacks"
                  component={SkillFeedbackPage}
                />
                <ProtectedRoute
                  exact
                  path="/dashboard/"
                  component={Dashboard}
                />
                <Route
                  exact
                  path="/:category/:skill/versions/:lang"
                  component={SkillVersion}
                />
                <Route
                  exact
                  path="/:category/:skill/compare/:lang/:oldid/:recentid"
                  component={SkillHistory}
                />
                <Route
                  exact
                  path="/:category/:skill/edit/:lang/:latestid/:revertid"
                  component={SkillRollBack}
                />
                <Route
                  exact
                  path="/:category/:skill/edit/:lang"
                  component={SkillWizard}
                />
                <Route
                  exact
                  path="/:category/:skill/edit/:lang/:commit"
                  component={SkillWizard}
                />
                <ProtectedRoute exact path="/myskills" component={Dashboard} />
                <ProtectedRoute
                  exact
                  path="/skillWizard"
                  component={SkillWizard}
                />
                <ProtectedRoute path="/botWizard" component={BotBuilderWrap} />
                <ProtectedRoute path="/mybots" component={Dashboard} />
                <Route exact path="/about" component={Overview} />
                <Route exact path="/devices" component={Devices} />
                <Route exact path="/team" component={Team} />
                <Route exact path="/blog" component={Blog} />
                <Route exact path="/contact" component={Contact} />
                <Route exact path="/support" component={Support} />
                <Route exact path="/terms" component={Terms} />
                <Route exact path="/privacy" component={Privacy} />
                <Route exact path="/verify-account" component={VerifyAccount} />
                <Route exact path="/logout" component={Logout} />
                <Route path="/admin" component={Admin} />
                <ProtectedRoute exact path="/settings" component={Settings} />
                <Route exact path="/*:path(error-404|)" component={NotFound} />
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
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

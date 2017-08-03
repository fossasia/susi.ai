import Logout from './components/Auth/Logout.react';
import ChatApp from './components/ChatApp/ChatApp.react';
import Devices from './components/Devices/Devices.react';
import NotFound from './components/NotFound/NotFound.react';
import Overview from './components/Overview/Overview.react';
import Support from './components/Support/Support.react';
import Team from './components/Team/Team.react';
import Terms from './components/Terms/Terms.react';
import Blog from './components/Blog/Blog.react';
import Settings from './components/ChatApp/Settings/Settings.react';
import Contact from './components/Contact/Contact.react';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as ChatWebAPIUtils from './utils/ChatWebAPIUtils';
import * as Actions from './actions/';
import MessageStore from './stores/MessageStore';
import {
	BrowserRouter as Router,
	Route,
	Switch,
	hashHistory
} from 'react-router-dom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
// Internationalization

import UserPreferencesStore from './stores/UserPreferencesStore';
import {IntlProvider} from 'react-intl';
import {addLocaleData} from 'react-intl';
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
import es from 'react-intl/locale-data/es';
import de from 'react-intl/locale-data/de';
import ru from 'react-intl/locale-data/ru';

addLocaleData([...en, ...fr, ...es,...de,...ru]);

ChatWebAPIUtils.getSettings();
ChatWebAPIUtils.getLocation();
ChatWebAPIUtils.getHistory();
ChatWebAPIUtils.getAllMessages();

const muiTheme = getMuiTheme({
  toggle: {
    thumbOnColor: '#5ab1fc',
    trackOnColor: '#4285f4'
  }
});

let defaults = UserPreferencesStore.getPreferences();
let defaultPrefLanguage = defaults.PrefLanguage;
const App = () => (
	<Router history={hashHistory}>
		<MuiThemeProvider muiTheme={muiTheme}>
			<Switch>
				<Route exact path="/" component={ChatApp} />
				<Route exact path="/logout" component={Logout} />
				<Route exact path="/overview" component={Overview} />
				<Route exact path="/devices" component={Devices} />
				<Route exact path='/team' component={Team} />
				<Route exact path='/blog' component={Blog} />
				<Route exact path='/contact' component={Contact} />
				<Route exact path="/support" component={Support} />
				<Route exact path="/terms" component={Terms} />
				<Route exact path="/settings" component={Settings} />
				<Route exact path="*" component={NotFound} />
			</Switch>
		</MuiThemeProvider>
	</Router>
);

window.speechSynthesis.onvoiceschanged = function () {
	if(!MessageStore.getTTSInitStatus()){
		var speechSynthesisVoices = speechSynthesis.getVoices();
		Actions.getTTSLangText(speechSynthesisVoices);
		Actions.initialiseTTSVoices(speechSynthesisVoices);
	}
};

ReactDOM.render(
	<IntlProvider locale={defaultPrefLanguage}>
	 	<App />
	 </IntlProvider>,
	document.getElementById('root')
);

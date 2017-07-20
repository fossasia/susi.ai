import Logout from './components/Auth/Logout.react';
import ChatApp from './components/ChatApp/ChatApp.react';
import NotFound from './components/NotFound/NotFound.react';
import Overview from './components/Overview/Overview.react';
import Support from './components/Support/Support.react';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as ChatWebAPIUtils from './utils/ChatWebAPIUtils';
import {
	BrowserRouter as Router,
	Route,
	Switch,
	hashHistory
} from 'react-router-dom';

ChatWebAPIUtils.getSettings();
ChatWebAPIUtils.getLocation();
ChatWebAPIUtils.getHistory();
ChatWebAPIUtils.getAllMessages();

const App = () => (
	<Router history={hashHistory}>
		<MuiThemeProvider>
			<Switch>
				<Route exact path="/" component={ChatApp} />
				<Route exact path="/logout" component={Logout} />
				<Route exact path="/overview" component={Overview} />
				<Route exact path="/support" component={Support} />
				<Route exact path="*" component={NotFound} />

			</Switch>
		</MuiThemeProvider>
	</Router>
);

ReactDOM.render(
	<App />,
	document.getElementById('root')
);

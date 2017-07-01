import SignUp from './components/Auth/SignUp/SignUp.react';
import Logout from './components/Auth/Logout.react';
import ChatApp from './components/ChatApp/ChatApp.react';
import NotFound from './components/NotFound/NotFound.react'
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
				<Route exact path="/signup" component={SignUp} />
				<Route exact path="/logout" component={Logout} />
				<Route exact path="*" component={NotFound} />

			</Switch>
		</MuiThemeProvider>
	</Router>
);

ReactDOM.render(
	<App />,
	document.getElementById('root')
);

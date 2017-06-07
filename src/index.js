import ChatApp from './components/ChatApp.react';
import Login from './components/Auth/Login/Login.react';
import SignUp from './components/Auth/SignUp/SignUp.react';

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

ChatWebAPIUtils.getHistory();
ChatWebAPIUtils.getAllMessages();


const App = () => (
	<Router history={hashHistory}>
		<MuiThemeProvider>
			<Switch>
				<Route exact path="/" component={ChatApp} />
				<Route exact path="/login" component={Login} />
				<Route exact path="/signup" component={SignUp} />

			</Switch>
		</MuiThemeProvider>
	</Router>
);

ReactDOM.render(
	<App />,
	document.getElementById('root')
);

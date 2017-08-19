import Blog from './components/Blog/Blog.react';
import ChatApp from './components/ChatApp/ChatApp.react';
import Contact from './components/Contact/Contact.react';
import Devices from './components/Devices/Devices.react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Logout from './components/Auth/Logout.react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import PropTypes from 'prop-types';
import NotFound from './components/NotFound/NotFound.react';
import Overview from './components/Overview/Overview.react';
import Settings from './components/ChatApp/Settings/Settings.react';
import Support from './components/Support/Support.react';
import Team from './components/Team/Team.react';
import Terms from './components/Terms/Terms.react';
import Privacy from './components/Privacy/Privacy.react';
import { Switch, Route } from 'react-router-dom';
import React, { Component } from 'react';

const muiTheme = getMuiTheme({
    toggle: {
        thumbOnColor: '#5ab1fc',
        trackOnColor: '#4285f4'
    }
});

class App extends Component{
  closeVideo = () => this.setState({
    video: false
  })

 render(){
    if(location.pathname!=='/'){
        document.body.className = 'white-body';
    }
     return(
        <MuiThemeProvider muiTheme={muiTheme}>
        <div>
        <Switch>
            <Route exact path='/' component={ChatApp}/>
            <Route exact path="/overview" component={Overview} />
            <Route exact path="/devices" component={Devices} />
            <Route exact path='/team' component={Team} />
            <Route exact path='/blog' component={Blog} />
            <Route exact path='/contact' component={Contact} />
            <Route exact path="/support" component={Support} />
            <Route exact path="/terms" component={Terms} />
            <Route exact path="/privacy" component={Privacy} />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/settings" component={Settings} />
            <Route exact path="*" component={NotFound} />
        </Switch>
        </div>
        </MuiThemeProvider>
     );
 }
}
App.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    closeVideo: PropTypes.func
}

export default App;

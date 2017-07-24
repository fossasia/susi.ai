import React, { Component } from 'react';
import './Support.css';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Signup from 'material-ui/svg-icons/action/account-circle';
import UserPreferencesStore from '../../stores/UserPreferencesStore';
import Dialog from 'material-ui/Dialog';
import Login from '../Auth/Login/Login.react';
import Chat from 'material-ui/svg-icons/communication/chat';
import { Link } from 'react-router-dom';
import SignUp from '../Auth/SignUp/SignUp.react';
import RaisedButton from 'material-ui/RaisedButton';
import Close from 'material-ui/svg-icons/navigation/close';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';

class Support extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      showOptions: false,
      login: false,
      signup: false,
      baseUrl: window.location.protocol + '//' + window.location.host + '/'
    };
  }
  showOptions = (event) => {
    event.preventDefault();
    this.setState({
      showOptions: true,
      anchorEl: event.currentTarget
    })
  }

  closeOptions = () => {
    this.setState({
      showOptions: false,
    });
  };
  handleToggle = () => this.setState({ open: !this.state.open });

  handleClose = () => this.setState({ open: false });

  handleTitle = () => {
    this.props.history.push('/');
  }
  handleLogin = () => this.setState({
    login: true,
    signup: false
  })
  handleClose = () => this.setState({
    login: false,
    signup: false
  })
  handleSignUp = () => this.setState({
    signup: true,
    login: false
  })
  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }
  handleDrawer = () => this.setState({ openDrawer: !this.state.openDrawer });
  handleDrawerClose = () => this.setState({ openDrawer: false });

  render() {
    const bodyStyle = {
      'padding': 0,
      textAlign: 'center'
    }
    const style = {
      marginTop: '25px',
      marginBottom: '25px'
    }
    const closingStyle ={
        position: 'absolute',
        zIndex: 1200,
        fill: '#444',
        width: '26px',
        height: '26px',
        right: '10px',
        top: '10px',
        cursor:'pointer'
      }
    const actions = <RaisedButton
      label="Cancel"
      backgroundColor={
        UserPreferencesStore.getTheme()==='light' ? '#4285f4' : '#19314B'}
      labelColor="#fff"
      width='200px'
      keyboardFocused={true}
      onTouchTap={this.handleClose}
    />;
    const TopMenu = (props) => (
      <div>
        <div className="top-menu">
          <FlatButton label="Overview" href="/overview" style={{ color: '#fff' }} className="topMenu-item" />
          <FlatButton label="Docs" href="http://dev.susi.ai/" style={{ color: '#fff' }} className="topMenu-item" />
          <FlatButton label="Blog" href="/blog" style={{ color: '#fff' }} className="topMenu-item" />
          <FlatButton label="Team" href="/team" style={{ color: '#fff' }} className="topMenu-item" />
        </div>
        <IconMenu
          {...props}
          iconButtonElement={
            <IconButton iconStyle={{ color: '#fff' }} ><MoreVertIcon /></IconButton>
          }

        >
          <MenuItem primaryText="Login"

            onTouchTap={this.handleLogin} />
          <MenuItem primaryText="Sign Up"
            onTouchTap={this.handleSignUp}
            rightIcon={<Signup />} />
          <MenuItem primaryText="Chat"
            containerElement={<Link to="/logout" />}
            rightIcon={<Chat />} />
        </IconMenu>
      </div>
    );

    return (
      <div>

        <header className="nav-down" id="headerSection">
          <AppBar
            className="topAppBar"
            title={<a href={this.state.baseUrl} ><img src="susi-white.svg" alt="susi-logo"
              className="siteTitle" /></a>}
            style={{ backgroundColor: '#0084ff' }}
            onLeftIconButtonTouchTap={this.handleDrawer}
            iconElementRight={<TopMenu />}
          />
        </header>

        <Drawer
          docked={false}
          width={200}
          open={this.state.openDrawer}
          onRequestChange={(openDrawer) => this.setState({ openDrawer })}
        >
          <AppBar
            title={<a href={this.state.baseUrl} ><img src="susi-white.svg" alt="susi-logo"
              className="siteTitle" /></a>}
            style={{ backgroundColor: '#0084ff' }}
            onTouchTap={this.handleDrawerClose} />
          <MenuItem onTouchTap={this.handleDrawerClose} className="drawerItem"><Link to="/overview">Overview</Link></MenuItem>
          <MenuItem onTouchTap={this.handleDrawerClose} className="drawerItem"><Link to="http://dev.susi.ai/">Docs</Link></MenuItem>
          <MenuItem onTouchTap={this.handleDrawerClose} className="drawerItem"><Link to="/blog">Blog</Link></MenuItem>
          <MenuItem onTouchTap={this.handleDrawerClose} className="drawerItem"><Link to="/teams">teams</Link></MenuItem>
        </Drawer>

        <div className="section white-grey">
          <div className="conversation__description">
            <div className="support__heading">Support</div>
            <p className="support__text">
              Get the help and information you need from our
                  community and team through various channels.
                  </p>
          </div>
          <div className='img-container' style={{ width: '30%', margin: '50px 0 0 0' }}>
            <img src='support.png' alt='support' className='support' />
          </div>
        </div>
        <div className="section">
          <div className="conversation__description">
            <div className="support__heading">Ask the community</div>
          </div>
          <div className="devsite-landing-row-group">
            <div className="devsite-landing-row-item devsite-landing-row-item-with-icon devsite-landing-row-item-no-image">
              <a href="https://gitter.im/fossasia/susi_server">
                <div className="devsite-landing-row-item-icon-container">
                  <img alt='gitter' src="gitter.jpg" className="devsite-landing-row-item-icon" />
                </div>
              </a>
              <div className="devsite-landing-row-item-description devsite-landing-row-item-icon-description">
                <a href="https://gitter.im/fossasia/susi_server">
                  <h3 id="stack-overflow">Gitter</h3>
                </a>
                <div className="devsite-landing-row-item-description-content">
                  Interact with us on Gitter to know more about how to
                          start contributing.
                          </div>
              </div>
            </div>
            <div className="devsite-landing-row-item devsite-landing-row-item-with-icon devsite-landing-row-item-no-image">
              <a href="http://groups.google.com/forum/#!forum/susiai">
                <div className="devsite-landing-row-item-icon-container">
                  <img alt='google groups' src="google-groups.png" className="devsite-landing-row-item-icon" /></div></a>
              <div className="devsite-landing-row-item-description devsite-landing-row-item-icon-description">
                <a href="http://groups.google.com/forum/#!forum/susiai">
                  <h3 id="stack-overflow">Google Groups</h3>
                </a>
                <div className="devsite-landing-row-item-description-content">
                  Discuss about the projects on our Google Groups Channel.
                          </div>
              </div>
            </div>
            <div className="devsite-landing-row-item devsite-landing-row-item-with-icon devsite-landing-row-item-no-image ">
              <a href="https://github.com/fossasia?utf8=%E2%9C%93&q=susi&type=&language=">
                <div className="devsite-landing-row-item-icon-container">
                  <img alt='github' src="github-logo.png" className="devsite-landing-row-item-icon" />
                </div>
              </a>
              <div className="devsite-landing-row-item-description devsite-landing-row-item-icon-description">
                <a href="https://github.com/fossasia?utf8=%E2%9C%93&q=susi&type=&language=">
                  <h3 id="stack-overflow">Github</h3>
                </a>
                <div className="devsite-landing-row-item-description-content">
                  Visit our repositories and start contributing.
                </div>
              </div>
            </div>
          </div>
        </div>  {/* row section ends */}
        <div className="section">
          <div className='left'>
            <div className="conversation__description">
              <div className="support__heading">Contact Us</div>
            </div>
            <div className="devsite-landing-row-group">
              <div className="devsite-landing-row-item devsite-landing-row-item-with-icon devsite-landing-row-item-no-image ">
                <a href="https://github.com/fossasia/susi_server/issues/new">
                  <div className="devsite-landing-row-item-icon-container">
                    <img alt='question' src="question.png" className="devsite-landing-row-item-icon" /></div></a>
                <div className="devsite-landing-row-item-description devsite-landing-row-item-icon-description">
                  <a href="https://github.com/fossasia/susi_server/issues/new">
                    <h3 id="stack-overflow">Get Support</h3>
                  </a>
                  <div className="devsite-landing-row-item-description-content">
                    Got a problem? We are here to help.
                        </div>
                </div>
              </div>
            </div>
          </div>
          <div className='right'>
            <div className="conversation__description">
              <div className="support__heading">Recent Changes & Updates</div>
            </div>
            <div className="devsite-landing-row-group">
              <div className="devsite-landing-row-item devsite-landing-row-item-with-icon devsite-landing-row-item-no-image">
                <a href="https://github.com/fossasia/susi_server/">
                  <div className="devsite-landing-row-item-icon-container">
                    <img alt='code' src="code.png" className="devsite-landing-row-item-icon" />
                  </div>
                </a>
                <div className="devsite-landing-row-item-description devsite-landing-row-item-icon-description">
                  <a href="https://github.com/fossasia/susi_server/">
                    <h3 id="stack-overflow">Change Log</h3>
                  </a>
                  <div className="devsite-landing-row-item-description-content">
                    View all recent changes from the SUSI.AI Team.
                  </div>
                </div>
              </div>
              {/* Login */}
              <Dialog
                className='dialogStyle'
                modal={true}
                open={this.state.login}
                autoScrollBodyContent={true}
                bodyStyle={bodyStyle}
                contentStyle={{width: '35%',minWidth: '300px'}}
                onRequestClose={this.handleClose}>
                <Login  />
                <Close style={closingStyle} onTouchTap={this.handleClose} />
              </Dialog>
            {/* SignUp */}
            <Dialog
                className='dialogStyle'
                actions={actions}
                modal={true}
                open={this.state.signup}
                autoScrollBodyContent={true}
                bodyStyle={bodyStyle}
                contentStyle={{width: '35%',minWidth: '300px'}}
                onRequestClose={this.handleClose}>
                <SignUp  />
              </Dialog>

            </div>
          </div>
              </div >
      <div className="section non-flex blue-background">
        <div className="conversation__description footer-desc">
          <div className="support__heading center">Get Started Today</div>

          <RaisedButton label="Sign Up" onTouchTap={this.handleSignUp} style={style} />
        </div>
      </div>
      <div className='footer'>
        <div className='footer-container'>
          <img src='susi.svg' alt='SUSI' className='susi-logo' />
          <ul className='alignLeft'>
            <li><a href='/about'>About</a></li>
            <li><a href='http://blog.fossasia.org/tag/susi-ai/'>Blog</a></li>
            <li><a href='https://github.com/fossasia?utf8=%E2%9C%93&q=susi'>Code</a></li>
          </ul>
          <ul className='alignRight'>
            <li><a href='/settings'>Settings</a></li>
            <li><a href='/terms'>Terms</a></li>
            <li><a href='/contact'>Contact</a></li>
          </ul>
        </div>
      </div>
              {/* Login */ }
    <Dialog
      className='dialogStyle'
      actions={actions}
      modal={true}
      open={this.state.login}
      autoScrollBodyContent={true}
      bodyStyle={bodyStyle}
      contentStyle={{ width: '35%', minWidth: '300px' }}
      onRequestClose={this.handleClose}>
      <Login />
    </Dialog>
    {/* SignUp */ }
    <Dialog
      className='dialogStyle'
      actions={actions}
      modal={true}
      open={this.state.signup}
      autoScrollBodyContent={true}
      bodyStyle={bodyStyle}
      contentStyle={{ width: '35%', minWidth: '300px' }}
      onRequestClose={this.handleClose}>
      <SignUp />
    </Dialog>
            </div >
        );
  };
}

Support.propTypes = {
  history: PropTypes.object
}

export default Support;

import React, { Component } from 'react';
import './Overview.css';
import PropTypes  from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Signup from 'material-ui/svg-icons/action/account-circle';
import UserPreferencesStore from '../../stores/UserPreferencesStore';
import Dialog from 'material-ui/Dialog';
import PlayCircle from 'material-ui/svg-icons/av/play-circle-filled';
import Login from '../Auth/Login/Login.react';
import Chat from 'material-ui/svg-icons/communication/chat';
import { Link } from 'react-router-dom';
import SignUp from '../Auth/SignUp/SignUp.react';
import RaisedButton from 'material-ui/RaisedButton';
import Modal from 'react-modal';
import Close from 'material-ui/svg-icons/navigation/close';
import IconMenu from 'material-ui/IconMenu';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import $ from 'jquery'

class Overview extends Component {

    constructor(props) {
      super(props);
      this.state = {
        open: false,
        showOptions: false,
        login:false,
        signup:false,
        video:false,
        openDrawer: false,
        baseUrl: window.location.protocol + '//' + window.location.host + '/'

      };
    }
    componentDidMount(){
      var didScroll;
      var lastScrollTop = 0;
      var delta = 5;
      var navbarHeight = $('header').outerHeight();
      $(window).scroll(function(event){
          didScroll = true;
      });

      setInterval(function() {
          if (didScroll) {
              hasScrolled();
              didScroll = false;
          }
      }, 2500);

      function hasScrolled() {
          var st = $(window).scrollTop();

          // Make sure they scroll more than delta
          if(Math.abs(lastScrollTop - st) <= delta){

              return;
          }

          // If they scrolled down and are past the navbar, add class .nav-up.
          // This is necessary so you never see what is "behind" the navbar.
          if (st > lastScrollTop && st > navbarHeight){
              // Scroll Down
              $('header').removeClass('nav-down').addClass('nav-up');
          } else if(st + $(window).height() < $(document).height()) {
                  $('header').removeClass('nav-up').addClass('nav-down');
              }

          lastScrollTop = st;
      }

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
    handleToggle = () => this.setState({open: !this.state.open});

    handleClose = () => this.setState({open: false});

    handleTitle = () => {
      this.props.history.push('/');
    }
    handleVideo = () => this.setState({
      login:false,
      signup: false,
      video:true
    })
    handleLogin = () => this.setState({
      login:true,
      signup: false,
      video:false
    })
    handleClose = () => this.setState({
      login: false,
      signup: false,
      video:false
    })
    handleSignUp = () => this.setState({
      signup:true,
      login:false,
      video:false
    })
    _onReady(event) {
        // access to player in all event handlers via event.target
        event.target.pauseVideo();
    }
    handleDrawer = () => this.setState({openDrawer: !this.state.openDrawer});
    handleDrawerClose = () => this.setState({openDrawer: false});

    render() {
    const bodyStyle = {
      'padding': 0,
      textAlign: 'center'
    }
    const closingStyle ={
      position: 'absolute',
      zIndex: 120000,
      fill: '#fff',
      width: '40px',
      height: '40px',
      right: '20px',
      top: '20px',
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
      <FlatButton label="Overview"  href="/overview" style={{color:'#fff'}} className="topMenu-item"/>
      <FlatButton label="Docs" href="/docs" style={{color:'#fff'}} className="topMenu-item"/>
      <FlatButton label="Blog"  href="/blog" style={{color:'#fff'}} className="topMenu-item"/>
      <FlatButton label="Team"  href="/team" style={{color:'#fff'}} className="topMenu-item"/>
      </div>
      <IconMenu
        {...props}
        iconButtonElement={
          <IconButton iconStyle={{color:'#fff'}} ><MoreVertIcon /></IconButton>
        }

      >
      <MenuItem primaryText="Login"

                    onTouchTap={this.handleLogin} />
      <MenuItem primaryText="Sign Up"
                    onTouchTap={this.handleSignUp}
                    rightIcon={<Signup/>} />
      <MenuItem primaryText="Chat"
                    containerElement={<Link to="/logout" />}
                    rightIcon={<Chat/>}/>
      </IconMenu>
    </div>
    );


    return (
            <div>


              <header className="nav-down" id="headerSection">
              <AppBar
                className="topAppBar"
                title={<a href={this.state.baseUrl} ><img src="susi-white.svg" alt="susi-logo"
                className="siteTitle"/></a>}
                style={{backgroundColor:'#4285f4'}}
                onLeftIconButtonTouchTap={this.handleDrawer}
                iconElementRight={<TopMenu />}
              />
              </header>

            <Drawer
              docked={false}
              width={200}
              open={this.state.openDrawer}
              onRequestChange={(openDrawer) => this.setState({openDrawer})}
            >
              <AppBar
                title={<a href={this.state.baseUrl} ><img src="susi-white.svg" alt="susi-logo"
                className="siteTitle"/></a>}
                style={{backgroundColor:'#4285f4'}}
                onTouchTap={this.handleDrawerClose}/>
              <MenuItem onTouchTap={this.handleDrawerClose} className="drawerItem"><Link to="/overview">Overview</Link></MenuItem>
              <MenuItem onTouchTap={this.handleDrawerClose} className="drawerItem"><Link to="/docs">Docs</Link></MenuItem>
              <MenuItem onTouchTap={this.handleDrawerClose} className="drawerItem"><Link to="/blog">Blog</Link></MenuItem>
              <MenuItem onTouchTap={this.handleDrawerClose} className="drawerItem"><Link to="/teams">teams</Link></MenuItem>
            </Drawer>


              <div className='section'>
              <div className='section-container'>
                <div className="hero">
                  <img src='susi.gif' style={{margin: '20px 0'}} alt='Meet SUSI'/>
                  <h1>Meet SUSI, Your Personal Assistant.</h1>
                  <p>Ask it questions. Tell it to do things. Always ready to help.</p>
                  <a onClick={this.handleVideo} style={{color:'#3367d6',
                  cursor:'pointer',position:'relative'}}>
                    <PlayCircle style={{fill:'#3367d6',
                    marginRight:'50px'}} /><span className='watchStyle'>Watch</span>
                  </a>
                </div>
              </div>
              </div>
              <div className="section_copy">
                <div className="conversation__description">
                  <div className="description__heading">Ask it anything.</div>
                  <p className="description__text">
                  Search for the capital of Vietnam or
                  find translations in different languages.
                  Ask SUSI for your location, and
                  what the weather’s like when you get there.</p>
                </div>
                <div className='img-container'>
                  <img src='susi-test.gif' alt='susi-test' className='susi-test' />
                </div>
              </div>
              <div className="section_copy">
                <div className="conversation__description">
                  <div className="description__heading">Tell it to do things.</div>
                  <p className="description__text">
                  SUSI can listen to you through the Mic
                  and answer back on your Speaker.
                  You can activate the assistant saying
                  <b> &quot;Hi SUSI&quot;</b> already on many clients and devices.
                  The more you talk with SUSI the better it gets.
                  You can even tell SUSI to remember things.</p>
                </div>
                <div className='img-container'>
                  <img src='map-android.jpg' alt='Map' className='android-mockup' />
                </div>
              </div>
              <div className="section_copy">
                <div className="conversation__description">
                  <div className="description__heading">For your Smartphone</div>
                  <p className="description__text">SUSI is available for <b>Android</b>
                   &nbsp;and <b>iOS devices</b>.
                   Download the App to have access to SUSI on the go.</p>
                  <a href="https://github.com/fossasia/susi_android/raw/apk/susi-debug.apk"
                   className="playstore">Get It on Google Play</a>
                  <a href="https://github.com/fossasia/susi_iOS/"
                  className="appstore">Download on the App Store</a>
                </div>
                <div className='img-container'>
                  <img src='android-mockup.jpg' alt='Android Mockup' className='android-mockup' />
                </div>
              </div>

              <div className="section_copy">
                <div className="column_section">
                  <div className="conversation__description custom_description">
                    <div className='img-container'>
                      <img src='bots.jpg' alt='Android Mockup' className='bots-mockup' />
                    </div>
                    <div className="description__heading">On many Platforms</div>
                    <p className="description__text"><b>SUSI.AI</b> already runs on many chat
                    services and social networks. We are developing plugins for all
                    major services including
                    &nbsp;<a href='https://github.com/fossasia/susi_tweetbot'>Twitter</a>,
                    &nbsp;<a href='https://github.com/fossasia/susi_fbbot'>Facebook</a>,
                    &nbsp;<a href='https://github.com/fossasia/susi_linebot'>Line</a>,
                    &nbsp;<a href='https://github.com/fossasia/susi_slackbot'>Slack</a>,
                    &nbsp;<a href='https://github.com/fossasia/susi_wechatbot'>We Chat</a>,
                    &nbsp;<a href='https://github.com/fossasia/susi_viberbot'>Viber</a>,
                    &nbsp;<a href='https://github.com/fossasia/susi_gitterbot'>Gitter</a>.
                    Just set up SUSI on your channel and add
                    &nbsp;<b>@susi</b> in your conversations and SUSI is ready to help.
                    </p>
                    </div>
                </div>
                <div className="column_section">
                  <div className='img-container'>
                      <img src='all_devices.png' alt='Android Mockup' className='bots-mockup' />
                  </div>
                  <div className="conversation__description custom_description">
                    <div className="description__heading">For all Devices</div>
                    <p className="description__text"><b >SUSI.AI</b> is available for android, iOS devices and also you can use it from <Link to="http://chat.susi.ai">http://chat.susi.ai</Link>
                    </p>
                    </div>

                </div>
                <div className="column_section">
                  <div className="conversation__description custom_description">
                    <div className='img-container'>
                      <img src='many_languages.png' alt='Android Mockup' className='bots-mockup' />
                    </div>
                    <div className="description__heading">Use it in many Languages</div>
                    <p className="description__text">You can use <b>SUSI.AI</b> in DIfferent
                     languages
                    </p>
                    </div>

                </div>
              </div>{/* section_copy ends */}

               <div className="section_copy safty_and_secure">
                  <div className="conversation__description">

                  <div className="description__heading">Safe and secure.</div>
                    <p className="description__text"><b>SUSI.AI</b> is <b>
                    <Link style={{textDecoration:'none',color:'#000'}}
                    target="_blank" to="https://github.com/fossasia?utf8=%E2%9C%93&q=susi">Open Source</Link></b>. The code is
                    always available for security reviews and can be improved by
                    anyone with the knowledge and understanding online.</p>
                    <div className="opensource-logos">
                      <span className="opensource">
                        <Link to="https://opensource.org/" target="_blank">
                        <img src='open-source.png' alt='osi' />
                        </Link>
                      </span>
                      <span className="github_logo">
                        <Link to="https://github.com/fossasia?utf8=✓&q=susi" target="_blank">
                        <img src='GitHub-Mark.png' alt='ghlogo' />
                        </Link>
                      </span>
                    </div>
                  </div>
                  <div className='img-container'>
                    <img src='shield.svg' alt='Android Mockup'className='shield'  />
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
              {/* Login */}
              <Dialog
                className='dialogStyle'
                actions={actions}
                modal={true}
                open={this.state.login}
                autoScrollBodyContent={true}
                bodyStyle={bodyStyle}
                contentStyle={{width: '35%',minWidth: '300px'}}
                onRequestClose={this.handleClose}>
                <Login  />
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
              {/* Video */}
            <Modal
              isOpen={this.state.video}
              className="Video-Modal"
              onRequestClose={this.handleClose}
              contentLabel="Assistant Video"
              overlayClassName="Video-Overlay">
              <div className="video-container">
              <iframe id="player" type="text/html" frameBorder="0" allowFullScreen
  src="http://www.youtube.com/embed/tIG5griC-G0?enablejsapi=1&autoplay=1"></iframe>
              <Close style={closingStyle} onTouchTap={this.handleClose} />
              </div>
            </Modal>
            </div>
        );
    };
}

Overview.propTypes = {
  history: PropTypes.object
}

export default Overview;

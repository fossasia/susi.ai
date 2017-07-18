import React, { Component } from 'react';
import './Overview.css';
import PropTypes  from 'prop-types';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Signup from 'material-ui/svg-icons/action/account-circle';
import Popover from 'material-ui/Popover';
import UserPreferencesStore from '../../stores/UserPreferencesStore';
import Dialog from 'material-ui/Dialog';
import PlayCircle from 'material-ui/svg-icons/av/play-circle-filled';
import Login from '../Auth/Login/Login.react';
import Chat from 'material-ui/svg-icons/communication/chat';
import { Link } from 'react-router-dom';
import SignUp from '../Auth/SignUp/SignUp.react';
import RaisedButton from 'material-ui/RaisedButton';
import HeadRoom from 'react-headroom';
import Modal from 'react-modal';
import Close from 'material-ui/svg-icons/navigation/close';

class Overview extends Component {

    constructor(props) {
      super(props);
      this.state = {
        open: false,
        showOptions: false,
        login:false,
        signup:false,
        video:false
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
        UserPreferencesStore.getTheme()==='light' ? '#607D8B' : '#19314B'}
      labelColor="#fff"
      width='200px'
      keyboardFocused={true}
      onTouchTap={this.handleClose}
    />;
    return (
            <div>
              <HeadRoom>
              <Toolbar
                className='custom-app-bar'
                style={{
                  backgroundColor: '#607d8b',
                  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.12), inset 0 -1px 0 0 #E6E6E6',
                  height: '46px'
                }}>
                <ToolbarGroup >
                </ToolbarGroup>
                <ToolbarGroup lastChild={true} >
                <div>
                <IconButton
                  iconStyle={{ fill: '#fff', marginLeft:'-25px' }}
                  onTouchTap={this.showOptions}>
                  <MoreVertIcon />
                </IconButton>
                <Popover
                  style={{marginLeft:'-25px'}}
                  open={this.state.showOptions}
                  anchorEl={this.state.anchorEl}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                  onRequestClose={this.closeOptions}
                >
                  <MenuItem primaryText="Login"
                    onTouchTap={this.handleLogin} />
                  <MenuItem primaryText="Sign Up"
                    onTouchTap={this.handleSignUp}
                    rightIcon={<Signup/>} />
                  <MenuItem primaryText="Chat"
                    containerElement={<Link to="/logout" />}
                    rightIcon={<Chat/>}/>
                </Popover>
                </div>
                </ToolbarGroup>
              </Toolbar>
              </HeadRoom>
              <div className='section'>
              <div className='section-container'>
                <div className="hero">
                  <img src='susi.gif' style={{margin: '20px 0'}} alt='Meet SUSI'/>
                  <h1>Meet SUSI, Your Personal Assistant.</h1>
                  <p>Ask it questions. Tell it to do things. Always ready to help.</p>
                  <a onClick={this.handleVideo} style={{color:'#3367d6',
                  marginLeft: '-35px',marginTop:'20px'}}>
                    <PlayCircle style={{fill:'#3367d6',
                    marginRight:'5px'}} /><span className='watchStyle'>Watch</span>
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
                  <div className="description__heading">For all Devices</div>
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
                <div className="conversation__description custom_description">
                  <div className="description__heading">Integrate
                  SUSI with your
                  favorite chat services and social networks.</div>
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
                   &nbsp;<b>@susi</b> in your conversations and SUSI is ready to help.</p>
                   </div>
                <div className='img-container'>
                  <img src='bots.jpg' alt='Android Mockup' className='bots-mockup' />
                </div>
              </div>
              <div className="section_copy">
                <div className="conversation__description">
                  <div className="description__heading">Safe and secure.</div>
                  <p className="description__text"><b>SUSI.AI</b> is <b>Open Source</b>. The code is
                  always available for security reviews and can be improved by
                  anyone with the knowledge and understanding online.</p>
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

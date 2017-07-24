import React, { Component } from 'react';
import './Team.css';
import PropTypes  from 'prop-types';
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
import IconMenu from 'material-ui/IconMenu';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import Close from 'material-ui/svg-icons/navigation/close';
import $ from 'jquery';
import team from './TeamList';
import {Card, CardActions, CardMedia, CardTitle} from 'material-ui/Card';

class Support extends Component {

    constructor(props) {
      super(props);
      this.state = {
        open: false,
        showOptions: false,
        login:false,
        signup:false,
        openDrawer: false,
        baseUrl: window.location.protocol + '//' + window.location.host + '/',
        team: team
      };
    }
    showOptions = (event) => {
      event.preventDefault();
      this.setState({
        showOptions: true,
        anchorEl: event.currentTarget
    })
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
    closeOptions = () => {
      this.setState({
        showOptions: false,
      });
    };
    handleToggle = () => this.setState({open: !this.state.open});
    handleDrawer = () => this.setState({openDrawer: !this.state.openDrawer});
    handleDrawerClose = () => this.setState({openDrawer: false});
    handleTitle = () => {
      this.props.history.push('/');
    }
    handleLogin = () => this.setState({
      login:true,
      signup: false
    })
    handleClose = () => this.setState({
      login: false,
      signup: false,
      open: false
    })
    handleSignUp = () => this.setState({
      signup:true,
      login:false
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
    const overlayStyle = {
      paddingTop : '0px',

    }
    const TopMenu = (props) => (
    <div>
      <div className="top-menu">
      <FlatButton label="Overview"  href="/overview" style={{color:'#fff'}} className="topMenu-item"/>
      <FlatButton label="Docs" href="http://dev.susi.ai" style={{color:'#fff'}} className="topMenu-item"/>
      <FlatButton label="Blog"  href="/blog" style={{color:'#fff'}} className="topMenu-item"/>
      <FlatButton label="Support"  href="/support" style={{color:'#fff'}} className="topMenu-item"/>
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
    let mentors = team[0].mentors.map((mentor,i)=>{
      return (
        <Card className='team-card' key={i}>
          <CardMedia
            overlay={<CardTitle style={overlayStyle} title={mentor.name} />}
          >
            <img src={mentor.avatar} alt={mentor.name} />
          </CardMedia>
          <CardActions>
            <FlatButton
                  href={mentor.github}
                  target="_blank"
                  label="GitHub"
                  icon={<FontIcon className="muidocs-icon-github" />}
                />
          </CardActions>
        </Card>)
    })
    let server = team[1].server.map((serv,i)=>{
      return (
        <Card className='team-card' key={i}>
          <CardMedia
            overlay={<CardTitle style={overlayStyle} title={serv.name} />}
          >
            <img src={serv.avatar} alt={serv.name} />
          </CardMedia>
          <CardActions>
            <FlatButton
                  href={serv.github}
                  target="_blank"
                  label="GitHub"
                  icon={<FontIcon className="muidocs-icon-github" />}
                />
          </CardActions>
        </Card>)
    })
    let web = team[3].web.map((webTeam,i)=>{
      return (
        <Card className='team-card' key={i}>
          <CardMedia
            overlay={<CardTitle style={overlayStyle} title={webTeam.name} />}
          >
            <img src={webTeam.avatar} alt={webTeam.name} />
          </CardMedia>
          <CardActions>
            <FlatButton
                  href={webTeam.github}
                  target="_blank"
                  label="GitHub"
                  icon={<FontIcon className="muidocs-icon-github" />}
                />
          </CardActions>
        </Card>)
    })
    let android = team[2].android.map((member,i)=>{
      return (
        <Card className='team-card' key={i}>
          <CardMedia
            overlay={<CardTitle style={overlayStyle} title={member.name} />}
          >
            <img src={member.avatar} alt={member.name} />
          </CardMedia>
          <CardActions>
            <FlatButton
                  href={member.github}
                  target="_blank"
                  label="GitHub"
                  icon={<FontIcon className="muidocs-icon-github" />}
                />
          </CardActions>
        </Card>)
    })
    let ios = team[4].ios.map((member,i)=>{
      return (
        <Card className='team-card' key={i}>
          <CardMedia
            overlay={<CardTitle style={overlayStyle} title={member.name} />}
          >
            <img src={member.avatar} alt={member.name} />
          </CardMedia>
          <CardActions>
            <FlatButton
                  href={member.github}
                  target="_blank"
                  label="GitHub"
                  icon={<FontIcon className="muidocs-icon-github" />}
                />
          </CardActions>
        </Card>)
    })
    let hardware = team[5].hardware.map((member,i)=>{
      return (
        <Card className='team-card' key={i}>
          <CardMedia
            overlay={<CardTitle style={overlayStyle} title={member.name} />}
          >
            <img src={member.avatar} alt={member.name} />
          </CardMedia>
          <CardActions>
            <FlatButton
                  href={member.github}
                  target="_blank"
                  label="GitHub"
                  icon={<FontIcon className="muidocs-icon-github" />}
                />
          </CardActions>
        </Card>)
    })
    let bots = team[6].bots.map((member,i)=>{
      return (
        <Card className='team-card' key={i}>
          <CardMedia
            overlay={<CardTitle style={overlayStyle} title={member.name} />}
          >
            <img src={member.avatar} alt={member.name} />
          </CardMedia>
          <CardActions>
            <FlatButton
                  href={member.github}
                  target="_blank"
                  label="GitHub"
                  icon={<FontIcon className="muidocs-icon-github" />}
                />
          </CardActions>
        </Card>)
    })
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
              <MenuItem onTouchTap={this.handleDrawerClose} className="drawerItem"><a href="http://dev.susi.ai">Docs</a></MenuItem>
              <MenuItem onTouchTap={this.handleDrawerClose} className="drawerItem"><Link to="/blog">Blog</Link></MenuItem>
              <MenuItem onTouchTap={this.handleDrawerClose} className="drawerItem"><Link to="/team">Team</Link></MenuItem>
              <MenuItem onTouchTap={this.handleDrawerClose} className="drawerItem"><Link to="/support">Support</Link></MenuItem>
            </Drawer>
            <div className="section-team grey-background">
                <div className='section-container-team'>
                  <div className="team-header">
                    <div className="support__heading center">Team <b>SUSI.AI</b></div>
                  </div>
                </div>
              </div>
              <div className="section-team">

                <div className="team-header">
                  <div className="support__heading">Project Founders</div>
                </div>
                <div className='team-container'>{mentors}</div>
              </div>
              <div className="section-team" style={{
                paddingBottom: '240px'}}>

                <div className="team-header">
                  <div className="support__heading">Developers</div>

                </div>

                <div className='team-container'>{server}{web}
                {android}{ios}{hardware}{bots}</div>

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
                <Close style={closingStyle} onTouchTap={this.handleClose} />
              </Dialog>
            </div>
        );
    };
}

Support.propTypes = {
  history: PropTypes.object
}

export default Support;

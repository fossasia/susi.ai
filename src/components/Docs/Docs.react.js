import React, { Component } from 'react';
import './Docs.css';
import PropTypes  from 'prop-types';
import PieChart from 'react-svg-piechart';
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
import Modal from 'react-modal';
import Close from 'material-ui/svg-icons/navigation/close';
import IconMenu from 'material-ui/IconMenu';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import $ from 'jquery'

class Overview extends Component {

    constructor(props) {
        //  var st = $(window).scrollTop();
       // console.log('st const', st )
      super(props);
      this.state = {
        open: false,
        showOptions: false,
        login:false,
        signup:false,
        video:false,
        openDrawer: false,
        expandedSector: null,
      };
      this.handleMouseEnterOnSector = this.handleMouseEnterOnSector.bind(this)
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

    handleMouseEnterOnSector(sector) {
        this.setState({expandedSector: sector})
    }

    render() {
    const bodyStyle = {
      'padding': 0,
      textAlign: 'center'
    }
    const urlStyle = {
      textDecoration: 'none'
    }
    const {expandedSector} = this.state;

    const data=[
      {label: 'JavaScript', value: 85.7, color: '#3b5998'},
      {label: 'CSS', value: 12.7, color: '#00aced'},
      {label: 'Others', value: 1.6, color: '#dd4b39'}
    ];

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
        UserPreferencesStore.getTheme()==='light' ? '#0084ff' : '#19314B'}
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
                title={<img src="susi-white.svg" alt="susi-logo"
                className="siteTitle"/>}
                style={{backgroundColor:'#0084ff'}}
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
                title={<img src="susi-white.svg" alt="susi-logo"
                className="siteTitle"/>}
                style={{backgroundColor:'#0084ff'}}
                onTouchTap={this.handleDrawerClose}/>
              <MenuItem onTouchTap={this.handleDrawerClose} className="drawerItem"><Link to="/overview">Overview</Link></MenuItem>
              <MenuItem onTouchTap={this.handleDrawerClose} className="drawerItem"><Link to="/docs">Docs</Link></MenuItem>
              <MenuItem onTouchTap={this.handleDrawerClose} className="drawerItem"><Link to="/blog">Blog</Link></MenuItem>
              <MenuItem onTouchTap={this.handleDrawerClose} className="drawerItem"><Link to="/teams">teams</Link></MenuItem>
            </Drawer>


              <div className='hero'>
              <div className='section-container'>
                <img className="dev_image" src='susi-developer.png' style={{margin: '20px 0'}} alt='SUSI Developers'/>
                <h1>Developer Guide</h1>
                <p>Guide for developers looking to contribute to SUSI.AI Web Chat</p>
              </div>
              </div>
              <div className="section_copy">
                <div className="conversation__description">
                  <div className="description__heading">SUSI.AI</div>
                  <p className="description__text">Susi is an artificial intelligence combining
                    pattern matching, internet data, data flow principles and
                    inference engine principles. It will have some reflection
                    abilities and it will be able to remember the users input to
                    produce deductions and a personalized feed-back. Its purpose
                    is to explore the abilities of an artificial companion and to
                    answer the remaining unanswered questions. The SUSI.AI web chat
                     is a front-end that is developed for web access of SUSI.</p>
                </div>
                <div className='img-container'>
                  <img src='susi.svg' alt='React' />
                </div>
              </div>
              <div className="section_copy">
                <div className="conversation__description">
                  <div className="description__heading">Language Breakdown</div>
                  <p className="description__text">
                  We have used JavaScript,CSS and some other languages
                  for developing SUSI.AI Web Chat. Here is a pie chart
                  representing the exact breakdown ratio from github repository </p>
                </div>
                <div className='img-container'>
                  <PieChart
                    data={data}
                    expandedSector={expandedSector}
                    onSectorHover={this.handleMouseEnterOnSector}
                    sectorStrokeWidth={2}
                    expandOnHover
                    shrinkOnTouchEnd
                  />
                <div className="piechart_data">
                  {
                      data.map((element, i) => (
                          <div key={i}>
                              <span style={{fontWeight: this.state.expandedSector === i ? 'bold' : null}}>
                                  {element.label} : {element.value+ ' %'}
                              </span>
                          </div>
                      ))
                  }
                  </div>
                </div>
              </div>
              <div className="section_copy">
                <div className="conversation__description">
                  <div className="description__heading">Frameworks Used</div>
                  <p className="description__text">
                  SUSI.AI is developed using<b> React.js</b>. React is a JavaScript
                  library used for building User Interfaces</p>
                </div>
                <div className='img-container'>
                  <img src='react.svg' alt='React' />
                </div>
              </div>
              <div className="section_center">
                <div className="center__description">
                  <div className="description__heading">Running on Local Host</div>
                    <ul className="description__text">
                      <li>Fork chat.susi.ai <a style={urlStyle} href="https://github.com/fossasia/chat.susi.ai/">repository</a> and
                         clone it to your desktop and cd into that cloned folder.
                      </li>
                      <li> Install all the dependencies by running :</li>
                      <code className="code_box">$ npm install</code>
                      <li> Run on http://localhost:3000 by running :</li>
                      <code className="code_box">$ npm run start</code>
                      <li>Build locally by running : </li>
                      <code className="code_box">$ npm run build</code>
                      <li>To deploy at a url use :</li>
                      <code className="code_box">$ npm run deploy</code>
                    </ul>
                </div>
              </div>
              <div className="section_center">
                <div className="center__description">
                  <div className="description__heading">Connecting to SUSI Hardware</div>
                    <ul className="description__text">
                      <li>Configure your Susi Hardware Device using instructions <a style={urlStyle}  href="https://github.com/fossasia/susi_hardware">here</a> </li>
                      <li> Go to settings and then Connect to Susi Hardware</li>
                      <li>Add the default WebSocket URL for your Susi Hardwre Device.
                         If you are using webchat on the same device as Susi Hardware,
                         it will be ws://127.0.0.1:9001 . Default port is 9001,
                         unless configured otherwise.
                       </li>
                      <li> On successful connection, you will get a confirmation alert.
                         After that, all your queries to your Susi Hardware Device and
                          their results will show up on Susi Webchat.
                      </li>
                    </ul>
                </div>
              </div>
              <div className="section_center">
                <div className="center__description">
                  <div className="description__heading">Contribution Guidelines</div>
                    <p className="description__text">
                      We at FOSSASIA follow certain guidelines to maintain our codebase.
                      Please read the best practises and other
                      instructions <a style={urlStyle}  href="http://blog.fossasia.org/open-source-developer-guide-and-best-practices-at-fossasia/">here</a>
                    </p>
                </div>
              </div>
              <div className="section_copy">
                <div className="conversation__description">
                  <div className="description__heading"></div>
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

import React, { Component } from 'react';
import susiWhite from '../../images/susi-logo-white.png';
import PropTypes from 'prop-types';
import Signup from 'material-ui/svg-icons/action/account-circle';
import Drawer from 'material-ui/Drawer';
import IconMenu from 'material-ui/IconMenu';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import { Link } from 'react-router-dom';
import Chat from 'material-ui/svg-icons/communication/chat';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import $ from 'jquery';
import Dialog from 'material-ui/Dialog';
import Close from 'material-ui/svg-icons/navigation/close';
import SignUp from '../Auth/SignUp/SignUp.react';
import Login from '../Auth/Login/Login.react';
import Popover from 'material-ui/Popover';
import ForgotPassword from '../Auth/ForgotPassword/ForgotPassword.react';
import Cookies from 'universal-cookie';
import Exit from 'material-ui/svg-icons/action/exit-to-app';


const cookies = new Cookies();

let Logged = (props) => (
    <div>
        <MenuItem primaryText="Login"
            onTouchTap={this.handleLogin} />
        <MenuItem primaryText="Sign Up"
            onTouchTap={this.handleSignUp}
            rightIcon={<Signup />} />
        <MenuItem primaryText="Chat"
            containerElement={<Link to="/logout" />}
            rightIcon={<Chat />} />
    </div>
)
class StaticAppBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            baseUrl: window.location.protocol + '//' + window.location.host + '/',
            login: false,
            signup: false,
            open: false,
            showOptions: false,
            anchorEl: null,
            openForgotPassword: false
        };
    }

    handleDrawer = () => this.setState({ openDrawer: !this.state.openDrawer });
    handleDrawerClose = () => this.setState({ openDrawer: false });
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

    handleTitle = () => {
        this.props.history.push('/');
    }

    handleLogin = () => {
        this.setState({
            login: true,
            signup: false,
            showOptions: false
        })
        if (this.props.location.pathname === 'overview') {
            this.props.closeVideo();
        }
    }
    handleClose = () => {
        this.setState({
            login: false,
            signup: false,
            openForgotPassword: false,
            showOptions: false
        })
        if (this.props.location.pathname === 'overview') {
            this.props.closeVideo();
        }
    }
    handleSignUp = () => {
        this.setState({
            signup: true,
            login: false,
            showOptions: false
        })
        if (this.props.location.pathname === 'overview') {
            this.props.closeVideo();
        }
    }

    handleScroll = (event) => {
        let scrollTop = event.srcElement.body.scrollTop,
            itemTranslate = scrollTop > 60;
        if (itemTranslate) {
            this.closeOptions();
        }
    }
    handleForgotPassword = () => {
        this.setState({
            openForgotPassword: true,
            login: false
        });
    }
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);

        var didScroll;
        var lastScrollTop = 0;
        var delta = 5;
        var navbarHeight = $('header').outerHeight();
        $(window).scroll(function (event) {
            didScroll = true;
        });

        setInterval(function () {
            if (didScroll) {
                hasScrolled();
                didScroll = false;
            }
        }, 500);

        function hasScrolled() {
            var st = $(window).scrollTop();
            // Make sure they scroll more than delta
            if (Math.abs(lastScrollTop - st) <= delta) {

                return;
            }

            // If they scrolled down and are past the navbar, add class .nav-up.
            // This is necessary so you never see what is "behind" the navbar.
            if (st > lastScrollTop && st > navbarHeight + 400) {
                // Scroll Down
                $('header').removeClass('nav-down').addClass('nav-up');
            } else if (st + $(window).height() < $(document).height()) {
                $('header').removeClass('nav-up').addClass('nav-down');
            }

            lastScrollTop = st;
        }
        // Check Logged in
        if (cookies.get('loggedIn')) {
            Logged = (props) => (
                <div>

                    <MenuItem primaryText="Logout"
                        containerElement={<Link to="/logout" />}
                        rightIcon={<Exit />} />
                </div>
            )
            return <Logged />
        }
Logged = (props) => (
    <div>
        <MenuItem primaryText="Login"
            onTouchTap={this.handleLogin} />
        <MenuItem primaryText="Sign Up"
            onTouchTap={this.handleSignUp}
            rightIcon={<Signup />} />
        <MenuItem primaryText="Chat"
            containerElement={<Link to="/logout" />}
            rightIcon={<Exit />} />
    </div>
)
return <Logged />
    }

    render() {
        const closingStyle = {
            position: 'absolute',
            zIndex: 1200,
            fill: '#444',
            width: '26px',
            height: '26px',
            right: '10px',
            top: '10px',
            cursor: 'pointer'
        }
        let TopRightMenu = (props) => (
            <div onScroll={this.handleScroll}>
                <div>
                    <IconMenu
                        {...props}
                        iconButtonElement={
                            <IconButton
                                iconStyle={{ fill: 'white' }}><MoreVertIcon /></IconButton>
                        }
                        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                        onTouchTap={this.showOptions}
                    >
                    </IconMenu>
                    <Popover
                        {...props}
                        style={{ float: 'right', position: 'relative', right: '0px', margin: '46px 20px 0 0' }}
                        open={this.state.showOptions}
                        anchorEl={this.state.anchorEl}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                        onRequestClose={this.closeOptions}
                    >
                        <Logged />
                    </Popover>

                </div>
            </div>
        );
        const bodyStyle = {
            'padding': 0,
            textAlign: 'center'
        }
        const closingStyleLogin = {
            position: 'absolute',
            zIndex: 1200,
            fill: '#444',
            width: '26px',
            height: '26px',
            right: '10px',
            top: '10px',
            cursor: 'pointer'
        };
        const labelStyle = {
            padding: '0px 25px 15px 25px',
            font: '500 14px Roboto,sans-serif',
            margin: '0 2px',
            textTransform: 'none',
            wordSpacing: '2px',
            color: '#f2f2f2'
        }

        const linkstyle = {
            color: '#fff',
            height: '64px',
            textDecoration: 'none'
        }
        var topLinks = [
            {
                lable: 'Overview',
                url: '/overview',
                style: linkstyle,
                labelStyle: labelStyle
            },
            {
                lable: 'Skills',
                url: 'http://skills.susi.ai/',
                style: linkstyle,
                labelStyle: labelStyle
            },
            {
                lable: 'Blog',
                url: '/blog',
                style: linkstyle,
                labelStyle: labelStyle
            },
            {
                lable: 'Team',
                url: '/team',
                style: linkstyle,
                labelStyle: labelStyle
            },
            {
                lable: 'Support',
                url: '/support',
                style: linkstyle,
                labelStyle: labelStyle
            },
        ];

        let navLlinks = topLinks.map((link, i) => {
            if (this.props.location.pathname === link.url) {
                link.labelStyle = {
                    borderBottom: '2px solid #fff',
                    padding: '0px 25px 12px 25px',
                    margin: '0 2px',
                    font: '700 14px Roboto,sans-serif',
                    wordSpacing: '2px',
                    textTransform: 'none'
                };
            }
            return (
                <FlatButton
                    disableTouchRipple={true}
                    key={i} labelStyle={link.labelStyle}
                    hoverColor="none" label={link.lable} href={link.url} style={link.style}
                    className="topMenu-item" />
            )
        });
        let menuLlinks = topLinks.map((link, i) => {
            if (this.props.location.pathname === link.url) {
                link.labelStyle = {
                    font: '700 14px Roboto,sans-serif',
                    wordSpacing: '2px',
                    textTransform: 'none',
                    borderBottom: '3px solid #fff',
                    padding: '0px 20px 16px 20px',
                    margin: '0 1px'
                };
            }
            return (
                <MenuItem key={i} onTouchTap={this.handleDrawerClose} className="drawerItem"><Link to={link.url}>{link.lable}</Link></MenuItem>
            )
        });
        const TopMenu = (props) => (
            <div style={{ position: 'relative', top: '-6px' }}>
                <div className="top-menu" style={{ position: 'relative', left: '46px' }}>
                    {navLlinks}
                </div>
            </div>
        );

        return (
            <div>
                <header className="nav-down" id="headerSection">
                    <AppBar
                        className="topAppBar"
                        title={<div><a href={this.state.baseUrl} style={{ float: 'left', marginTop: '-10px' }}>
                            <img src={susiWhite} alt="susi-logo" className="siteTitle" /></a><TopMenu /></div>}
                        style={{
                            backgroundColor: '#4285f4', height: '46px',
                            boxShadow: 'none'
                        }}
                        onLeftIconButtonTouchTap={this.handleDrawer}
                        iconStyleLeft={{ marginTop: '-2px' }}
                        iconStyleRight={{ marginTop: '-2px' }}
                        iconElementRight={<TopRightMenu />}
                    />
                </header>
                <Drawer
                    docked={false}
                    width={200}
                    open={this.state.openDrawer}
                    onRequestChange={(openDrawer) => this.setState({ openDrawer })}
                >
                    <AppBar
                        title={<a href={this.state.baseUrl} ><img src={susiWhite} alt="susi-logo"
                            className="siteTitle" /></a>}
                        style={{ backgroundColor: '#4285f4' }}
                        onTouchTap={this.handleDrawerClose} />
                    {menuLlinks}
                </Drawer>
                {/* Login */}
                <Dialog
                    className='dialogStyle'
                    modal={true}
                    open={this.state.login}
                    autoScrollBodyContent={true}
                    bodyStyle={bodyStyle}
                    contentStyle={{ width: '35%', minWidth: '300px' }}
                    onRequestClose={this.handleClose}>
                    <Login {...this.props}
                        handleForgotPassword={this.handleForgotPassword} />
                    <Close style={closingStyleLogin} onTouchTap={this.handleClose} />
                </Dialog>
                {/* SignUp */}
                <Dialog
                    className='dialogStyle'
                    modal={true}
                    open={this.state.signup}
                    autoScrollBodyContent={true}
                    bodyStyle={bodyStyle}
                    contentStyle={{ width: '35%', minWidth: '300px' }}
                    onRequestClose={this.handleClose}>
                    <SignUp {...this.props}
                        onRequestClose={this.handleClose}
                        onLoginSignUp={this.handleLogin} />
                    <Close style={closingStyle}
                        onTouchTap={this.handleClose} />
                </Dialog>
                <Dialog
                    className='dialogStyle'
                    modal={false}
                    open={this.state.openForgotPassword}
                    autoScrollBodyContent={true}
                    contentStyle={{ width: '35%', minWidth: '300px' }}
                    onRequestClose={this.handleClose}>
                    <ForgotPassword {...this.props}
                        showForgotPassword={this.showForgotPassword} />
                    <Close style={closingStyle}
                        onTouchTap={this.handleClose} />
                </Dialog>
            </div>
        );
    }

}
StaticAppBar.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    closeVideo: PropTypes.func
}
export default StaticAppBar;

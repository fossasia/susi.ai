import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
import './NotFound.css';
import LogoImg from '../images/susi.svg';
import UserPreferencesStore from '../../stores/UserPreferencesStore';
import Login from '../Auth/Login/Login.react';
import SignUp from '../Auth/SignUp/SignUp.react';
import Dialog from 'material-ui/Dialog';


export default class NotFound extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            loginOpen: false
        }
    }
    handleOpen = () => {
        this.setState({ open: true });
    };
    handleClose = () => {
        this.setState({ open: false });
    };
    handleLoginOpen = () => {
        this.setState({
            loginOpen: true
        })
    }
    handleLoginClose = () => {
        this.setState({
            loginOpen: false
        })
    }

    render() {
        const loginActions = <RaisedButton
          label="Cancel"
          backgroundColor={
            UserPreferencesStore.getTheme()==='light' ? '#607D8B' : '#19314B'}
          labelColor="#fff"
          width='200px'
          keyboardFocused={true}
          onTouchTap={this.handleLoginClose}
        />;
        const signUpActions = <RaisedButton
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
                <div className='container-fluid not-found-banner'>
                    <h2 >
                        <a className='susilogo'  >
                            <img
                                src={LogoImg}
                                to={'/'}
                                alt='Page Not Found' />
                        </a>
                    </h2>
                    <h1>404</h1>
                    <h2>Page not found</h2>
                    <div className='button-wrapper'>
                        <Link to={'/'} className='actionButton'>
                            <RaisedButton
                                className='notfound-button'
                                label='Chat With SUSI'
                                backgroundColor={
                                UserPreferencesStore.getTheme() ? '#607D8B' : '#19314B'}
                                labelColor='#fff'
                            />
                        </Link>
                        <RaisedButton
                                className='notfound-button'
                                label='SignUp to SUSI'
                                onTouchTap={this.handleOpen}
                                backgroundColor={
                                UserPreferencesStore.getTheme() ? '#607D8B' : '#19314B'}
                                labelColor='#fff'
                        />
                        <br/>
                        <RaisedButton
                            className='notfound-button'
                            label='SignIn to SUSI'
                            onTouchTap={this.handleLoginOpen}
                            backgroundColor={
                                UserPreferencesStore.getTheme() ? '#607D8B' : '#19314B'}
                            labelColor='#fff'
                        />
                    </div>
                </div>
                <Dialog
                  className='dialogStyle'
                  actions={loginActions}
                  modal={false}
                  open={this.state.loginOpen}
                  autoScrollBodyContent={true}
                  contentStyle={{width: '35%',minWidth: '300px'}}>
                  <Login {...this.props} />
                </Dialog>
                <Dialog
                  className='dialogStyle'
                  actions={signUpActions}
                  modal={false}
                  open={this.state.open}
                  autoScrollBodyContent={true}
                  contentStyle={{width: '35%',minWidth: '300px'}}>
                  <SignUp {...this.props} />
                </Dialog>

            </div>

        );
    };
}

import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
import './NotFound.css';
import LogoImg from '../images/susi.svg';
import UserPreferencesStore from '../../stores/UserPreferencesStore';
import LoginDialog from '../ChatApp/Dialog/LoginDialog';

export default class NotFound extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        }
    }
    handleOpen = () => {
        this.setState({ open: true });
    };
    handleClose = () => {
        this.setState({ open: false });
    };
      switchDialog = (dialogState) => {
    this.setState({ open: dialogState });
  };
    render() {

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
                        <Link to={'/signup'} className='actionButton'>
                            <RaisedButton
                                className='notfound-button'
                                label='SignUp to SUSI'
                                backgroundColor={
                                UserPreferencesStore.getTheme() ? '#607D8B' : '#19314B'}
                                labelColor='#fff'
                            />
                        </Link>
                        <RaisedButton
                            className='notfound-button'
                            label='SignIn to SUSI'
                            onTouchTap={this.handleOpen}
                            backgroundColor={
                                UserPreferencesStore.getTheme() ? '#607D8B' : '#19314B'}
                            labelColor='#fff'
                        />
                    </div>
                </div>
            <LoginDialog open={this.state.open} switchDialog={this.switchDialog} />

            </div>

        );
    };
}

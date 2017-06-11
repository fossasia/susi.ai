import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
import './NotFound.css';
import LogoImg from '../images/susi.svg';
import SettingStore from '../../stores/SettingStore';
import Dialog from 'material-ui/Dialog';
import Login from '../Auth/Login/Login.react';

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
    render() {
        const actions = <RaisedButton
            label="Cancel"
            backgroundColor={
                SettingStore.getTheme() ? '#607D8B' : '#19314B'}
            labelColor='#fff'
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
                                alt='Page Not Found'  />
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
    SettingStore.getTheme() ? '#607D8B' : '#19314B'}
                                labelColor='#fff'
                            />
                        </Link>
                        <Link to={'/signup'} className='actionButton'>
                            <RaisedButton
                                className='notfound-button'
                                label='SignUp to SUSI'
backgroundColor={
    SettingStore.getTheme() ? '#607D8B' : '#19314B'}
                                labelColor='#fff'
                            />
                        </Link>
                        <RaisedButton
                            className='notfound-button'
                            label='SignIn to SUSI'
                            onTouchTap={this.handleOpen}
                            backgroundColor={
                                SettingStore.getTheme() ? '#607D8B' : '#19314B'}
                            labelColor='#fff'
                        />
                    </div>
                </div>
                <Dialog
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    autoScrollBodyContent={true}
                    onRequestClose={this.handleClose}>
                    <div><Login /></div>
                </Dialog>
            </div>

        );
    };
}

import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
import './NotFound.css';
import LogoImg from '../images/susi.svg';
import userPreferencesStore from '../../stores/UserPreferencesStore';
import Dialog from 'material-ui/Dialog';
import Login from '../Auth/Login/Login.react';
import UserPreferencesStore from '../../stores/UserPreferencesStore';

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
        UserPreferencesStore.getTheme()==='light' ? '#607D8B' : '#19314B'}
      labelColor="#fff"
      width='200px'
      keyboardFocused={true}
      onTouchTap={this.handleClose}
    />;
    const bodyStyle = {
            'padding': 0,
            textAlign: 'center'
        }
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
                                userPreferencesStore.getTheme() ? '#607D8B' : '#19314B'}
                                labelColor='#fff'
                            />
                        </Link>
                        <Link to={'/signup'} className='actionButton'>
                            <RaisedButton
                                className='notfound-button'
                                label='SignUp to SUSI'
                                backgroundColor={
                                userPreferencesStore.getTheme() ? '#607D8B' : '#19314B'}
                                labelColor='#fff'
                            />
                        </Link>
                        <RaisedButton
                            className='notfound-button'
                            label='SignIn to SUSI'
                            onTouchTap={this.handleOpen}
                            backgroundColor={
                                userPreferencesStore.getTheme() ? '#607D8B' : '#19314B'}
                            labelColor='#fff'
                        />
                    </div>
                </div>
                <Dialog
                    className='dialogStyle'
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    autoScrollBodyContent={true}
                    bodyStyle={bodyStyle}
                    contentStyle={{ width: '35%', minWidth: '300px' }}
                    onRequestClose={this.handleClose}>
                    <Login {...this.props} />
                </Dialog>
            </div>

        );
    };
}

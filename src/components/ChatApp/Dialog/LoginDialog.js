import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import Login from '../../Auth/Login/Login.react';
import PropTypes from 'prop-types';

export default class LoginDialog extends React.Component {


    handleClose = () => {
       this.props.switchDialog(false);
    };

    render() {
        this.state = { open: this.props.open }
        const actions = <RaisedButton
            label="Cancel"
            backgroundColor={
                UserPreferencesStore.getTheme() === 'light' ? '#607D8B' : '#19314B'}
            labelColor="#fff"
            width='200px'
            keyboardFocused={true}
            onTouchTap={this.handleClose}
        />;

        const bodyStyle = {
            'padding': 0,
            textAlign: 'center'
        }
        console.log(this.state.open);

        return (
            <Dialog
                className='dialogStyle'
                actions={actions}
                modal={false}
                open={this.props.open}
                autoScrollBodyContent={true}
                bodyStyle={bodyStyle}
                contentStyle={{ width: '35%', minWidth: '300px' }}
                onRequestClose={this.handleClose}>
                <Login {...this.props} />
            </Dialog>
        );
    }

};
LoginDialog.propTypes = {

    open: PropTypes.bool,
    switchDialog: PropTypes.func
};

import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import userPreferencesStore from '../../../stores/UserPreferencesStore';
import Login from '../../Auth/Login/Login.react';
import PropTypes from 'prop-types';

export default class LoginDialog extends React.Component {
    constructor(props) {
        super(props);
        console.log(props.open)
        this.state={open:this.props.open}
        console.log(this.state)

    }
    handleClose = () => {
                    //  console.log(this.props.open)
this.setState({open:false});
    };

    render() {
       // this.getInitState();
        const actions = <RaisedButton
            label="Cancel"
            backgroundColor={
                userPreferencesStore.getTheme() ? '#607D8B' : '#19314B'}
            labelColor='#fff'
            keyboardFocused={true}
            onTouchTap={this.handleClose}
        />;
                    console.log(this.state.open);

        return (
            <Dialog
                actions={actions}
                modal={false}
                open={this.state.open}
                autoScrollBodyContent={true}
                onRequestClose={this.handleClose}>
                <div><Login /></div>
            </Dialog>
        );
    }

};
LoginDialog.propTypes = {
    open: PropTypes.bool
};

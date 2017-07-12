import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TextField, IconButton, FlatButton} from 'material-ui'
import ExitIcon from 'material-ui/svg-icons/navigation/close';

class CustomServerComponent extends Component{

    constructor(props) {
        super(props);
        this.state = {showServerURLField: false};
    }

    onClick = () => {
        this.setState({
            showServerURLField: !this.state.showServerURLField
        });
        if(!this.state.showServerURLField){
            this.props.activateCustomServer();
        }
        else{
            this.props.exitCustomServer();
        }
    }

    onChange = (event) => {
        this.props.onServerURLChange(event);
    }

    render() {

    let divStyle = {};
    divStyle.display =  'inline';

    if(this.state.showServerURLField){
        return (
            <div style={divStyle}>
                <TextField
                    name='serverUrl'
                    floatingLabelText="Custom URL"
                    value={this.props.serverURL}
                    errorText={this.props.errorText}
                    onChange={(event) => this.onChange(event)}
                    autoFocus/>
                    {false && (
                    <IconButton
                        className='displayCloseNone'
                        onClick={this.onClick}>
                        <ExitIcon />
                    </IconButton>)}
            </div>
        );
    }
    return (
            <div style={divStyle}>
                <FlatButton
                    className='settingsBtns'
                    label="Custom Server"
                    onClick={this.onClick} />
            </div>
        );
    }
};

CustomServerComponent.propTypes = {
    activateCustomServer: PropTypes.func,
    exitCustomServer: PropTypes.func,
    onServerURLChange: PropTypes.func,
    actions: PropTypes.node,
    serverURL: PropTypes.string,
    errorText: PropTypes.string,
};

export default CustomServerComponent;

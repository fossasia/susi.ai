import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import Translate from '../Translate/Translate.react';

export default class CustomServer extends Component {

	constructor(props) {
    	super(props);

    	this.state = {
    		showServerField:false,
    		serverUrl: '',
    		serverFieldError:false,
    	};
    	this.customServerMessage = '';
    }

    handleServeChange = (event) => {
        this.props.onServerChange(event);
    }

	render(){

		const customUrlStyle = {
            width:'175px',
            textAlign:'left',
            margin:'-35px 0 0px 30px',
        };
        const underlineFocusStyle= {
            color: '#4285f4'
        }
        const serverURL = <TextField
                            name="serverUrl"
                            className="serverUrl"
                            underlineFocusStyle={underlineFocusStyle}
                            floatingLabelFocusStyle={underlineFocusStyle}
                            onChange={this.handleServeChange}
                            onTouchTap={this.handleServeChange}
                            value={this.props.serverUrl}
                            errorText={this.props.customServerMessage}
                            floatingLabelText={<Translate text="Custom URL"/>}
                            style={customUrlStyle} />;

        const customServer = this.props.checked ? serverURL : '';

        return(
        	 <div>
                    <Toggle
                    	labelPosition="right"
                    	id={'uniqueId'}
                    	labelStyle={{ zIndex: 3 }}
                    	label={this.props.checked?(
                                <label htmlFor={'uniqueId'}>
                                        <div>
                                           {customServer}
                                        </div>
                                </label>
                    			):<Translate text='Use Custom Server'/>}
                    	toggled={this.props.checked}
                    	onToggle={this.handleServeChange}
                    	style={{display: 'flex',
                        	marginTop: '10px',
                        	maxWidth:'245px',
                        	flexWrap: 'wrap',
                        	height:'28px',
                        	margin: '20px auto 0px auto'}}
                    	value="customServer"
                    />
            </div>
        );
	}
}

CustomServer.propTypes = {
    checked: PropTypes.bool,
    serverUrl: PropTypes.string,
    customServerMessage: PropTypes.string,
    onServerChange: PropTypes.func,
}

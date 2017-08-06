import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import UserPreferencesStore from '../../stores/UserPreferencesStore';
import $ from 'jquery';

export default class CustomServer extends Component {

	constructor(props) {
    	super(props);

    	this.state = {
    		showServerField:false,
    		serverUrl: '',
    		serverFieldError:false,
            defaultPrefLanguage: UserPreferencesStore.getPrefLang(),
            defaultText:['Custom URL','Use Custom Server']
    	};
    	this.customServerMessage = '';
    }

    handleServeChange = (event) => {
        this.props.onServerChange(event);
    }
    changeLanguage= (defaultText) => {
        console.log(defaultText);
        this.setState({
            defaultText:defaultText
        })
    }
    componentDidMount(){
        let defaultPrefLanguage = this.state.defaultPrefLanguage;
        console.log(defaultPrefLanguage);
        let defaultText = this.state.defaultText;
        let urlForTranslate = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en-US&tl='
        +defaultPrefLanguage+'&dt=t&q='+defaultText;
        $.ajax({
          url: urlForTranslate,
          dataType: 'json',
          crossDomain: true,
          timeout: 3000,
          async: false,
          success: function (data) {
            if(data[0]){
              if(data[0][0]){
                defaultText = data[0][0][0];
                defaultText = defaultText.split(',');
                this.changeLanguage(defaultText);
              }
            }
          }.bind(this),
          error: function(errorThrown){
            console.log(errorThrown);
          }
        });
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
                            floatingLabelText={this.state.defaultText[0]}
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
                    			):this.state.defaultText[1]}
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

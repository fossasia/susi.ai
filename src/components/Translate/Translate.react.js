import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserPreferencesStore from '../../stores/UserPreferencesStore';/*
import strings from './strings';*/
import { localize } from 'react-g11n';

class Translate extends Component{

	constructor(props){
		super(props);
		this.state ={
			text: this.props.text,
			defaultPrefLanguage: UserPreferencesStore.getPrefLang(),
      textKey:this.props.textKey
		}
	}

	changeLanguage = (text) => {
        this.setState({
            text:text
        })
  }

/*  componentDidMount() {
		let defaultPrefLanguage = this.state.defaultPrefLanguage;
		let text = this.state.text;
    let textKey = this.state.textKey;
		if(defaultPrefLanguage!=='en-US' || text!==null){
    for (var key in strings[defaultPrefLanguage]) {
        if (typeof strings[defaultPrefLanguage][key]==='string' && key===textKey) {
          this.changeLanguage(strings[defaultPrefLanguage][key]);
          }
        }
    }
  }
*/
  render() {
    const { translator } = this.props;
    console.log(translator);
  	return <span>{translator.gettext(this.state.text)}</span>
  }

}


Translate.propTypes = {
	text:PropTypes.string,
  textKey:PropTypes.string,
  translator:PropTypes.object
}
export default localize(Translate);

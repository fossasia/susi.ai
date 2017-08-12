import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserPreferencesStore from '../../stores/UserPreferencesStore';
import de from './de.json';

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

  componentDidMount() {
		let defaultPrefLanguage = this.state.defaultPrefLanguage;
    let textKey = this.state.textKey;
    var arrDe = Object.keys(de);
    if(defaultPrefLanguage!=='en-US'){
      for (let key=0;key<arrDe.length;key++) {
          if (arrDe[key]===textKey) {
              this.changeLanguage(de[textKey]);
          }
        }
    }
  }

  render() {
  	return <span>{this.state.text}</span>
  }

}


Translate.propTypes = {
	text:PropTypes.string,
  textKey:PropTypes.string
}
export default Translate;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserPreferencesStore from '../../stores/UserPreferencesStore';
import de from './de.json';
import am from './am.json';
import zh from './zh.json';
import hi from './hi.json';

class Translate extends Component{

  constructor(props){
    super(props);
    this.state ={
      text: this.props.text,
      defaultPrefLanguage: UserPreferencesStore.getPrefLang()
    }
  }

  changeLanguage = (text) => {
        this.setState({
            text:text
        })
  }

  componentDidMount() {
    let defaultPrefLanguage = this.state.defaultPrefLanguage;
    var arrDe = Object.keys(de);
    var arrAm = Object.keys(am);
    var arrCh = Object.keys(zh);
    var arrHi = Object.keys(hi);
    let text = this.state.text;
    if(defaultPrefLanguage!=='en-US'){
      if(defaultPrefLanguage==='de-DE'){
        for (let key=0;key<arrDe.length;key++) {
          if (arrDe[key]===text) {
              this.changeLanguage(de[arrDe[key]]);
          }
        }
      }

      if(defaultPrefLanguage==='am-AM'){
        for (let key=0;key<arrAm.length;key++) {
          if (arrAm[key]===text) {
            this.changeLanguage(am[arrAm[key]]);
          }
        }
      }

      if(defaultPrefLanguage==='zh-CH'){
        for (let key=0;key<arrCh.length;key++) {
          if (arrCh[key]===text) {
            this.changeLanguage(zh[arrCh[key]]);
          }
        }
      }

      if(defaultPrefLanguage==='hi-IN'){
        for (let key=0;key<arrHi.length;key++) {
          if (arrHi[key]===text) {
              this.changeLanguage(hi[arrHi[key]]);
          }
        }
      }
  }
}
  render() {
    return <span>{this.state.text}</span>
  }

}


Translate.propTypes = {
  text:PropTypes.string
}
export default Translate;

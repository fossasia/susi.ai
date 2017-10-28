import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserPreferencesStore from '../../stores/UserPreferencesStore';
import de from './de.json';
import am from './am.json';
import zh from './zh.json';
import es from './es.json';
import hi from './hi.json';
import fr from './fr.json';
import gr from './gr.json';
import ru from './ru.json';
import jp from './jp.json';
// Added by @0x48piraj
import nl from './nl.json';

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

    var arr, file;

    let text = this.state.text;
    if(defaultPrefLanguage!=='en-US'){

      if(defaultPrefLanguage==='de-DE'){
        arr = Object.keys(de);
        file = de;
      }
      else if(defaultPrefLanguage==='am-AM'){
        arr = Object.keys(am);
        file = am;
      }
      else if(defaultPrefLanguage==='es-SP'){
        arr = Object.keys(es);
        file = es;
      }
      else if(defaultPrefLanguage==='zh-CH'){
        arr = Object.keys(zh);
        file = zh;
      }
      else if(defaultPrefLanguage==='hi-IN'){
        arr = Object.keys(hi);
        file = hi;
      }
      else if(defaultPrefLanguage==='fr-FR'){
        arr = Object.keys(fr);
        file = fr;
      }
      else if(defaultPrefLanguage==='ru-RU'){
        arr = Object.keys(ru);
        file = ru;
      }
      else if(defaultPrefLanguage==='gr-GR'){
        arr = Object.keys(gr);
        file = gr;
      }
      else if(defaultPrefLanguage==='nl-NL'){
        arr = Object.keys(nl);
        file = nl;
      }
      else{
        arr = Object.keys(jp);
        file = jp;
      }

      for (let key=0;key<arr.length;key++) {
        if (arr[key]===text) {
            this.changeLanguage(file[arr[key]]);
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

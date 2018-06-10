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
import nl from './nl.json';
import pb from './pb.json';
import np from './np.json';

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

  lang = {
    "de-DE": de,
    "am-AM": am,
    "es-SP": es,
    "zh-CH": zh,
    "hi-IN": hi,
    "pb-IN": pb,
    "np-NP": np,
    "fr-FR": fr,
    "ru-RU": ru,
    "gr-GR": gr,
    "nl-NL": nl
  };

  componentDidMount() {
    let arr, file, defaultPrefLanguage = this.state.defaultPrefLanguage;
    let text = this.state.text;
    if(defaultPrefLanguage!=='en-US'){
      if(this.lang.hasOwnProperty(defaultPrefLanguage)) {
        arr = Object.keys(this.lang[defaultPrefLanguage]);
        file = this.lang.defaultPrefLanguage;
      } else {
        arr = Object.keys(jp);
        file = jp;
      }
      arr.forEach((val,index)=> {
        if (arr.index===text) {
        this.changeLanguage(file.arr.index);
        }
      })
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

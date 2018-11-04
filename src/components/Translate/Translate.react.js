import React from 'react';
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
import nl from './nl.json';
import pb from './pb.json';
import np from './np.json';

const Translate = props => {
  const lang = {
    'de-DE': de,
    'am-AM': am,
    'es-SP': es,
    'zh-CH': zh,
    'hi-IN': hi,
    'pb-IN': pb,
    'np-NP': np,
    'fr-FR': fr,
    'ru-RU': ru,
    'gr-GR': gr,
    'nl-NL': nl,
  };

  const getTranslation = text => {
    const defaultPrefLanguage = UserPreferencesStore.getPrefLang();
    let translatedText;

    if (defaultPrefLanguage !== 'en-US') {
      if (lang.hasOwnProperty(defaultPrefLanguage)) {
        translatedText = lang[defaultPrefLanguage][text];
      }
    }

    return !translatedText ? text : translatedText;
  };

  return <span> {getTranslation(props.text)} </span>;
};

Translate.propTypes = {
  text: PropTypes.string,
};
export default Translate;

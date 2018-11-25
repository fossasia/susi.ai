import './index.css';
import * as ChatWebAPIUtils from './utils/ChatWebAPIUtils';
import * as Actions from './actions/';
import App from './App';
import MessageStore from './stores/MessageStore';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import UserPreferencesStore from './stores/UserPreferencesStore';
// Internationalization
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
import es from 'react-intl/locale-data/es';
import de from 'react-intl/locale-data/de';
import ru from 'react-intl/locale-data/ru';
import { IntlProvider } from 'react-intl';
import { addLocaleData } from 'react-intl';
import { BrowserRouter as Router } from 'react-router-dom';
import store from './store';

addLocaleData([...en, ...fr, ...es, ...de, ...ru]);

ChatWebAPIUtils.getSettings();
ChatWebAPIUtils.getLocation();
ChatWebAPIUtils.getHistory();
ChatWebAPIUtils.getAllMessages();

let defaults = UserPreferencesStore.getPreferences();
let defaultPrefLanguage = defaults.PrefLanguage;

window.speechSynthesis.onvoiceschanged = function() {
  if (!MessageStore.getTTSInitStatus()) {
    const speechSynthesisVoices = speechSynthesis.getVoices();
    Actions.getTTSLangText(speechSynthesisVoices);
    Actions.initialiseTTSVoices(speechSynthesisVoices);
  }
};

ReactDOM.render(
  <Provider store={store} key="provider">
    <IntlProvider locale={defaultPrefLanguage}>
      <Router>
        <App />
      </Router>
    </IntlProvider>
  </Provider>,
  document.getElementById('root'),
);

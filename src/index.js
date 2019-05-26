import './index.css';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
// Internationalization
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
import es from 'react-intl/locale-data/es';
import de from 'react-intl/locale-data/de';
import ru from 'react-intl/locale-data/ru';
import { IntlProvider } from 'react-intl';
import { addLocaleData } from 'react-intl';
import { BrowserRouter as Router } from 'react-router-dom';
import { Logger } from './utils/helperFunctions';
import store from './store';

addLocaleData([...en, ...fr, ...es, ...de, ...ru]);

// Disable console.* in production mode
Logger();

function mapStateToProps(store) {
  return {
    locale: store.settings.prefLanguage,
  };
}

let ConnectedIntlProvider = connect(mapStateToProps)(IntlProvider);

ReactDOM.render(
  <Provider store={store} key="provider">
    <ConnectedIntlProvider>
      <Router>
        <App />
      </Router>
    </ConnectedIntlProvider>
  </Provider>,
  document.getElementById('root'),
);

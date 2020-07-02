/* eslint-disable */
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
import { ConnectedRouter } from 'connected-react-router';
import { Logger } from './utils/helperFunctions';
import configureStore, { history } from './redux/configureStore';
import ReactPiwik from 'react-piwik';
import { fetchApiKeys } from './apis';

export const store = configureStore();

addLocaleData([...en, ...fr, ...es, ...de, ...ru]);

// Disable console.* in production mode
Logger();

function mapStateToProps(store) {
  return {
    locale: store.settings.prefLanguage,
  };
}

let ConnectedIntlProvider = connect(mapStateToProps)(IntlProvider);

let piwik = null,
  matomoSiteId,
  matomoUrl;

let usepiwik = false;

fetchApiKeys().then(payload => {
  matomoSiteId =
    payload &&
    payload.keys &&
    payload.keys.matomoSiteId &&
    payload.keys.matomoSiteId.value;
  matomoSiteId = parseFloat(matomoSiteId);
  if (isNaN(matomoSiteId)) matomoSiteId = 0;

  matomoUrl =
    payload &&
    payload.keys &&
    payload.keys.matomoUrl &&
    payload.keys.matomoUrl.value;
  matomoUrl = matomoUrl || '';

  piwik = new ReactPiwik({
    url: matomoUrl.split('/')[0],
    siteId: matomoSiteId,
    trackErrors: true,
    phpFilename: matomoUrl.split('/')[1],
  });
  usepiwik = true;
});

ReactDOM.render(
  <Provider store={store} key="provider">
    <ConnectedIntlProvider>
      <ConnectedRouter
        history={
          usepiwik && matomoSiteId !== '' && matomoUrl !== '' && !piwik
            ? piwik.connectToHistory(history)
            : history
        }
      >
        <App />
      </ConnectedRouter>
    </ConnectedIntlProvider>
  </Provider>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    ReactDOM.render(NextApp);
  });
}

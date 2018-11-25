import { createStore as _createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import reduxPromise from 'redux-promise';
import reducers from './reducers';

export default function createStore(history) {
  // Sync dispatched route actions to the history
  const reduxRouterMiddleware = routerMiddleware(history);

  const middleware = [reduxRouterMiddleware, reduxPromise];

  let finalCreateStore;
  finalCreateStore = applyMiddleware(...middleware)(_createStore);

  const store = finalCreateStore(
    reducers,
    {},
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__(),
  );

  return store;
}

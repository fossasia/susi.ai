import createStore from './redux/create';
import { browserHistory } from 'react-router';

const store = createStore(browserHistory);

export default store;

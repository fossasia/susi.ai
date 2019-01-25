import { createAction } from 'redux-actions';
import actionTypes from '../actionTypes';

const returnArgumentsFn = function(payload) {
  return Promise.resolve(payload);
};

export default {
  searchTextChanged: createAction(
    actionTypes.SEARCH_TEXT_CHANGED,
    returnArgumentsFn,
  ),
  searchPreviousItme: createAction(
    actionTypes.SEARCH_PREVIOUS_ITEM,
    returnArgumentsFn,
  ),
  searchNextItme: createAction(actionTypes.SEARCH_NEXT_ITEM, returnArgumentsFn),
  openSearch: createAction(actionTypes.SEARCH_OPEN_SEARCH, returnArgumentsFn),
  exitSearch: createAction(actionTypes.SEARCH_EXIT_SEARCH, returnArgumentsFn),
};

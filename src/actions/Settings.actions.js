import ChatAppDispatcher from '../dispatcher/ChatAppDispatcher';
import ChatConstants from '../constants/ChatConstants';

let ActionTypes = ChatConstants.ActionTypes;

export function serverChanged(server){
  ChatAppDispatcher.dispatch({
    type: ActionTypes.SERVER_CHANGED,
    server
  });
}

export function themeChanged(theme) {
  ChatAppDispatcher.dispatch({
    type: ActionTypes.THEME_CHANGED,
    theme
  });
};

export function ToggleSearch() {
  ChatAppDispatcher.dispatch({
    type: ActionTypes.SEARCH_MODE
  });
};

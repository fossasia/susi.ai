import UserPreferencesStore from '../stores/UserPreferencesStore';
import ChatAppDispatcher from '../dispatcher/ChatAppDispatcher';
import ChatConstants from '../constants/ChatConstants';
let ActionTypes = ChatConstants.ActionTypes;
export function getDefaults() {
  return UserPreferencesStore.getPreferences();
}

export function setDefaults() {
  let preferences =  getDefaults();
  let theme = preferences.Theme;
  ChatAppDispatcher.dispatch({
    type: ActionTypes.SET_DEFAULT_THEME,
    theme
  });
}

export function setDefaultTheme(defaultTheme){
  ChatAppDispatcher.dispatch({
    type: ActionTypes.DEFAULT_THEME_CHANGED,
    defaultTheme
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



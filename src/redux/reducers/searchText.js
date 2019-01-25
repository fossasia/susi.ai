import { handleActions } from 'redux-actions';
import actionTypes from '../actionTypes';
import { searchMessages } from '../../utils/searchMessages';

const defaultState = {
  isSearchBarActive: false,
  searchState: {
    markedMessagesByID: {},
    markedIDs: [],
    markedIndices: [],
    scrollLimit: 0,
    scrollIndex: -1,
    scrollID: null,
    caseSensitive: false,
    searchIndex: 0,
    searchText: '',
  },
};

export default handleActions(
  {
    [actionTypes.SEARCH_TEXT_CHANGED](state, { payload }) {
      // TODO: Call close snackbar from Top Bar
      const { messages, messagesByID, searchText } = payload;
      let { searchState } = state;
      // const searchText = event.target.value;
      if (searchText) {
        const markingData = searchMessages(
          messages,
          messagesByID,
          searchText,
          searchState.caseSensitive,
        );
        const { markedMessagesByID, markedIDs, markedIndices } = markingData;
        searchState = {
          markedMessagesByID,
          markedIDs,
          markedIndices,
          scrollLimit: markedIDs.length,
          scrollIndex: 0,
          scrollID: markedIDs[0],
          caseSensitive: searchState.caseSensitive,
          searchIndex: 1,
          searchText,
        };
        if (markedIDs.length === 0) {
          // if no Messages are marked(i.e no result) and the search query is not empty
          // TODO: Open snackbar from topbar
          // openSnackBar({
          //   snackBarMessage: 'No result found!',
          //   snackBarDuration: 3000,
          // });
        }
      } else {
        searchState = {
          markedMessagesByID: messagesByID,
          markedIDs: [],
          markedIndices: [],
          scrollLimit: 0,
          scrollIndex: -1,
          scrollID: null,
          caseSensitive: searchState.caseSensitive,
          searchIndex: 0,
          searchText: '',
        };
      }
      return {
        ...state,
        searchState,
      };
    },
    [actionTypes.SEARCH_PREVIOUS_ITEM](state, { payload }) {
      // TODO: Find a way to pass ref for ul
      let { ul } = payload;
      const { searchState } = state;
      let newIndex = searchState.scrollIndex + 1;
      let newSearchCount = searchState.searchIndex + 1;
      let indexLimit = searchState.scrollLimit;
      let markedIDs = searchState.markedIDs;
      if (newSearchCount <= 0) {
        newSearchCount = indexLimit;
      }

      if (markedIDs && ul && newIndex < indexLimit) {
        let currState = searchState;
        currState.scrollIndex = newIndex;
        currState.searchIndex = newSearchCount;
        currState.scrollID = markedIDs[newIndex];
        return {
          ...state,
          searchState: currState,
        };
      }
      if (markedIDs && ul && newIndex === 0) {
        let currState = searchState;
        newIndex = indexLimit;
        currState.scrollIndex = newIndex;
        currState.searchIndex = 1;
      }
      if (markedIDs && ul && newIndex < 0) {
        let currState = searchState;
        newIndex = indexLimit;
        currState.scrollIndex = newIndex;
        currState.searchIndex = 1;
        newIndex = searchState.scrollIndex + 1;
        newSearchCount = searchState.searchIndex + 1;
        markedIDs = searchState.markedIDs;
        indexLimit = searchState.scrollLimit;
        if (newSearchCount <= 0) {
          newSearchCount = indexLimit;
        }
        if (markedIDs && ul && newIndex >= 0) {
          currState = searchState;
          currState.scrollIndex = newIndex;
          currState.searchIndex = newSearchCount;
          currState.scrollID = markedIDs[newIndex];
          return {
            ...state,
            searchState: currState,
          };
        }
      }
      return {
        ...state,
      };
    },
    [actionTypes.SEARCH_NEXT_ITEM](state, { payload }) {
      // TODO: Find a way to pass ref for ul
      let { ul } = payload;
      const { searchState } = state;
      let newIndex = searchState.scrollIndex - 1;
      let newSearchCount = searchState.searchIndex - 1;
      let markedIDs = searchState.markedIDs;
      let indexLimit = searchState.scrollLimit;
      if (newSearchCount <= 0) {
        newSearchCount = indexLimit;
      }
      if (markedIDs && ul && newIndex >= 0) {
        let currState = searchState;
        currState.scrollIndex = newIndex;
        currState.searchIndex = newSearchCount;
        currState.scrollID = markedIDs[newIndex];
        return {
          ...state,
          searchState: currState,
        };
      }
      if (markedIDs && ul && newIndex === 0) {
        let currState = searchState;
        newIndex = indexLimit;
        currState.scrollIndex = newIndex;
        currState.searchIndex = 1;
      }
      if (markedIDs && ul && newIndex < 0) {
        let currState = searchState;
        newIndex = indexLimit;
        currState.scrollIndex = newIndex;
        currState.searchIndex = 1;
        newIndex = searchState.scrollIndex - 1;
        newSearchCount = searchState.searchIndex - 1;
        markedIDs = searchState.markedIDs;
        indexLimit = searchState.scrollLimit;
        ul = this.messageList;
        if (newSearchCount <= 0) {
          newSearchCount = indexLimit;
        }
        if (markedIDs && ul && newIndex >= 0) {
          currState = searchState;
          currState.scrollIndex = newIndex;
          currState.searchIndex = newSearchCount;
          currState.scrollID = markedIDs[newIndex];
          return {
            ...state,
            searchState: currState,
          };
        }
      }
      return {
        ...state,
      };
    },
    [actionTypes.SEARCH_OPEN_SEARCH](state, { payload }) {
      return {
        ...state,
        isSearchBarActive: true,
      };
    },
    [actionTypes.SEARCH_EXIT_SEARCH](state, { payload }) {
      return {
        ...state,
        ...defaultState,
      };
    },
  },
  {
    ...defaultState,
  },
);

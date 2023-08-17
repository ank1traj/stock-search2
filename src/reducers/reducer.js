// src/reducers/reducer.js

const initialState = {
  searchTerm: "",
  selectedStockDetails: null,
  autocompleteResults: [],
  searchHistory: [],
  searchHistoryIndex: -1
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "SET_AUTOCOMPLETE_RESULTS":
      return { ...state, autocompleteResults: action.payload };
    case "SET_SELECTED_STOCK_DETAILS":
      return { ...state, selectedStockDetails: action.payload };
    case "SET_SEARCH_HISTORY":
      return { ...state, searchHistory: action.payload };
    case "SET_SEARCH_HISTORY_INDEX":
      return { ...state, searchHistoryIndex: action.payload };
    default:
      return state;
  }
};

export default reducer;

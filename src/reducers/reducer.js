// src/reducers/reducer.js

const initialState = {
  searchTerm: "",
  selectedStock: null,
  autocompleteResults: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "SET_AUTOCOMPLETE_RESULTS":
      return { ...state, autocompleteResults: action.payload };
    case "SET_SELECTED_STOCK":
      return { ...state, selectedStock: action.payload };
    default:
      return state;
  }
};

export default reducer;

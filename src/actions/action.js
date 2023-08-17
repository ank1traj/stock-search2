// src/actions/actions.js

export const setSearchTerm = (term) => ({
  type: "SET_SEARCH_TERM",
  payload: term
});

export const setAutocompleteResults = (results) => ({
  type: "SET_AUTOCOMPLETE_RESULTS",
  payload: results
});

export const setSelectedStockDetails = (stock) => ({
  type: "SET_SELECTED_STOCK_DETAILS",
  payload: stock
});

export const setSearchHistory = (history) => ({
  type: "SET_SEARCH_HISTORY",
  payload: history
});

export const setSearchHistoryIndex = (index) => ({
  type: "SET_SEARCH_HISTORY_INDEX",
  payload: index
});

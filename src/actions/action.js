// src/actions/actions.js

export const setSearchTerm = (term) => ({
  type: "SET_SEARCH_TERM",
  payload: term
});

export const setAutocompleteResults = (results) => ({
  type: "SET_AUTOCOMPLETE_RESULTS",
  payload: results
});

export const setSelectedStock = (stock) => ({
  type: "SET_SELECTED_STOCK",
  payload: stock
});

import React, { useState, useEffect } from "react";
import _debounce from "lodash/debounce";
import "./StockPicker.css";
import { useSelector, useDispatch } from "react-redux";
import {
  setSearchTerm,
  setAutocompleteResults,
  setSelectedStockDetails,
  setSearchHistory,
  setSearchHistoryIndex
} from "../actions/action";
import {
  fetchAutocompleteResults,
  fetchStockDetails
} from "../services/stockService";

function StockPicker() {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const debouncedFetchAutocomplete = _debounce(async (searchTerm) => {
      setLoading(true);

      const autocompleteResults = await fetchAutocompleteResults(searchTerm);

      dispatch(setAutocompleteResults(autocompleteResults));
      setLoading(false);
    }, 300);

    debouncedFetchAutocomplete(state.searchTerm);

    return () => {
      debouncedFetchAutocomplete.cancel();
    };
  }, [state.searchTerm, dispatch]);

  /**
   * handleSearch fetches the details of the input stock
   * on click of the button
   * Updates the search History as well for navigation
   */
  const handleSearch = async () => {
    if (state.searchTerm) {
      setLoading(true);

      const fetchedSelectedStockDetails = await fetchStockDetails(
        state.searchTerm
      );

      if (fetchedSelectedStockDetails) {
        dispatch(setSelectedStockDetails(fetchedSelectedStockDetails));
        const updatedHistory = [...state.searchHistory, state.searchTerm];
        dispatch(setSearchHistory(updatedHistory));
        dispatch(setSearchHistoryIndex(updatedHistory.length - 1));
      }

      setLoading(false);
      dispatch(setAutocompleteResults([]));
      dispatch(setSearchTerm(""));
    }
  };

  /**
   * handleAutocompleteClick the stock details for selected symbol and
   * clears the search term and autocomplete list
   * @param {*} symbol - selected stock symbol from the list
   */
  const handleAutocompleteClick = async (symbol) => {
    setLoading(true);

    const fetchedSelectedStockDetails = await fetchStockDetails(symbol);

    if (fetchedSelectedStockDetails) {
      dispatch(setSelectedStockDetails(fetchedSelectedStockDetails));
      const updatedHistory = [...state.searchHistory, state.searchTerm];
      dispatch(setSearchHistory(updatedHistory));
      dispatch(setSearchHistoryIndex(updatedHistory.length - 1));
    }

    setLoading(false);
    dispatch(setAutocompleteResults([]));
    dispatch(setSearchTerm(""));
  };

  /**
   * handleHistoryNavigation handles the navigation for forward and backward items
   * and sets the search term to next and previous seearch terms respectively
   * @param {*} indexDelta - index for the current stock
   */
  const handleHistoryNavigation = (indexDelta) => {
    const newIndex = state.searchHistoryIndex + indexDelta;
    if (newIndex >= 0 && newIndex < state.searchHistory.length) {
      dispatch(setSearchHistoryIndex(newIndex));
      dispatch(setSearchTerm(state.searchHistory[newIndex]));
    }
  };

  return (
    <div className="stock-picker">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a stock..."
          value={state.searchTerm}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
        />
        <button
          className="search-button"
          onClick={handleSearch}
          disabled={!state.searchTerm || loading}
        >
          Search
        </button>
        <button
          className="nav-button"
          onClick={() => handleHistoryNavigation(-1)}
          disabled={state.searchHistoryIndex <= 0}
        >
          &lt; Back
        </button>
        <button
          className="nav-button"
          onClick={() => handleHistoryNavigation(1)}
          disabled={state.searchHistoryIndex >= state.searchHistory.length - 1}
        >
          Forward &gt;
        </button>
      </div>
      <ul className="autocomplete-list">
        {state.autocompleteResults.map((result) => (
          <li
            key={result.symbol}
            onClick={() => handleAutocompleteClick(result.symbol)}
          >
            <span className="autocomplete-symbol">{result.symbol}</span>
            <span className="autocomplete-name">{result.name}</span>
          </li>
        ))}
      </ul>
      {state?.selectedStockDetails && state?.selectedStockDetails?.name && (
        <div className="stock-details">
          <h2>{state.selectedStockDetails.name}</h2>
          <p>
            <b>Description: </b>
            {state.selectedStockDetails.description}
          </p>
          <p>
            <b>Symbol: </b>
            {state.selectedStockDetails.symbol}
          </p>
          <p>
            <b>Country: </b>
            {state.selectedStockDetails.country}
          </p>
          <p>
            <b>Analyst Target Price: </b>
            {state.selectedStockDetails.AnalystTargetPrice}
          </p>
          <p>
            <b>Exchange: </b>
            {state.selectedStockDetails.Exchange}
          </p>
          <p>
            <b>Industry: </b>
            {state.selectedStockDetails.Industry}
          </p>
          <p>
            <b>PE Ratio: </b>
            {state.selectedStockDetails.PERatio}
          </p>
          <p>
            <b>Market Cap: </b>
            {state.selectedStockDetails.MarketCapitalization}
          </p>
        </div>
      )}
      {state?.selectedStockDetails && !state?.selectedStockDetails?.name && (
        <div className="stock-details">
          <h3>Stock data not found</h3>
        </div>
      )}
    </div>
  );
}

export default StockPicker;

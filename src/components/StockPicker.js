import React, { useState, useEffect } from "react";
import _debounce from "lodash/debounce";
import "./StockPicker.css";
import { useSelector, useDispatch } from "react-redux";
import {
  setSearchTerm,
  setAutocompleteResults,
  setSelectedStock,
  setSearchHistory,
  setSearchHistoryIndex
} from "../actions/action";
import {
  fetchAutocompleteResults,
  fetchStockDetails
} from "../services/stockService"; // Import functions from the service module

function StockPicker() {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedSymbol, SetSelectedSymbol] = useState("");

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

  const handleSearch = async () => {
    if (state.selectedStock) {
      setLoading(true);

      const selectedStockDetails = await fetchStockDetails(
        state.selectedStock.symbol
      );

      if (selectedStockDetails) {
        dispatch(setSelectedStock(selectedStockDetails));
        const updatedHistory = [...state.searchHistory, state.searchTerm];
        dispatch(setSearchHistory(updatedHistory));
        dispatch(setSearchHistoryIndex(updatedHistory.length - 1));
      }

      setLoading(false);
    }
  };

  const handleAutocompleteClick = async (symbol) => {
    setLoading(true);

    SetSelectedSymbol(symbol);
    const selectedStock = await fetchStockDetails(symbol);

    if (selectedStock) {
      dispatch(setSelectedStock(selectedStock));
      const updatedHistory = [...state.searchHistory, state.searchTerm];
      dispatch(setSearchHistory(updatedHistory));
      dispatch(setSearchHistoryIndex(updatedHistory.length - 1));
    }

    setLoading(false);
    dispatch(setAutocompleteResults([]));
    dispatch(setSearchTerm(""));
  };

  const handleHistoryNavigation = (indexDelta) => {
    const newIndex = state.searchHistoryIndex + indexDelta;
    if (newIndex >= 0 && newIndex < state.searchHistory.length) {
      dispatch(setSearchHistoryIndex(newIndex));
      dispatch(setSearchTerm(state.searchHistory[newIndex]));
    }
  };

  console.log("here state.selectedStock.name : ", state?.selectedStock?.name);
  if (state?.selectedStock?.name) console.log("TRUE");
  else console.log("FALSe");

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
          disabled={!state.selectedStock || loading}
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
      {state.selectedStock && state?.selectedStock?.name && (
        <div className="stock-details">
          <h2>{state.selectedStock.name}</h2>
          <p>Description: {state.selectedStock.description}</p>
          <p>Symbol: {state.selectedStock.symbol}</p>
          <p>Country: {state.selectedStock.country}</p>
          <p>Analyst Target Price: {state.selectedStock.AnalystTargetPrice}</p>
          <p>Exchange: {state.selectedStock.Exchange}</p>
          <p>Industry: {state.selectedStock.Industry}</p>
          <p>PE Ratio: {state.selectedStock.PERatio}</p>
          <p>Market Cap: {state.selectedStock.MarketCapitalization}</p>
        </div>
      )}
      {state.selectedStock && !state?.selectedStock?.name && (
        <div className="stock-details">
          <h3>No Data Found for Stock Symbol "{selectedSymbol}"</h3>
        </div>
      )}
    </div>
  );
}

export default StockPicker;

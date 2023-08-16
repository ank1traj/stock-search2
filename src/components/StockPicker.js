import React, { useState, useEffect } from "react";
import _debounce from "lodash/debounce";
import "./StockPicker.css";
import { useSelector, useDispatch } from "react-redux";
import {
  setSearchTerm,
  setAutocompleteResults,
  setSelectedStock,
} from "../actions/action";
import {
  fetchAutocompleteResults,
  fetchStockDetails,
} from "../services/stockService"; // Import functions from the service module

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

  const handleAutocompleteClick = async (symbol) => {
    setLoading(true);

    const selectedStock = await fetchStockDetails(symbol);

    if (selectedStock) {
      dispatch(setSelectedStock(selectedStock));
    }

    setLoading(false);
    dispatch(setAutocompleteResults([]));
    dispatch(setSearchTerm(""));
  };

  const handleSearch = async () => {
    if (state.selectedStock) {
      setLoading(true);

      const selectedStockDetails = await fetchStockDetails(
        state.selectedStock.symbol
      );

      if (selectedStockDetails) {
        dispatch(setSelectedStock(selectedStockDetails));
      }

      setLoading(false);
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
          onClick={handleSearch}
          disabled={!state.selectedStock || loading}
        >
          Search
        </button>
      </div>
      <ul className="autocomplete-list">
        {state.autocompleteResults.map((result) => (
          <li
            key={result.symbol}
            onClick={() => handleAutocompleteClick(result.symbol)}
          >
            {result.symbol} - {result.name}
          </li>
        ))}
      </ul>
      {state.selectedStock && (
        <div className="stock-details">
          <h2>
            {state.selectedStock.symbol} - {state.selectedStock.name}
          </h2>
          <p>{state.selectedStock.description}</p>
          <p>Country: {state.selectedStock.country}</p>
        </div>
      )}
    </div>
  );
}

export default StockPicker;

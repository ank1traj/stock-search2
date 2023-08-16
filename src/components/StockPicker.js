import React, { useState, useEffect } from "react";
import _debounce from "lodash/debounce";
import "./StockPicker.css";
import { useSelector, useDispatch } from "react-redux";
import {
  setSearchTerm,
  setAutocompleteResults,
  setSelectedStock
} from "../actions/action";

function StockPicker() {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAutocomplete = async () => {
      if (state.searchTerm.trim() === "") {
        dispatch(setAutocompleteResults([]));
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${state.searchTerm}&apikey=6AVC3L6F4WXVVLNI`
        );
        const data = await response.json();

        if (data.bestMatches) {
          const autocompleteResults = data.bestMatches.map((match) => ({
            symbol: match["1. symbol"],
            name: match["2. name"]
          }));

          dispatch(setAutocompleteResults(autocompleteResults));
        }
      } catch (error) {
        console.error("Error fetching autocomplete data:", error);
      }

      setLoading(false);
    };

    const debouncedFetchAutocomplete = _debounce(fetchAutocomplete, 300);

    debouncedFetchAutocomplete(); // Call the debounced function

    return () => {
      debouncedFetchAutocomplete.cancel(); // Cancel the debounce function on unmount
    };
  }, [state.searchTerm, dispatch]);

  const handleAutocompleteClick = async (symbol) => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=YOUR_API_KEY`
      );
      const data = await response.json();

      const selectedStock = {
        symbol: data.Symbol,
        name: data.Name,
        description: data.Description,
        country: data.Country
      };

      dispatch(setSelectedStock(selectedStock));
    } catch (error) {
      console.error("Error fetching stock details:", error);
    }

    setLoading(false);
    dispatch(setAutocompleteResults([]));
    dispatch(setSearchTerm(""));
  };

  const handleSearch = async () => {
    if (state.selectedStock) {
      setLoading(true);

      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${state.selectedStock.symbol}&apikey=6AVC3L6F4WXVVLNI`
        );
        const data = await response.json();

        const selectedStockDetails = {
          symbol: data.Symbol,
          name: data.Name,
          description: data.Description,
          country: data.Country
        };

        dispatch(setSelectedStock(selectedStockDetails));
      } catch (error) {
        console.error("Error fetching selected stock details:", error);
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

/*import React from "react";
import "./StockPicker.css";
import { useSelector, useDispatch } from "react-redux";
import {
  setSearchTerm,
  setAutocompleteResults,
  setSelectedStock
} from "../actions/action";

const stockData = [
  {
    name: "Apple Inc.",
    symbol: "AAPL",
    description: "Apple Inc. is a multinational technology company...",
    current_price: 150.25,
    change: "+2.18%",
    traded_on: "NASDAQ",
    industry: "Technology",
    pe_ratio: 28.45,
    market_cap: "2.5T"
  },
  {
    name: "Amazon.com Inc.",
    symbol: "AMZN",
    description: "Amazon.com, Inc. is an American e-commerce and...",
    current_price: 3250.75,
    change: "-1.05%",
    traded_on: "NASDAQ",
    industry: "Retail",
    pe_ratio: 72.91,
    market_cap: "1.6T"
  },
  {
    name: "Microsoft Corporation",
    symbol: "MSFT",
    description: "Microsoft Corporation is a multinational technology...",
    current_price: 305.4,
    change: "+0.75%",
    traded_on: "NASDAQ",
    industry: "Technology",
    pe_ratio: 37.89,
    market_cap: "2.3T"
  },
  {
    name: "Tesla, Inc.",
    symbol: "TSLA",
    description: "Tesla, Inc. is an American electric vehicle and clean...",
    current_price: 720.6,
    change: "-0.50%",
    traded_on: "NASDAQ",
    industry: "Automotive",
    pe_ratio: 176.25,
    market_cap: "750B"
  }
  // Add more stock entries as needed
];

function StockPicker() {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleSearchTermChange = (event) => {
    const newSearchTerm = event.target.value;
    dispatch(setSearchTerm(newSearchTerm));

    if (newSearchTerm.trim() === "") {
      dispatch(setAutocompleteResults([]));
      return;
    }

    const filteredStocks = stockData.filter((stock) =>
      stock.symbol.toLowerCase().includes(newSearchTerm.toLowerCase())
    );

    dispatch(setAutocompleteResults(filteredStocks));
  };

  const handleAutocompleteClick = (stock) => {
    dispatch(setSelectedStock(stock));
    dispatch(setAutocompleteResults([]));
    dispatch(setSearchTerm(""));
  };

  const handleSearch = () => {
  
    const foundStock = stockData.find(
      (stock) => stock.symbol.toLowerCase() === state.searchTerm.toLowerCase()
    );

    dispatch(setSelectedStock(foundStock));
    dispatch(setSearchTerm(""));
  };

  */

import React, { useState, useEffect } from "react";
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
    async function fetchAutocomplete() {
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
    }

    fetchAutocomplete();
  }, [state.searchTerm, dispatch]);

  const handleAutocompleteClick = async (symbol) => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=6AVC3L6F4WXVVLNI`
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
          `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${state.selectedStock.symbol}&apikey=YOUR_API_KEY`
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

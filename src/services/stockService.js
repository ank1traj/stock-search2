// stockService.js
const API_KEY = "XGY476OYU14V6G2G"; // Replace with your actual API key

async function fetchAutocompleteResults(searchTerm) {
  if (searchTerm.trim() === "") {
    return [];
  }

  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchTerm}&apikey=${API_KEY}`
    );
    const data = await response.json();

    if (data.bestMatches) {
      return data.bestMatches.map((match) => ({
        symbol: match["1. symbol"],
        name: match["2. name"]
      }));
    }
  } catch (error) {
    console.error("Error fetching autocomplete data:", error);
  }

  return [];
}

async function fetchStockDetails(symbol) {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`
    );
    const data = await response.json();

    return {
      symbol: data.Symbol,
      name: data.Name,
      description: data.Description,
      country: data.Country,
      AnalystTargetPrice: data.AnalystTargetPrice,
      Exchange: data.Exchange,
      Industry: data.Industry,
      PERatio: data.PERatio,
      MarketCapitalization: data.MarketCapitalization
    };
  } catch (error) {
    console.error("Error fetching stock details:", error);
  }

  return null;
}

export { fetchAutocompleteResults, fetchStockDetails };

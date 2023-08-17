import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducer from "./reducers/reducer";
import StockPicker from "./components/StockPicker";

const store = createStore(reducer);

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <h1>Stock Insight</h1>
        <StockPicker />
      </div>
    </Provider>
  );
}

export default App;

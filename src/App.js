import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducer from "./reducers/reducer";
import StockPicker from "./components/StockPicker";
// import AppName from "./components/AppName";
// import SideNav from "./components/SideNav";

const store = createStore(reducer);

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        {/* <header>
          <AppName />
        </header>
        <SideNav /> */}
        <h1>Stock Picker Widget</h1>
        <StockPicker />
      </div>
    </Provider>
  );
}

export default App;

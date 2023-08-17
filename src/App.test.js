import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducer from "./reducers/reducer";
import App from "./App";

describe("App Component", () => {
  it("renders without crashing", () => {
    const store = createStore(reducer);
    console.log("here store : ", store);
    let { getByText } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const appTitle = getByText("Stock Insight");
    expect(appTitle).toBeInTheDocument();
  });
});

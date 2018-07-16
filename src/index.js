import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

//Enabling Hot module replacement [HMR]
if (module.hot) {
  module.hot.accept();
}

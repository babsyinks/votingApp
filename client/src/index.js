import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import FullScreenLoader from "./components/loaders/FullScreenLoader";

import { store, persistor } from "./app/rootReducer";
import "./assets/global.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={<FullScreenLoader />} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
);
if (module.hot) {
  module.hot.accept();
}

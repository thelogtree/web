import React from "react";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";

import { ReduxReducers } from "./redux/reducerIndex";
import { Header } from "./sharedComponents/Header";
import { constants } from "./utils/constants";
import { SetupApp } from "./utils/SetupApp";
import { RouteManager } from "./RouteManager";

const REDUX_LOGS_ENABLED = false;

function App() {
  const logger = createLogger({ diff: false });
  let store = createStore(ReduxReducers, applyMiddleware(thunk));
  if (REDUX_LOGS_ENABLED && !process.env.IS_PROD) {
    store = createStore(ReduxReducers, applyMiddleware(thunk, logger));
  }

  return (
    <Provider store={store}>
      <Router>
        <SetupApp />
        <RouteManager />
      </Router>
    </Provider>
  );
}

export default App;

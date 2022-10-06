import { createStore, compose } from "redux";

import rootReducer from "./rootReducer";

const withDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, withDevTools());

export default store;

import { combineReducers } from "redux";

import commerceReducer from "./commerce/reducer";

const rootReducer = combineReducers({
  commerce: commerceReducer,
});

export default rootReducer;

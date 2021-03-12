import React from "react";

import { currencyReducer, CurrencyDefaultState } from "./entities/Currency";
import {
  currencyDataReducer,
  CurrencyDataDefaultState,
} from "./entities/CurrencyData";

/**
 * @typedef {(dispatch: DispatchFn, state: ApplicationState, fetchFn?: typeof window.fetch) => void} Thunk
 */

/**
 * @typedef {{type: string, payload?: object|Thunk}} Action
 */

/**
 * @typedef {Action} DispatchAction
 */

/**
 * @typedef {import("react").Dispatch<DispatchAction>} DispatchFn
 */

/**
 * @typedef {object} ApplicationState
 * @property {import("./entities/CurrencyData").CurrencyDataState} currencyData
 * @property {import("./entities/Currency").CurrencyState} currency
 */

/**
 * @type {ApplicationState}
 */
const defaultState = {
  currencyData: CurrencyDataDefaultState,
  currency: CurrencyDefaultState,
};

/**
 * state and dispatch overwritten in the `StoreProvider` function, but the type
 * checker complains if `createContext` is called without an argument.
 */
const StoreContext = React.createContext({
  state: defaultState,
  dispatch: (action) => {},
});

/**
 * @param {ApplicationState} state
 * @param {Action} action
 * @returns {ApplicationState}
 */
function storeReducer(state, action) {
  const nextState = {
    currencyData: currencyDataReducer(state.currencyData, action),
    currency: currencyReducer(state.currency, action),
  };
  const eq = Object.entries(nextState).map(([key, val]) => val === state[key]);
  return eq.includes(false) ? nextState : state;
}

export function StoreProvider({ children }) {
  const [state, _dispatch] = React.useReducer(storeReducer, defaultState);

  /**
   * @param {DispatchAction} action
   */
  const dispatch = (action) => {
    if (process.env.NODE_ENV === "development")
      console.debug(action.type, action.payload, state);
    if (typeof action.payload === "function") {
      action.payload(_dispatch, state);
    }
    _dispatch(action);
  };

  const value = { state, dispatch };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

/**
 * @returns {{ state: ApplicationState, dispatch: DispatchFn}}
 */
export function useStore() {
  const store = React.useContext(StoreContext);
  if (store === undefined) {
    throw new TypeError(
      "StoreProvider must be present at the root of your component tree.",
    );
  }
  return store;
}

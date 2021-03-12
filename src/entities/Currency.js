/**
 * Note: fx depends on global scope, so importing as an ES6 module causes issues with the window.fx.rates
 */
import fx from "money";

export const CurrencyActionTypes = {
  setCurrencyBaseCode: "setCurrencyBaseCode",
  setCurrencyBaseValue: "setCurrencyBaseValue",
  setCurrencyTargetCode: "setCurrencyTargetCode",
  setCurrencyTargetValue: "setCurrencyTargetValue",
};

/**
 * @typedef {object} CurrencyBaseCodePayload
 * @property {string} currencyBaseCode
 */

/**
 * @typedef {object} CurrencyBaseValuePayload
 * @property {string} currencyBaseValue
 */

/**
 * @typedef {object} CurrencyTargetCodePayload
 * @property {string} currencyTargetCode
 */

/**
 * @typedef {object} CurrencyTargetValuePayload
 * @property {string} currencyTargetValue
 */

export const CurrencyActions = {
  /**
   * @param {string} currencyBaseCode
   * @returns {{type:string,payload:CurrencyBaseCodePayload}}
   */
  setCurrencyBaseCode: (currencyBaseCode) => ({
    type: CurrencyActionTypes.setCurrencyBaseCode,
    payload: { currencyBaseCode },
  }),

  /**
   * @param {string} currencyBaseValue
   * @returns {{type:string,payload:CurrencyBaseValuePayload}}
   */
  setCurrencyBaseValue: (currencyBaseValue) => ({
    type: CurrencyActionTypes.setCurrencyBaseValue,
    payload: { currencyBaseValue },
  }),

  /**
   * @param {string} currencyTargetCode
   * @returns {{type:string,payload:CurrencyTargetCodePayload}}
   */
  setCurrencyTargetCode: (currencyTargetCode) => ({
    type: CurrencyActionTypes.setCurrencyTargetCode,
    payload: { currencyTargetCode },
  }),

  /**
   * @param {string} currencyTargetValue
   * @returns {{type:string,payload:CurrencyTargetValuePayload}}
   */
  setCurrencyTargetValue: (currencyTargetValue) => ({
    type: CurrencyActionTypes.setCurrencyTargetValue,
    payload: { currencyTargetValue },
  }),
};

/**
 * @typedef {object} CurrencyState
 * @property {string} currencyBaseCode
 * @property {string} currencyBaseValue
 * @property {string} currencyTargetCode
 * @property {string} currencyTargetValue
 */
export const CurrencyDefaultState = {
  currencyBaseCode: "USD",
  currencyBaseValue: "0.00",
  currencyTargetCode: "USD",
  currencyTargetValue: "0.00",
};

/**
 * @param {CurrencyState} state
 * @param {import("../StoreProvider").Action} action
 * @returns {CurrencyState}
 */
export function currencyReducer(state = CurrencyDefaultState, action) {
  switch (action.type) {
    case CurrencyActionTypes.setCurrencyBaseCode: {
      /**
       * @type CurrencyBaseCodePayload
       */
      const { currencyBaseCode } = action.payload;
      try {
        const currencyTargetValue = fx.convert(state.currencyBaseValue, {
          from: currencyBaseCode,
          to: state.currencyTargetCode
        });
        return { ...state, currencyBaseCode, currencyTargetValue };
      } catch(e) {
        console.error(e);
      }
      return { ...state, currencyBaseCode };
    }

    case CurrencyActionTypes.setCurrencyBaseValue: {
      /**
       * @type CurrencyBaseValuePayload
       */
      const { currencyBaseValue } = action.payload;
      const currencyTargetValue = fx.convert(currencyBaseValue, {
        from: state.currencyBaseCode,
        to: state.currencyTargetCode,
      });
      return { ...state, currencyBaseValue, currencyTargetValue };
    }

    case CurrencyActionTypes.setCurrencyTargetCode: {
      /**
       * @type CurrencyTargetCodePayload
       */
      const { currencyTargetCode } = action.payload;
      try {
        const currencyTargetValue = fx.convert(state.currencyBaseValue, {
          from: state.currencyBaseCode,
          to: currencyTargetCode
        });
        return { ...state, currencyTargetCode, currencyTargetValue };
      } catch(e) {
        console.error(e);
      }
      return { ...state, currencyTargetCode };
    }

    case CurrencyActionTypes.setCurrencyTargetValue: {
      /**
       * @type CurrencyTargetValuePayload
       */
      const { currencyTargetValue } = action.payload;
      const currencyBaseValue = fx.convert(currencyTargetValue, {
        from: state.currencyTargetCode,
        to: state.currencyBaseCode,
      });
      return { ...state, currencyBaseValue, currencyTargetValue };
    }

    default: {
      return state;
    }
  }
}

/**
 * @param {import("../StoreProvider").ApplicationState} state
 * @returns {string}
 */
export const selectCurrencyBaseCode = (state) =>
  state.currency.currencyBaseCode;

/**
 * @param {import("../StoreProvider").ApplicationState} state
 * @returns {string}
 */
export const selectCurrencyBaseValue = (state) =>
  state.currency.currencyBaseValue;

/**
 * @param {import("../StoreProvider").ApplicationState} state
 * @returns {string}
 */
export const selectCurrencyTargetCode = (state) =>
  state.currency.currencyTargetCode;

/**
 * @param {import("../StoreProvider").ApplicationState} state
 * @returns {string}
 */
export const selectCurrencyTargetValue = (state) =>
  state.currency.currencyTargetValue;

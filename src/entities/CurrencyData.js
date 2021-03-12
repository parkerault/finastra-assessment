import {fetchCurrencyData as _fetchCurrencyData} from "../tasks/fetchCurrencyData"
/**
 * @typedef {object} CurrencyDataState
 * @property {boolean} isLoading
 * @property {boolean} isLoaded
 * @property {string} errorText
 * @property {ExchangeRates} exchangeRates
 * @property {Object.<string, CurrencyMetadata>} currencyMetadata
 */

/**
 * @typedef {object} ExchangeRates
 * @property {Object.<string, number>} rates - The exchange rates keyed by a
 * three letter currency symbol.
 * @property {string} base - Three letter currency symbol
 * @property {string} date - YYYY/MM/DD
 */

/**
 * @typedef {object} CurrencyMetadata
 * @property {string} code
 * @property {number} decimal_digits
 * @property {string} name
 * @property {string} name_plural
 * @property {number} rounding
 * @property {string} symbol
 * @property {string} symbol_native
 */

/**
 * @type {Object.<string, string>}
 */
export const CurrencyDataActionTypes = {
  setIsLoading: "setIsLoading",
  setIsLoaded: "setIsLoaded",
  setErrorTest: "setErrorText",
  setExchangeRates: "setExchangeRates",
  setCurrencyMetadata: "setCurrencyMetadata",
};

/**
 * @typedef {object} IsLoadingPayload
 * @property {boolean} isLoading
 */

/**
 * @typedef {object} IsLoadedPayload
 * @property {boolean} isLoaded
 */

/**
 * @typedef {object} errorTextPayload
 * @property {string} errorText
 */

/**
 * @typedef {object} ExchangeRatesPayload
 * @property {ExchangeRates} exchangeRates
 */

/**
 * @typedef {object} CurrencyMetadataPayload
 * @property {Object.<string, CurrencyMetadata>} currencyMetadata
 */

export const CurrencyDataActions = {
  fetchCurrencyData: () => ({
    type: CurrencyDataActionTypes.fetchCurrencyData,
    payload: _fetchCurrencyData
  }),

  /**
   * @param {boolean} isLoading
   */
  setIsLoading: (isLoading) => ({
    type: CurrencyDataActionTypes.setIsLoading,
    payload: { isLoading },
  }),

  /**
   * @param {boolean} isLoaded
   */
  setIsLoaded: (isLoaded) => ({
    type: CurrencyDataActionTypes.setIsLoaded,
    payload: { isLoaded },
  }),

  /**
   * @param {string} errorText
   */
  setErrorText: (errorText) => ({
    type: CurrencyDataActionTypes.setErrorText,
    payload: { errorText },
  }),

  /**
   * @param {ExchangeRates} exchangeRates
   */
  setExchangeRates: (exchangeRates) => ({
    type: CurrencyDataActionTypes.setExchangeRates,
    payload: { exchangeRates },
  }),

  /**
   * @param {string} currencyMetadata
   */
  setCurrencyMetadata: (currencyMetadata) => ({
    type: CurrencyDataActionTypes.setCurrencyMetadata,
    payload: { currencyMetadata },
  }),
};

/**
 * @type {CurrencyDataState}
 */

export const CurrencyDataDefaultState = {
  isLoading: false,
  isLoaded: false,
  errorText: "",
  exchangeRates: {
    rates: {},
    base: "",
    date: "",
  },
  currencyMetadata: {},
};

/**
 * @param {CurrencyDataState} state
 * @param {import("../StoreProvider").Action} action
 * @returns {CurrencyDataState} CurrencyMetadataState
 */
export function currencyDataReducer(state = CurrencyDataDefaultState, action) {
  switch (action.type) {
    case CurrencyDataActionTypes.setIsLoading: {
      /**
       * @type IsLoadingPayload
       */
      const { isLoading } = action.payload;
      return { ...state, isLoading };
    }

    case CurrencyDataActionTypes.setIsLoaded: {
      /**
       * @type IsLoadedPayload
       */
      const { isLoaded } = action.payload;
      return { ...state, isLoaded, errorText: "" };
    }

    case CurrencyDataActionTypes.setErrorText: {
      /**
       * @type errorTextPayload
       */
      const { errorText } = action.payload;
      return { ...state, errorText };
    }

    case CurrencyDataActionTypes.setExchangeRates: {
      /**
       * @type ExchangeRatesPayload
       */
      const { exchangeRates } = action.payload;
      return { ...state, exchangeRates };
    }

    case CurrencyDataActionTypes.setCurrencyMetadata: {
      /**
       * Some values in the set of metadata have keys that do not match their
       * currency codes, so they have to be re-indexed to avoid breaking the
       * select inputs.
       */
      /**
       * @type Object.<string, CurrencyMetadata>
       */
      const currencyMetadata = Object.values(
        action.payload.currencyMetadata,
      ).reduce((acc, data) => {
        acc[data.code] = data;
        return acc;
      }, {});
      return { ...state, currencyMetadata };
    }

    default:
      return state;
  }
}

/**
 * @type {CurrencyMetadata}
 */
const nullMetadata = {
  code: "",
  decimal_digits: 2,
  name: "",
  name_plural: "",
  rounding: 2,
  symbol: "",
  symbol_native: "",
};

/**
 * @param {import("../StoreProvider").ApplicationState} state
 * @returns {boolean}
 */
export const selectIsLoaded = (state) => state.currencyData.isLoaded;

/**
 * @param {import("../StoreProvider").ApplicationState} state
 * @returns {boolean}
 */
export const selectIsLoading = (state) => state.currencyData.isLoading;

/**
 * @param {import("../StoreProvider").ApplicationState} state
 * @returns {string}
 */
export const selectErrorText = (state) => state.currencyData.errorText;

/**
 * @param {import("../StoreProvider").ApplicationState} state
 * @returns {Object.<string, CurrencyMetadata>}
 */
export const selectCurrencyMetadata = (state) =>
  state.currencyData.currencyMetadata;

/**
 * @param {import("../StoreProvider").ApplicationState} state
 * @param {{ code: string }} props
 * @returns {CurrencyMetadata}
 */
export const selectCurrencyMetadataByCode = (state, { code }) => {
  const metadata = selectCurrencyMetadata(state);
  return metadata?.[code] ?? nullMetadata;
};

/**
 * @param {import("../StoreProvider").ApplicationState} state
 * @returns {string[]}
 */
export const selectCurrencyCodes = (state) =>
  Object.values(state.currencyData.currencyMetadata).map((m) => m.code ?? "");

/**
 * @param {import("../StoreProvider").ApplicationState} state
 * @returns {ExchangeRates}
 */
export const selectExchangeRates = (state) => state.currencyData.exchangeRates;

/**
 * @param {import("../StoreProvider").ApplicationState} state
 * @param {{ code: string }} props
 * @returns {number}
 */
export const selectExchangeRateByCode = (state, { code }) =>
  state.currencyData.exchangeRates.rates[code] ?? NaN;

/**
 * @param {import("../StoreProvider").ApplicationState} state
 * @param {{ code: string }} props
 * @returns {boolean}
 */
export const selectExchangeRateAvailable = (state, { code }) =>
  !isNaN(selectExchangeRateByCode(state, { code }));

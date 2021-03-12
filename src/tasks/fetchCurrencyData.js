import { CurrencyActions } from "../entities/Currency";
import {
  CurrencyDataActions,
  selectIsLoaded,
} from "../entities/CurrencyData";

import fx from "money";

/**
 * @param {import("react").Dispatch<import("../StoreProvider").DispatchAction>} dispatch
 * @param {import("../StoreProvider").ApplicationState} state
 * @param {typeof window.fetch} fetchFn
 */
export async function fetchCurrencyData(
  dispatch,
  state,
  fetchFn = window.fetch,
) {
  const isLoaded = selectIsLoaded(state);
  if (!isLoaded) {
    dispatch(CurrencyDataActions.setIsLoading(true));
    try {
      let metadata = await request(
        "https://gist.githubusercontent.com/mddenton/062fa4caf150bdf845994fc7a3533f74/raw/27beff3509eff0d2690e593336179d4ccda530c2/Common-Currency.json",
        fetchFn,
      );
      let exchangeRates = await request(
        "https://api.exchangeratesapi.io/latest?base=USD",
        fetchFn,
      );
      fx.base = exchangeRates.base;
      fx.rates = exchangeRates.rates;
      dispatch(CurrencyDataActions.setCurrencyMetadata(metadata));
      dispatch(CurrencyDataActions.setExchangeRates(exchangeRates));
      dispatch(CurrencyActions.setCurrencyBaseCode(exchangeRates.base))
      dispatch(CurrencyActions.setCurrencyTargetCode(exchangeRates.base))
      dispatch(CurrencyDataActions.setIsLoaded(true));
      dispatch(CurrencyDataActions.setIsLoading(false));
    } catch (error) {
      console.error(error);
      dispatch(CurrencyDataActions.setIsLoading(false));
      dispatch(CurrencyDataActions.setErrorText(error.message))
    }
  }
}

/**
 * @param {string} url
 * @param {typeof window.fetch} fetchFn
 * @returns {Promise}
 */
async function request(url, fetchFn = window.fetch) {
  const response = await fetchFn(url);
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(
      `Request failed with ${response.status}: ${response.statusText}`,
    );
  }
}

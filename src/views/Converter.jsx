import React from "react";
import {
  CurrencyActions,
  selectCurrencyBaseCode,
  selectCurrencyBaseValue,
  selectCurrencyTargetCode,
  selectCurrencyTargetValue,
} from "../entities/Currency";
import {
  selectCurrencyCodes,
  selectCurrencyMetadataByCode,
  selectErrorText,
  selectExchangeRateAvailable,
  selectIsLoaded,
  selectIsLoading,
} from "../entities/CurrencyData";
import { useStore } from "../StoreProvider";

import "./Converter.css";
import { CurrencyInput } from "./CurrencyInput";
import { CurrencySelect } from "./CurrencySelect";

export function Converter() {
  const { state, dispatch } = useStore(),
    currencyBaseCode = selectCurrencyBaseCode(state),
    currencyTargetCode = selectCurrencyTargetCode(state),
    currencyBaseValue = selectCurrencyBaseValue(state),
    currencyTargetValue = selectCurrencyTargetValue(state),
    currencyBase = selectCurrencyMetadataByCode(state, {
      code: currencyBaseCode,
    }),
    currencyTarget = selectCurrencyMetadataByCode(state, {
      code: currencyTargetCode,
    }),
    currencyBaseAvailable = selectExchangeRateAvailable(state, {
      code: currencyBaseCode,
    }),
    currencyTargetAvailable = selectExchangeRateAvailable(state, {
      code: currencyTargetCode,
    }),
    currencyCodes = selectCurrencyCodes(state),
    isLoading = selectIsLoading(state),
    isLoaded = selectIsLoaded(state),
    errorText = selectErrorText(state);

  useCSSContent(".label-base::after", currencyBase.symbol_native || "--");
  useCSSContent(".label-target::after", currencyTarget.symbol_native || "--");

  return (
    <>
      <div className="inputs">
        <CurrencyInput
          value={currencyBaseValue}
          currencyMetadata={currencyBase}
          labelText="Base:"
          classNames={{ label: "label-base" }}
          onChange={(e) =>
            dispatch(CurrencyActions.setCurrencyBaseValue(e.target.value))
          }
          isLoaded={isLoaded}
          isAvailable={currencyBaseAvailable}
        />
        <CurrencySelect
          value={currencyBase.code}
          currencyCodes={currencyCodes}
          onChange={(e) =>
            dispatch(CurrencyActions.setCurrencyBaseCode(e.target.value))
          }
          isLoaded={isLoaded}
        />
        <CurrencyInput
          value={currencyTargetValue}
          currencyMetadata={currencyTarget}
          labelText="Target:"
          classNames={{ label: "label-target" }}
          onChange={(e) =>
            dispatch(CurrencyActions.setCurrencyTargetValue(e.target.value))
          }
          isLoaded={isLoaded}
          isAvailable={currencyTargetAvailable}
        />
        <CurrencySelect
          value={currencyTarget.code}
          currencyCodes={currencyCodes}
          onChange={(e) =>
            dispatch(CurrencyActions.setCurrencyTargetCode(e.target.value))
          }
          isLoaded={isLoaded}
        />
      </div>
      <div className="input-validation">
        <div className="input-validation-base">
          {isLoaded && !currencyBaseAvailable &&
            `The exchange rates for ${currencyBaseCode} are not available.`}
        </div>
        <div className="input-validation-target">
          {isLoaded && !currencyTargetAvailable &&
            `The exchange rates for ${currencyTargetCode} are not available.`}
        </div>
      </div>
      <div className="status-text">
        {isLoading && <div>Loading...</div>}
        {errorText !== "" && <div>{errorText}</div>}
      </div>
    </>
  );
}

/**
 * @param {string} selector
 * @param {string} content
 */
function useCSSContent(selector, content) {
  let rule;
  React.useEffect(() => {
    rule = rule || document.createElement("style");
    rule.innerText = `${selector} { content: "${content}" !important; }`;
    /* TODO: check if already appended. */
    document.head.appendChild(rule);
  }, [content]);
}

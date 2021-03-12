import React from "react";

/**
 * @typedef {object} CurrencyInputProps
 * @property {import('../entities/CurrencyData').CurrencyMetadata} currencyMetadata
 * @property {string} value
 * @property {React.ChangeEventHandler<HTMLInputElement>} onChange
 * @property {boolean} isLoaded
 * @property {boolean} isAvailable
 * @property {string} labelText
 * @property {{label?:string,input?:string}} [classNames]
 */

/**
 * @param {CurrencyInputProps} props
 */
export function CurrencyInput(props) {
  const onChange = useCurrencyRTLInput(props.onChange, props.currencyMetadata.decimal_digits);
  return (
    <label
      htmlFor={props.currencyMetadata.code}
      className={`input-label ${props.classNames?.label} ${!props.isLoaded || !props.isAvailable ? "input-disabled" : ""}`}
    >
      <div className="input-label-text">{props.labelText}</div>
      <input
        type="text"
        className="currency-field"
        id={props.currencyMetadata.code}
        value={parseFloat(props.value).toFixed(props.currencyMetadata.decimal_digits)}
        disabled={!props.isLoaded || !props.isAvailable}
        onFocus={moveToEnd}
        onSelect={moveToEnd}
        onKeyPress={(e) => {
          if (!e.key.match(/\d/)) e.preventDefault();
        }}
        onChange={onChange}
      />
    </label>
  );
}

/**
 * @typedef {React.ChangeEventHandler<HTMLInputElement>} InputChangeEventHandler
 * @typedef {React.MutableRefObject<HTMLInputElement>} InputRef
 */

/**
 * @param {InputChangeEventHandler} callback
 * @param {number} decimalDigits
 * @returns {InputChangeEventHandler}
 */
function useCurrencyRTLInput(callback, decimalDigits) {
  /**
   * @type InputChangeEventHandler
   */
  return (e) => {
    const pointless = e.target.value.replace(".", ""),
      length = pointless.length,
      ints = pointless.slice(0, length - decimalDigits),
      decimals = pointless.slice(-decimalDigits),
      newValue = parseFloat(`${ints}.${decimals}`).toString();
    e.target.value = newValue;
    callback(e);
  };
}

function moveToEnd(e) {
  const len = e.target.value.length;
  e.target.setSelectionRange(len, len);
}

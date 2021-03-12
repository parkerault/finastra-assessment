import React from "react";

/**
 * @typedef {object} CurrencySelectProps
 * @property {string} value
 * @property {React.ChangeEventHandler<HTMLSelectElement>} onChange
 * @property {string[]} currencyCodes
 * @property {boolean} isLoaded
 * @property {{label:string,select:string}} [classNames]
 */

/**
 * @param {CurrencySelectProps} props
 * @returns
 */

export function CurrencySelect(props) {
  const selectOptions = props.currencyCodes.map((code) => (
    <option key={code} value={code}>
      {code}
    </option>
  ));
  return (
    <label
      htmlFor={props.value}
      className={`select-label ${props.classNames?.label ?? ""} ${
        !props.isLoaded ? "input-disabled" : ""
      }`}
    >
      <select
        id={props.value}
        value={props.value}
        className={`select-field ${props.classNames?.select ?? ""}`}
        onChange={props.onChange}
        disabled={!props.isLoaded}
      >
        {selectOptions}
      </select>
    </label>
  );
}

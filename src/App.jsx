import React, { useEffect } from "react";
import { CurrencyDataActions, selectIsLoaded } from "./entities/CurrencyData";
import { useStore } from "./StoreProvider";
import { Converter } from "./views/Converter";
import { ErrorBoundary } from "./views/ErrorBoundary";

export function App() {
  const { state, dispatch } = useStore();
  const isLoaded = selectIsLoaded(state);
  useEffect(() => {
    if (!isLoaded) {
      dispatch(CurrencyDataActions.fetchCurrencyData());
    }
  }, []);
  return (
    <div className="app">
      <ErrorBoundary>
        <h1 className="app-title">🤑 Currency Converter</h1>
        <Converter />
      </ErrorBoundary>
    </div>
  );
}

## Feedback on the Requirements

The requirements are a bit confusing. The first paragraph mandates the use of a static json file at https://gist.githubusercontent.com/mddenton/062fa4caf150bdf845994fc7a3533f74/raw/27beff3509eff0d2690e593336179d4ccda530c2/Common-Currency.json. Subsequently, it says currency rates are available at https://api.exchangeratesapi.io/latest?base=USD, then suggests showing errors to the user based on currency data from **fixer.io**. To add further confusion, the **money.js** library is associated with the **Open Exchange Rates** service. I figured it out eventually, but you might want to revise the wording of the requirements documentation.

Additionally, it appears that **money.js** is unmaintained (the last commit was 7 years ago) and doesn't include any type definitions. It also uses an API centered around global mutable data, which doesn't play well with idiomatic react. https://github.com/xxczaki/cashify claims to be the spiritual successor to **money.js** and appears to be actively maintained.

## Notes on the Implementation

I'm a proponent of the react/redux-style architecture. In my experience it works very well for almost any problem domain, so even though I didn't use redux in this application I used the same architecture I would have if I were using redux. Normally I would use redux-saga for all async/effectful business logic, since the co-routine pattern it uses is easy to run in a test environment without having to worry about extensive mocking or side effects. For the sake of simplicity I've used thunk-style tasks instead. I also skipped unit testing because of time constraints, but I generally practice TDD otherwise.

I use a few conventions in my react applications:
  - All UI components should be pure functions. React hooks are technically impure but are generally safe in practice, so long as all code with external side effects is kept outside of the component.
  - There should never be any business logic in the UI components. Only data transformation.
  - Accessing values in the global state tree should be abstracted into selectors for maintainability and performance. Selectors that return a derived value should always be memoized.
  - Any business logic that requires async/sequential operations should be handled in a "task". When using redux this would typically be executed by a middleware. This application executes thunks from the StoreProvider module.
  - React components should be either a data component, concerned only with selecting and manipulating application state, or a view component, concerned only with presentation. For example, the data component selects and parses an ISO date; the view component transforms it into a localized string.
  - I prefer to use the Flux Standard Action convention, and recommend requiring the `payload` and `metadata` properties to always be an object for increased flexibility when writing redux middleware.
  - Selectors should always use the same `(state, props) => value` signature so selectors with multiple parameters can be composed.
  - Lastly, if not using typescript, all types should be annotated in JSDoc comment blocks for use with the `checkJS` feature of the typescript compiler. This has excellent integration with VSCode.

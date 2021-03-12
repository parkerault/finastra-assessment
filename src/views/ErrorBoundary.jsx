import React from "react";

export class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? (
      <>
        <h1>Opps, something went wrong!</h1>
        <h3>Try refreshing the page...</h3>
      </>
    ) : (
      this.props.children
    );
  }
}

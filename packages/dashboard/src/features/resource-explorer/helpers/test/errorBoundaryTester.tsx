import React, { useState } from 'react';

/**
 * Render this component inside of an `<ErrorBoundary />` and click the button
 * to trigger the error boundary. For use in testing and development of error
 * handling.
 */
export function ErrorBoundaryTester() {
  // the error needs to be held in state through re-renders
  const [throwError, setThrowError] = useState(false);

  if (throwError) {
    // we need to throw the error every render
    throw new Error();
  }

  return (
    <>
      <div>error fallback is not being rendered</div>
      <button onClick={() => setThrowError(true)}>EXPLODE</button>
    </>
  );
}

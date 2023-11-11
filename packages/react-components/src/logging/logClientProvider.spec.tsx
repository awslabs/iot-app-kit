import React from 'react';
import { render } from '@testing-library/react';
import { LogClientProvider, useLogClientProviderContext } from './logClientProvider';

const TestingComponent = () => {
  const { logClient } = useLogClientProviderContext();

  return <>{logClient != null && <div data-testid='is-defined'></div>}</>;
};

class MockLogClient {
  record() {}
}

describe('LogClientProvider', () => {
  test('does not provide LogClient by default', () => {
    const { queryByTestId } = render(
      <LogClientProvider>
        <TestingComponent />
      </LogClientProvider>
    );

    const isDefined = queryByTestId('is-defined');

    expect(isDefined).toBeNull();
  });

  test('provides given LogClient', () => {
    const { queryByTestId } = render(
      <LogClientProvider logClient={new MockLogClient()}>
        <TestingComponent />
      </LogClientProvider>
    );

    const isDefined = queryByTestId('is-defined');

    expect(isDefined).not.toBeNull();
  });
});

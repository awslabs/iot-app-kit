import React from 'react';
import { render } from '@testing-library/react';
import { MetricClientProvider, useMetricClientProviderContext } from './metricClientProvider';

const TestingComponent = () => {
  const { metricClient } = useMetricClientProviderContext();

  return <>{metricClient != null && <div data-testid='is-defined'></div>}</>;
};

class MockMetricClient {
  record() {}
}

describe('MetricClientProvider', () => {
  test('does not provide MetricClient by default', () => {
    const { queryByTestId } = render(
      <MetricClientProvider>
        <TestingComponent />
      </MetricClientProvider>
    );

    const isDefined = queryByTestId('is-defined');

    expect(isDefined).toBeNull();
  });

  test('provides given MetricClient', () => {
    const { queryByTestId } = render(
      <MetricClientProvider metricClient={new MockMetricClient()}>
        <TestingComponent />
      </MetricClientProvider>
    );

    const isDefined = queryByTestId('is-defined');

    expect(isDefined).not.toBeNull();
  });
});

import type { Logger } from '../logger/logger.interface';
import type { MetricsRecorder } from '../metric-recorder/metricsRecorder.interface';
import { getLogger, getMetricsRecorder, registerLogger, registerMetricsRecorder } from './pluginsRegistry';

describe('Logger registry', () => {
  class MockLogClient implements Logger {
    log() {}
    error() {}
    warn() {}
  }

  test('does not provide logger by default', () => {
    const logger = getLogger();

    expect(logger).toBeUndefined();
  });

  test('provides given logger', () => {
    const mockLogClient = new MockLogClient();
    const mockProvider = jest.fn().mockReturnValue(mockLogClient);

    registerLogger({
      provider: mockProvider,
    });
    const logger = getLogger();

    expect(logger).toBe(mockLogClient);
    expect(mockProvider).toBeCalled();
  });
});

describe('MetricsRecorder registry', () => {
  class MockMetricsRecorder implements MetricsRecorder {
    record() {}
  }

  test('does not provide MetricsRecorder by default', () => {
    const metricsRecorder = getMetricsRecorder();

    expect(metricsRecorder).toBeUndefined();
  });

  test('provides given MetricsRecorder', () => {
    const mockMetricsRecorder = new MockMetricsRecorder();
    const mockProvider = jest.fn().mockReturnValue(mockMetricsRecorder);

    registerMetricsRecorder({
      provider: mockProvider,
    });
    const metricsRecorder = getMetricsRecorder();

    expect(metricsRecorder).toBe(mockMetricsRecorder);
    expect(mockProvider).toBeCalled();
  });
});

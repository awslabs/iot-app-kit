import type { Logger } from '../logger/logger.interface';
import type { MetricsRecorder } from '../metricRecorder/metricsRecorder.interface';
import { registerPlugin, getPlugin } from './pluginsRegistry';

describe('Logger registry', () => {
  class MockLogClient implements Logger {
    log() {}
    error() {}
    warn() {}
  }

  test('does not provide logger by default', () => {
    const logger = getPlugin('logger');

    expect(logger).toBeUndefined();
  });

  test('provides given logger', () => {
    const mockLogClient = new MockLogClient();
    const mockProvider = vi.fn().mockReturnValue(mockLogClient);

    registerPlugin('logger', {
      provider: mockProvider,
    });
    const logger = getPlugin('logger');

    expect(logger).toBe(mockLogClient);
    expect(mockProvider).toBeCalled();
  });
});

describe('MetricsRecorder registry', () => {
  class MockMetricsRecorder implements MetricsRecorder {
    record() {}
  }

  test('does not provide MetricsRecorder by default', () => {
    const metricsRecorder = getPlugin('metricsRecorder');

    expect(metricsRecorder).toBeUndefined();
  });

  test('provides given MetricsRecorder', () => {
    const mockMetricsRecorder = new MockMetricsRecorder();
    const mockProvider = vi.fn().mockReturnValue(mockMetricsRecorder);

    registerPlugin('metricsRecorder', {
      provider: mockProvider,
    });
    const metricsRecorder = getPlugin('metricsRecorder');

    expect(metricsRecorder).toBe(mockMetricsRecorder);
    expect(mockProvider).toBeCalled();
  });
});

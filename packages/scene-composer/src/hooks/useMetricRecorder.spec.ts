import { getGlobalSettings } from '../common/GlobalSettings';
import useLogger from '../logger/react-logger/hooks/useLogger';

import useMetricRecorder from './useMetricRecorder';

vi.mock('../logger/react-logger/hooks/useLogger');

vi.mock('../common/GlobalSettings', () => ({
  getGlobalSettings: vi.fn(() => ({})),
}));

describe('useMetricRecorder hook', () => {
  it('should fallback to default recorder when not set in global settings', () => {
    const logger = useLogger as vi.Mock;
    const verboseLogger = vi.fn();

    logger.mockImplementationOnce(() => ({
      verbose: verboseLogger,
    }));

    const recorder = useMetricRecorder();
    recorder.recordClick('context', 'detail');

    expect(verboseLogger).toBeCalledWith('context', 'detail');
  });

  it('should use globalSettings metric Recorder if available', () => {
    const globalSettings = getGlobalSettings as vi.Mock;
    const metricRecorder = {
      recordClick: vi.fn(),
    };

    globalSettings.mockImplementationOnce(() => ({
      metricRecorder,
    }));

    const recorder = useMetricRecorder();
    recorder.recordClick('context', 'detail');

    expect(metricRecorder.recordClick).toBeCalledWith('context', 'detail');
  });
});

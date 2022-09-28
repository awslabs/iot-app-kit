import { getGlobalSettings } from '../common/GlobalSettings';
import useLogger from '../logger/react-logger/hooks/useLogger';

import useMetricRecorder from './useMetricRecorder';

jest.mock('../logger/react-logger/hooks/useLogger');

jest.mock('../common/GlobalSettings', () => ({
  getGlobalSettings: jest.fn(() => ({})),
}));

describe('useMetricRecorder hook', () => {
  it('should fallback to default recorder when not set in global settings', () => {
    const logger = useLogger as jest.Mock;
    const verboseLogger = jest.fn();

    logger.mockImplementationOnce(() => ({
      verbose: verboseLogger,
    }));

    const recorder = useMetricRecorder();
    recorder.recordClick('context', 'detail');

    expect(verboseLogger).toBeCalledWith('context', 'detail');
  });

  it('should use globalSettings metric Recorder if available', () => {
    const globalSettings = getGlobalSettings as jest.Mock;
    const metricRecorder = {
      recordClick: jest.fn(),
    };

    globalSettings.mockImplementationOnce(() => ({
      metricRecorder,
    }));

    const recorder = useMetricRecorder();
    recorder.recordClick('context', 'detail');

    expect(metricRecorder.recordClick).toBeCalledWith('context', 'detail');
  });
});

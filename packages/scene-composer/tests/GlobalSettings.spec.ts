import { getGlobalSettings, setDebugMode, setDracoDecoder, setMetricRecorder, setFeatureConfig } from '../src';

describe('GlobalSettings', () => {
  it('should be able to setDebugMode', () => {
    expect(getGlobalSettings().debugMode).toEqual(false);
    setDebugMode();
    expect(getGlobalSettings().debugMode).toEqual(true);
  });

  it('should be able to setDracoDecoder', () => {
    expect(getGlobalSettings().dracoDecoder.enable).toEqual(true);
    setDracoDecoder({ enable: false });
    expect(getGlobalSettings().dracoDecoder.enable).toEqual(false);
  });

  it('should be able to setMetricRecorder', () => {
    const mockRecorder = { abc: 'def' };
    expect(getGlobalSettings().metricRecorder).toBeUndefined();
    setMetricRecorder(mockRecorder as any);
    expect(getGlobalSettings().metricRecorder).toEqual(mockRecorder);
  });

  it('should be able to setFeatureConfig', () => {
    const mockConfig = { abc: 'def' };
    expect(getGlobalSettings().featureConfig).toEqual({});
    setFeatureConfig(mockConfig as any);
    expect(getGlobalSettings().featureConfig).toEqual(mockConfig);
  });
});

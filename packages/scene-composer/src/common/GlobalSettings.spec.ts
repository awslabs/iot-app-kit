import {
  getGlobalSettings,
  setDebugMode,
  setDracoDecoder,
  setMetricRecorder,
  setFeatureConfig,
  setOnFlashMessage,
} from './GlobalSettings';

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

  it('should be able to setOnFlashMessage', () => {
    let testValue = 0;
    const mockCallback = () => {
      testValue = 1;
    };
    expect(getGlobalSettings().onFlashMessage).toBeUndefined();
    setOnFlashMessage(mockCallback);
    expect(getGlobalSettings().onFlashMessage).toEqual(mockCallback);
    getGlobalSettings().onFlashMessage!({});
    expect(testValue).toEqual(1);
  });
});

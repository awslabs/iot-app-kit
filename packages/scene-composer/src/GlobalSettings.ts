import { COMPOSER_FEATURES, FeatureConfig, GetSceneObjectFunction } from './interfaces';
import { IMetricRecorder } from './interfaces/metricRecorder';

export interface DracoDecoderConfig {
  enable: boolean;
  path?: string;
}

const globalSettings: {
  debugMode: boolean;
  dracoDecoder: DracoDecoderConfig;
  locale: string;
  cdnPath: string | undefined;
  shouldEnableDataBindingTemplate: boolean;
  metricRecorder?: IMetricRecorder;
  featureConfig: FeatureConfig;
  getSceneObjectFunction: GetSceneObjectFunction | undefined;
} = {
  debugMode: false,
  dracoDecoder: { enable: true },
  locale: 'en-US',
  cdnPath: undefined,
  shouldEnableDataBindingTemplate: false,
  metricRecorder: undefined,
  // default to disable all features
  featureConfig: {},
  getSceneObjectFunction: undefined,
};

const changeSubscribers = [] as Function[];

const notifySubscribers = () => {
  changeSubscribers.forEach((sub) => sub());
};

export const setDebugMode = () => {
  globalSettings.debugMode = true;
  notifySubscribers();
};

export const setDracoDecoder = (dracoDecoder: DracoDecoderConfig) => {
  globalSettings.dracoDecoder = dracoDecoder;
  notifySubscribers();
};
export const setLocale = (locale: string) => {
  globalSettings.locale = locale;
  notifySubscribers();
};

export const setCdnPath = (path: string | undefined) => {
  globalSettings.cdnPath = path;
  notifySubscribers();
};

// Before we have feature flag, we use global settings to control this new feature
export const enableDataBindingTemplate = () => {
  globalSettings.shouldEnableDataBindingTemplate = true;
  notifySubscribers();
};

export const setMetricRecorder = (metricRecorder: IMetricRecorder) => {
  globalSettings.metricRecorder = metricRecorder;
  notifySubscribers();
};

export const setFeatureConfig = (featureConfig: Partial<Record<COMPOSER_FEATURES, boolean>>) => {
  globalSettings.featureConfig = featureConfig;
  notifySubscribers();
};

export const setGetSceneObjectFunction = (getSceneObjectFunction: GetSceneObjectFunction) => {
  globalSettings.getSceneObjectFunction = getSceneObjectFunction;
  notifySubscribers();
};

export const getGlobalSettings = (): Readonly<typeof globalSettings> => {
  return globalSettings;
};

export const subscribe = (callback: Function) => {
  changeSubscribers.push(callback);
};

export const unsubscribe = (callback: Function) => {
  changeSubscribers.splice(changeSubscribers.indexOf(callback), 1);
};

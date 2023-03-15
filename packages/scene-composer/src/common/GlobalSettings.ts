import { DracoDecoderConfig, Get3pConnectionListFunction, GetSceneInfoFunction, GetSceneObjectFunction, UpdateSceneFunction } from '../interfaces/sceneViewer';
import { COMPOSER_FEATURES, FeatureConfig } from '../interfaces';
import { IMetricRecorder } from '../interfaces/metricRecorder';

const globalSettings: {
  debugMode: boolean;
  dracoDecoder: DracoDecoderConfig;
  locale: string;
  metricRecorder?: IMetricRecorder;
  featureConfig: FeatureConfig;
  getSceneObjectFunction: GetSceneObjectFunction | undefined;
  getSceneInfoFunction: GetSceneInfoFunction | undefined;
  updateSceneFunction: UpdateSceneFunction | undefined;
  get3pConnectionListFunction: Get3pConnectionListFunction | undefined;
} = {
  debugMode: false,
  dracoDecoder: { enable: true },
  locale: 'en-US',
  metricRecorder: undefined,
  // default to disable all features
  featureConfig: {},
  getSceneObjectFunction: undefined,
  getSceneInfoFunction: undefined,
  updateSceneFunction: undefined,
  get3pConnectionListFunction: undefined,
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

export const setGetSceneInfoFunction = (getSceneInfoFunction: GetSceneInfoFunction) => {
  globalSettings.getSceneInfoFunction = getSceneInfoFunction;
  notifySubscribers();
};

export const setUpdateSceneFunction = (updateSceneFunction: UpdateSceneFunction) => {
  globalSettings.updateSceneFunction = updateSceneFunction;
  notifySubscribers();
};

export const setGet3pConnectionListFunction = (get3pConnectionListFunction: Get3pConnectionListFunction) => {
  globalSettings.get3pConnectionListFunction = get3pConnectionListFunction;
  notifySubscribers();
};

export const getGlobalSettings = () => {
  return globalSettings;
};

export const subscribe = (callback: Function) => {
  changeSubscribers.push(callback);
};

export const unsubscribe = (callback: Function) => {
  changeSubscribers.splice(changeSubscribers.indexOf(callback), 1);
};

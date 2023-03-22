import { TwinMakerSceneMetadataModule } from '@iot-app-kit/source-iottwinmaker';
import { MpSdk } from '@matterport/r3f/dist';

import { DracoDecoderConfig, GetSceneObjectFunction } from '../interfaces/sceneViewer';
import { COMPOSER_FEATURES, FeatureConfig } from '../interfaces';
import { IMetricRecorder } from '../interfaces/metricRecorder';

const globalSettings: {
  debugMode: boolean;
  dracoDecoder: DracoDecoderConfig;
  locale: string;
  metricRecorder?: IMetricRecorder;
  featureConfig: FeatureConfig;
  getSceneObjectFunction: GetSceneObjectFunction | undefined;
  twinMakerSceneMetadataModule: TwinMakerSceneMetadataModule | undefined;
  matterportSdks: Record<string, MpSdk>;
} = {
  debugMode: false,
  dracoDecoder: { enable: true },
  locale: 'en-US',
  metricRecorder: undefined,
  // default to disable all features
  featureConfig: {},
  getSceneObjectFunction: undefined,
  twinMakerSceneMetadataModule: undefined,
  matterportSdks: {},
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

export const setTwinMakerSceneMetadataModule = (twinMakerSceneMetadataModule: TwinMakerSceneMetadataModule) => {
  globalSettings.twinMakerSceneMetadataModule = twinMakerSceneMetadataModule;
  notifySubscribers();
};

export const setMatterportSdk = (sceneId: string, sdk: MpSdk): void => {
  globalSettings.matterportSdks[sceneId] = sdk;
  notifySubscribers();
};

export const getMatterportSdk = (sceneId: string): MpSdk | undefined => {
  return globalSettings.matterportSdks[sceneId];
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

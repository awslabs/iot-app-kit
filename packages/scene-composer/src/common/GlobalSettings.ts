import { type TwinMakerSceneMetadataModule } from '@iot-app-kit/source-iottwinmaker';
import { type MpSdk } from '@matterport/r3f/dist';

import { type DracoDecoderConfig, type GetSceneObjectFunction, type BasisuDecoderConfig } from '../interfaces/sceneViewer';
import { type COMPOSER_FEATURES, type FeatureConfig } from '../interfaces';
import { type IMetricRecorder } from '../interfaces/metricRecorder';
import { type FlashMessageDefinition } from '../interfaces/sceneComposerInternal';

const globalSettings: {
  basisuDecoder: BasisuDecoderConfig;
  debugMode: boolean;
  dracoDecoder: DracoDecoderConfig;
  locale: string;
  metricRecorder?: IMetricRecorder;
  featureConfig: FeatureConfig;
  getSceneObjectFunction: GetSceneObjectFunction | undefined;
  twinMakerSceneMetadataModule: TwinMakerSceneMetadataModule | undefined;
  matterportSdks: Record<string, MpSdk | undefined>;
  onFlashMessage?: (message: FlashMessageDefinition) => void;
} = {
  basisuDecoder: { enable: true },
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

export const setBasisuDecoder = (basisu: BasisuDecoderConfig) => {
  globalSettings.basisuDecoder = basisu;
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

export const setMatterportSdk = (sceneId: string, sdk?: MpSdk): void => {
  globalSettings.matterportSdks[sceneId] = sdk;
  notifySubscribers();
};

export const setOnFlashMessage = (onFlashMessage?: (message: FlashMessageDefinition) => void): void => {
  globalSettings.onFlashMessage = onFlashMessage;
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

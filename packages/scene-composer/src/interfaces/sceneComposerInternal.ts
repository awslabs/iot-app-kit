import { ReactElement } from 'react';

import ILogger from '../logger/ILogger';

import { IValueDataBindingProvider } from './dataBinding';
import { FeatureConfig } from './feature';
import { ISceneDocumentSnapshot } from './interfaces';
import { IMetricRecorder } from './metricRecorder';
import { SceneViewerConfig, SceneViewerPropsShared } from './sceneViewer';

/// TODO: Add documentation

export type OperationMode = 'Editing' | 'Viewing';

export interface SceneComposerInternalConfig extends SceneViewerConfig {
  mode: OperationMode;
  colorTheme?: 'dark' | 'light';
  metricRecorder?: IMetricRecorder;
  // NOTE: this config is to continue support current feature flags. It will be deprecated once integrated
  // into App Kit, and then feature branch will be used to control new feature release.
  featureConfig?: FeatureConfig;
  logger?: ILogger;
  locale?: string;
}

export type OnSceneUpdateCallback = (snapshot: ISceneDocumentSnapshot) => void;

// Temporary implementation to show asset browser that depends on external framework.
export type AssetBrowserResultCallback = (s3bucketArn: string | null, selectedAssetContentLocation: string) => void;
export type ShowAssetBrowserCallback = (callback: AssetBrowserResultCallback) => void;

export interface SceneComposerInternalProps extends SceneViewerPropsShared {
  onSceneUpdated?: OnSceneUpdateCallback;

  valueDataBindingProvider?: IValueDataBindingProvider;
  showAssetBrowserCallback?: ShowAssetBrowserCallback;

  ErrorView?: ReactElement;
  onError?(error: Error, errorInfo?: { componentStack: string }): void;

  config: SceneComposerInternalConfig;
}

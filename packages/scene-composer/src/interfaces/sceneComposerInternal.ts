import { ReactElement } from 'react';

import ILogger from '../logger/ILogger';

import { AnchorEventCallback } from './components';
import { IValueDataBindingProvider } from './dataBinding';
import { FeatureConfig } from './feature';
import { ISceneDocumentSnapshot } from './interfaces';
import { IMetricRecorder } from './metricRecorder';
import { SceneViewerConfig, SceneViewerPropsShared } from './sceneViewer';

/// TODO: Add documentatin

export type OperationMode = 'Editing' | 'Viewing';

export interface SceneComposerInternalConfig extends SceneViewerConfig {
  mode: OperationMode;
  colorTheme?: 'dark' | 'light';
  metricRecorder?: IMetricRecorder;
  // NOTE: this config is to continue support current feature flags. It will be deprecated once integrated
  // into App Kit, and then feature branch will be used to control new feature release.
  featureConfig?: FeatureConfig;
  logger?: ILogger;
}

export type OnSceneUpdateCallback = (snapshot: ISceneDocumentSnapshot) => void;

// Temporary implementation to show asset browser that depends on external
// framework (TangerineBox).
export type AssetBrowserResultCallback = (s3bucketArn: string | null, selectedAssetContentLocation: string) => void;
export type ShowAssetBrowserCallback = (callback: AssetBrowserResultCallback) => void;

export interface SceneComposerInternalProps extends SceneViewerPropsShared {
  onSceneUpdated?: OnSceneUpdateCallback;

  valueDataBindingProvider?: IValueDataBindingProvider;
  showAssetBrowserCallback?: ShowAssetBrowserCallback;

  // TODO: remove it once onSelectionChanged is added to SceneViewerPropsShared
  onAnchorClick?: AnchorEventCallback;

  // TODO: remove after updating console
  locale?: string;

  ErrorView?: ReactElement;
  onError?(error: Error, errorInfo?: { componentStack: string }): void;

  config: SceneComposerInternalConfig;
}

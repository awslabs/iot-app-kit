import { ReactNode } from 'react';
import { FlashbarProps } from '@cloudscape-design/components';

import ILogger from '../logger/ILogger';

import { FeatureConfig } from './feature';
import { ISceneDocumentSnapshot } from './interfaces';
import { IMetricRecorder } from './metricRecorder';
import { SceneViewerConfig, SceneViewerPropsShared } from './sceneViewer';
import { AssetType } from './assets';

/// TODO: Add documentation

export type OperationMode = 'Editing' | 'Viewing';

export interface SceneComposerInternalConfig extends SceneViewerConfig {
  mode?: OperationMode;
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
export type ShowAssetBrowserCallback = (callback: AssetBrowserResultCallback, typelist?: AssetType[]) => void;

export interface FlashMessageDefinition extends FlashbarProps.MessageDefinition {}

export interface SceneComposerInternalProps extends SceneViewerPropsShared {
  onSceneUpdated?: OnSceneUpdateCallback;

  showAssetBrowserCallback?: ShowAssetBrowserCallback;

  ErrorView?: ReactNode;
  onError?(error: Error, errorInfo?: { componentStack: string }): void;

  onFlashMessage?(message: FlashMessageDefinition): void;

  config: SceneComposerInternalConfig;
}

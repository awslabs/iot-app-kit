import { SceneLoader, TwinMakerSceneMetadataModule } from '@iot-app-kit/source-iottwinmaker';
import { DataStream, TimeQuery, TimeSeriesData, TimeSeriesDataRequest, Viewport } from '@iot-app-kit/core';

import { IDataBindingTemplate } from './dataBinding';
import { SelectionChangedEventCallback, WidgetClickEventCallback } from './components';

export interface DracoDecoderConfig {
  enable: boolean;
  path?: string;
}

export interface SceneViewerConfig {
  dracoDecoder?: DracoDecoderConfig;
  locale?: string;
}

export interface MatterportConfig {
  modelId?: string;
  accessToken?: string; // OAuth usage
  applicationKey?: string; // Supports Demo case where the window uses an application key
  /** optional configuration of the location where matterport assets are hosted */
  assetBase?: string;
}

export interface ExternalLibraryConfig {
  matterport?: MatterportConfig;
}

/**
 * @uri URI string
 * @return it's null if GetSceneObjectFunction can't handle the URI type, otherwise, a promise will be returned.
 */
export type GetSceneObjectFunction = (uri: string) => Promise<ArrayBuffer> | null;

export interface SceneViewerPropsShared {
  sceneComposerId?: string;

  sceneLoader: SceneLoader;
  sceneMetadataModule?: TwinMakerSceneMetadataModule;

  onSelectionChanged?: SelectionChangedEventCallback;
  onWidgetClick?: WidgetClickEventCallback;

  /**
   * The data to be visualized by the composer.
   */
  dataStreams?: DataStream[];
  /**
   * The queries specify what data to be visualized by the composer.
   *
   * Note: Need to provide a viewport to make it work.
   */
  queries?: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
  /**
   * Specifies the time range of the dataStreams or the range to trigger the queries.
   */
  viewport?: Viewport;

  dataBindingTemplate?: IDataBindingTemplate;

  // TODO: exposing them after testing
  // ErrorView?: ReactElement;
  // onError?(error: Error, errorInfo?: { componentStack: string }): void;

  /**
   * Set the necessary configurations for Third Party Library Integration
   * Currently Supported:
   *   Matterport
   */
  externalLibraryConfig?: ExternalLibraryConfig;
  config?: SceneViewerConfig;

  /**
   * Set the selected node to be the Tag widget with matching entityId and componentName,
   * and move the camera target to it.
   *
   * When the selectedDataBinding value is undefined, no action will be taken.
   * When there is no matching Tag widget found, the currently selected node will be deselected.
   */
  selectedDataBinding?: Record<'entityId' | 'componentName', string>;

  /**
   * Sets the camera to view from by Camera name.
   *
   * When this is not found or not set the default initial camera is used.
   * When selectedDataBinding is set this is ignored in favor of focusing on the selected item.
   */
  activeCamera?: string;
}

export type SceneViewerProps = SceneViewerPropsShared;

import { SceneLoader } from '@iot-app-kit/source-iottwinmaker';
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

/**
 * @uri URI string
 * @return it's null if GetSceneObjectFunction can't handle the URI type, otherwise, a promise will be returned.
 */
export type GetSceneObjectFunction = (uri: string) => Promise<ArrayBuffer> | null;

/**
 * 
 */
export type ILocationData = {
  positionX: number,
  positionY: number,
  positionZ: number,
  rotationDegX: number,
  rotationDegY: number,
  rotationDegZ: number,
}
export type PropertyDecoderFunction = (propertyValue: string) => ILocationData;
export type PropertyDecoderFunctionMap = Record<string, PropertyDecoderFunction>

export interface SceneViewerPropsShared {
  sceneComposerId?: string;

  sceneLoader: SceneLoader;

  onSelectionChanged?: SelectionChangedEventCallback;
  onWidgetClick?: WidgetClickEventCallback;

  propertyDecoders?: PropertyDecoderFunction;

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

export interface SceneViewerProps extends SceneViewerPropsShared {}

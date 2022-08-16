import { SceneLoader } from '@iot-app-kit/source-iottwinmaker';

import { IDataBindingTemplate, IDataInput } from './dataBinding';
import { SelectionChangedEventCallback, WidgetClickEventCallback } from './components';

/// TODO: Add documentation

export interface DracoDecoderConfig {
  enable: boolean;
  path?: string;
}

export interface SceneViewerConfig {
  dracoDecoder?: DracoDecoderConfig;
  locale?: string;

  // TODO: remove after adding files to dist
  cdnPath?: string;
}

/**
 * @uri URI string
 * @return it's null if GetSceneObjectFunction can't handle the URI type, otherwise, a promise will be returned.
 */
export type GetSceneObjectFunction = (uri: string) => Promise<ArrayBuffer> | null;

export interface SceneViewerPropsShared {
  sceneComposerId?: string;

  sceneLoader: SceneLoader;

  onSelectionChanged?: SelectionChangedEventCallback;
  onWidgetClick?: WidgetClickEventCallback;

  // TODO: combine with Query
  dataInput?: IDataInput;
  dataBindingTemplate?: IDataBindingTemplate;

  // TODO: exposing them after testing
  // ErrorView?: ReactElement;
  // onError?(error: Error, errorInfo?: { componentStack: string }): void;

  config: SceneViewerConfig;
}

export interface SceneViewerProps extends SceneViewerPropsShared {
  /**
   * Set the selected node to be the Tag widget with matching entityId and componentName,
   * and move the camera target to it.
   *
   * When the selectedDataBinding value is undefined, no action will be taken.
   * When there is no matching Tag widget found, the currently selected node will be deselected.
   */
  selectedDataBinding?: Record<'entityId' | 'componentName', string>;
}

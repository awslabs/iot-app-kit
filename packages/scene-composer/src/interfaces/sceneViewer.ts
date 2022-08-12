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
  selectedDataBinding?: Record<string, string>;
}

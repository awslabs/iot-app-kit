import { SceneLoader } from '@iot-app-kit/source-iottwinmaker';

import { IAnchorEvent } from './components';
import { IDataBindingTemplate, IDataInput } from './dataBinding';

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

// TODO: replace with SelectedObjectData
export type TargetObjectData = {
  data?: IAnchorEvent;
};

export interface SceneViewerPropsShared {
  sceneComposerId?: string;

  // TODO: remove them once switched internal code and make sceneLoader required
  sceneContentUrl?: string;
  getSceneObjectFunction?: GetSceneObjectFunction;
  sceneLoader?: SceneLoader;

  // TODO: replace onTargetObjectChanged with onSelectionChanged once fully implemented
  // onSelectionChanged?: (selectedObjectData: SelectedObjectData);
  onTargetObjectChanged?: (objectData: TargetObjectData) => void;

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

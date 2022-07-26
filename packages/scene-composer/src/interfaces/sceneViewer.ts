import { SceneLoader } from '@iot-app-kit/source-iottwinmaker';

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

export interface SceneViewerProps {
  sceneComposerId?: string;

  // TODO: remove them once switched internal code and make sceneLoader required
  sceneContentUrl?: string;
  getSceneObjectFunction?: GetSceneObjectFunction;
  sceneLoader?: SceneLoader;

  // TODO: exposing it once fully implemented
  // onSelectionChanged?: (selectedObjectData: SelectedObjectData);
  selectedDataBinding?: Record<string, string>;

  // TODO: combine with Query
  dataInput?: IDataInput;
  dataBindingTemplate?: IDataBindingTemplate;

  // TODO: exposing them after testing
  // ErrorView?: ReactElement;
  // onError?(error: Error, errorInfo?: { componentStack: string }): void;

  config: SceneViewerConfig;
}

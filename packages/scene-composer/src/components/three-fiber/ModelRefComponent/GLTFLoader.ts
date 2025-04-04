import { type Loader, LoadingManager, DefaultLoadingManager, type WebGLRenderer } from 'three';
import { useLoader } from '@react-three/fiber';

import { GLTFLoader as TwinMakerGLTFLoader } from '../../../three/GLTFLoader';
import { setupTwinMakerGLTFLoader } from '../../../three/loaderUtils';
import { type URIModifier } from '../../../interfaces/interfaces';

function extensions(gl: WebGLRenderer, extendLoader?: (loader: TwinMakerGLTFLoader) => void) {
  return (loader: Loader) => {
    if (extendLoader) {
      extendLoader(loader as TwinMakerGLTFLoader);
    }
    setupTwinMakerGLTFLoader(loader as TwinMakerGLTFLoader, gl);
  };
}

/**
 * Extend the drei useGLTF hook to explicitly support loading manager.
 */
export function useGLTF<T extends string | string[]>(
  path: T,
  gl: WebGLRenderer,
  uriModifier?: URIModifier,
  extendLoader?: (loader: TwinMakerGLTFLoader) => void,
  onProgress?: (event: ProgressEvent<EventTarget>) => void,
) {
  const gltf = useLoader(
    TwinMakerGLTFLoader as any,
    path,
    extensions(gl, (loader) => {
      if (extendLoader) extendLoader(loader);
      if (!loader.manager) {
        loader.manager = DefaultLoadingManager;
      }

      if (uriModifier) loader.manager.setURLModifier(uriModifier);
    }),
    onProgress,
  );
  return gltf;
}

useGLTF.preload = (
  path: string | string[],
  gl: WebGLRenderer,
  uriModifier?: URIModifier,
  extendLoader?: (loader: TwinMakerGLTFLoader) => void,
) =>
  useLoader.preload(
    TwinMakerGLTFLoader as any,
    path,
    extensions(gl, (loader) => {
      if (extendLoader) extendLoader(loader);
      if (!loader.manager) {
        loader.manager = new LoadingManager();
      }

      if (uriModifier) loader.manager.setURLModifier(uriModifier);
    }),
  );

useGLTF.clear = (input: string | string[]) => useLoader.clear(TwinMakerGLTFLoader as any, input);

import { useCallback, useEffect, useState } from 'react';
import { Color, LoadingManager, type Mesh, Texture } from 'three';

import { getGlobalSettings } from '../common/GlobalSettings';
import { useSceneComposerId } from '../common/sceneComposerIdContext';
import { accessStore } from '../store';
import { TwinMakerTextureLoader, type TwinMakerTextureLoaderOptions } from '../three/TwinMakerTextureLoader';
import { type OnFileLoaderLoadFunc } from '../three/types';
import { appendFunction } from '../utils/objectUtils';

const useTwinMakerTextureLoader: (options?: TwinMakerTextureLoaderOptions) => {
  loadTextureOnMesh: (uri: string, mesh: Mesh) => void;
  clearTextureOnMesh: (mesh: Mesh) => void;
  loadTexture: (uri: string, onLoadCallback: OnFileLoaderLoadFunc) => void;
} = (options?: TwinMakerTextureLoaderOptions) => {
  const sceneComposerId = useSceneComposerId();
  const globalSettings = getGlobalSettings();
  const [textureLoader, setTextureLoader] = useState<TwinMakerTextureLoader | undefined>(undefined);
  const uriModifier = accessStore(sceneComposerId)((state) => state.getEditorConfig().uriModifier);

  useEffect(() => {
    if (textureLoader && options) {
      textureLoader.setOptions(options);
    }
  }, [textureLoader, options]);

  useEffect(() => {
    if (globalSettings.getSceneObjectFunction) {
      if (!textureLoader) {
        const loadingManager = new LoadingManager();
        const newTextureLoader = new TwinMakerTextureLoader(loadingManager);
        newTextureLoader.setGetSceneObjectFunction(globalSettings.getSceneObjectFunction);
        newTextureLoader.manager.onStart = appendFunction(newTextureLoader.manager.onStart, () => {
          accessStore(sceneComposerId).getState().setLoadingModelState(true);
        });
        newTextureLoader.manager.onLoad = appendFunction(newTextureLoader.manager.onLoad, () => {
          accessStore(sceneComposerId).getState().setLoadingModelState(false);
        });
        newTextureLoader.manager.onError = appendFunction(newTextureLoader.manager.onError, () => {
          accessStore(sceneComposerId).getState().setLoadingModelState(false);
        });
        setTextureLoader(newTextureLoader);
      } else {
        textureLoader.setGetSceneObjectFunction(globalSettings.getSceneObjectFunction);
      }
    }
  }, [globalSettings.getSceneObjectFunction, textureLoader]);

  const loadTexture = useCallback(
    (uri: string, onLoadCallback: OnFileLoaderLoadFunc) => {
      if (textureLoader) {
        const path = uriModifier?.(uri) ?? uri;
        textureLoader.load(path, onLoadCallback);
      }
    },
    [textureLoader],
  );

  const loadTextureOnMesh = useCallback(
    (uri: string, mesh: Mesh) => {
      if (textureLoader) {
        // @ts-expect-error type mistmatch after upgrade
        const material = mesh.material as THREE.MeshStandardMaterial;
        const oldTexture = material.map;
        // @ts-expect-error type mistmatch after upgrade
        material.color = new Color('#FFFFFF');
        loadTexture(uri, (result) => {
          if (result instanceof Texture) {
            // @ts-expect-error type mistmatch after upgrade
            material.map = result as Texture;
            material.needsUpdate = true;
          } else {
            console.error('Error parsing Texture file');
          }
        });
        if (oldTexture?.dispose) {
          oldTexture.dispose();
        }
      }
    },
    [textureLoader, loadTexture],
  );

  const clearTextureOnMesh = useCallback((mesh: Mesh) => {
    if (mesh) {
      // @ts-expect-error type mistmatch after upgrade
      const material = mesh.material as THREE.MeshStandardMaterial;
      const oldTexture = material.map;
      material.map = null;
      material.needsUpdate = true;
      if (oldTexture?.dispose) {
        oldTexture.dispose();
      }
    }
  }, []);

  return { loadTextureOnMesh, clearTextureOnMesh, loadTexture };
};

export default useTwinMakerTextureLoader;

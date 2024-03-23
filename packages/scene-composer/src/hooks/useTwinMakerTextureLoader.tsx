import { Color, LoadingManager, Mesh, Texture } from 'three';
import { useCallback, useState, useEffect } from 'react';

import { getGlobalSettings } from '../common/GlobalSettings';
import { useSceneComposerId } from '../common/sceneComposerIdContext';
import { useStore } from '../store';
import { TwinMakerTextureLoader, TwinMakerTextureLoaderOptions } from '../three/TwinMakerTextureLoader';
import { OnFileLoaderLoadFunc } from '../three/types';
import { appendFunction } from '../utils/objectUtils';

const useTwinMakerTextureLoader: (options?: TwinMakerTextureLoaderOptions) => {
  loadTextureOnMesh: (uri: string, mesh: Mesh) => void;
  clearTextureOnMesh: (mesh: Mesh) => void;
  loadTexture: (uri: string, onLoadCallback: OnFileLoaderLoadFunc) => void;
} = (options?: TwinMakerTextureLoaderOptions) => {
  const sceneComposerId = useSceneComposerId();
  const globalSettings = getGlobalSettings();
  const [textureLoader, setTextureLoader] = useState<TwinMakerTextureLoader | undefined>(undefined);
  const uriModifier = useStore(sceneComposerId)((state) => state.getEditorConfig().uriModifier);

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
          // Use setTimeout to avoid mutating the state during rendering process
          setTimeout(() => {
            useStore(sceneComposerId).getState().setLoadingModelState(true);
          }, 0);
        });
        newTextureLoader.manager.onLoad = appendFunction(newTextureLoader.manager.onLoad, () => {
          // Use setTimeout to avoid mutating the state during rendering process
          setTimeout(() => {
            useStore(sceneComposerId).getState().setLoadingModelState(false);
          }, 0);
        });
        newTextureLoader.manager.onError = appendFunction(newTextureLoader.manager.onError, () => {
          // Use setTimeout to avoid mutating the state during rendering process
          setTimeout(() => {
            useStore(sceneComposerId).getState().setLoadingModelState(false);
          }, 0);
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
        const material = mesh.material as THREE.MeshStandardMaterial;
        const oldTexture = material.map;
        material.color = new Color('#FFFFFF');
        loadTexture(uri, (result) => {
          if (result instanceof Texture) {
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

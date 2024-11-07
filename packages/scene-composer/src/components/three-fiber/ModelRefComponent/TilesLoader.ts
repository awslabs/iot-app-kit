import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { type TilesRenderer as Nasa3DTilesRenderer } from '3d-tiles-renderer';

import { GLTFLoader as TwinMakerGLTFLoader } from '../../../three/GLTFLoader';
import { TilesRenderer } from '../../../three/tiles3d/TilesRenderer';
import { setupTwinMakerGLTFLoader } from '../../../three/loaderUtils';
import { createTwinMakerFetch } from '../../../utils/TwinMakerBrowserUtils';
import { getGlobalSettings } from '../../../common/GlobalSettings';
import { type URIModifier } from '../../../interfaces/interfaces';

import { fixNasaUriBug, setupTilesRenderer } from './TilesLoaderUtils';

/**
 * Load 3D Tiles. There are 2 steps to load tileset:
 *   1. Load tileset JSON
 *   2. For each frame, when TilesRenderer::update function is executed, the additional tileset or tiles will be loaded.
 * useTiles will only load #1, so it should be quick. We may add loading progress in it later, but not super urgent when
 * we are loading a small JSON file (compare with 1G of glTF).
 */
export function useTiles<T extends string>(path: T, uriModifier?: URIModifier) {
  const gl = useThree((state) => state.gl);
  const camera = useThree((state) => state.camera);
  const scene = useThree((state) => state.scene);

  const tilesRenderer = useMemo(() => {
    const getSceneObjectFunction = getGlobalSettings().getSceneObjectFunction;
    const tilesRenderer = new TilesRenderer(
      path,
      getSceneObjectFunction ? createTwinMakerFetch(getSceneObjectFunction) : undefined,
    );

    /** HACKS */
    (tilesRenderer as any).preprocessURL = (uri: string | URL) => {
      const uriString = fixNasaUriBug(uri);
      return uriModifier?.(uriString) ?? uriString;
    };

    (tilesRenderer as any).loadSiblings = false;
    /** END HACKS */

    const loader = new TwinMakerGLTFLoader(tilesRenderer.manager);
    setupTwinMakerGLTFLoader(loader);

    tilesRenderer.manager.addHandler(/\.gltf$/, loader);
    tilesRenderer.onLoadTileSet = (_ts) => setupTilesRenderer(tilesRenderer as Nasa3DTilesRenderer);
    tilesRenderer.setCamera(camera);
    tilesRenderer.setResolutionFromRenderer(camera, gl);
    return tilesRenderer;
  }, [camera, gl, scene]);

  return tilesRenderer;
}

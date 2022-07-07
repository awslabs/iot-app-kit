import React, { useContext } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { CubeTexture, CubeTextureLoader, Texture, PMREMGenerator, Scene, Loader } from 'three';
import { RGBELoader } from 'three-stdlib';
import { useAsset } from 'use-asset';

import { getGlobalSettings } from '../../GlobalSettings';
import { combineUrls } from '../../utils/pathUtils';
import { sceneComposerIdContext } from '../../sceneComposerIdContext';

/**
 * Most of the following code comes from '@react-three/drei'.
 * It is slightly modified to allow setting the hdr file baseUrl.
 */

// All of the hdr files can be found here:
// https://code.amazon.com/packages/IotRociConsole/trees/mainline/--/static/hdri
export const presetsObj = {
  // These are captured by amazon studio
  neutral: 'Neutral_sm.hdr',
  directional: 'Directional_sm.hdr',
  chromatic: 'Chromatic_sm.hdr',
};

export type PresetsType = keyof typeof presetsObj;

function getTexture(texture: Texture | CubeTexture, gen: PMREMGenerator, isCubeMap: boolean) {
  if (isCubeMap) {
    gen.compileEquirectangularShader();
    return gen.fromCubemap(texture as CubeTexture).texture;
  }
  return gen.fromEquirectangular(texture).texture;
}

type Props = {
  background?: boolean;
  files?: string | string[];
  path?: string;
  preset?: PresetsType;
  scene?: Scene;
  extensions?: (loader: Loader) => void;
};

export function Environment({
  background = false,
  files = ['/px.png', '/nx.png', '/py.png', '/ny.png', '/pz.png', '/nz.png'],
  path = '',
  preset = undefined,
  scene,
  extensions,
}: Props) {
  const sceneComposerId = useContext(sceneComposerIdContext);
  if (preset) {
    files = presetsObj[preset];
    const RESOURCE_BASE_URL = getGlobalSettings().cdnPath ?? '.';
    path = combineUrls(RESOURCE_BASE_URL, '/hdri/');
  }
  const defaultScene = useThree(({ scene }) => scene);
  const gl = useThree(({ gl }) => gl);
  const isCubeMap = Array.isArray(files);
  const loader = isCubeMap ? CubeTextureLoader : RGBELoader;
  // @ts-expect-error
  const loaderResult: Texture | Texture[] = useLoader(loader, isCubeMap ? [files] : files, (loader) => {
    loader.setPath(path);
    if (extensions) extensions(loader);
  });
  const map: Texture = isCubeMap ? loaderResult[0] : loaderResult;

  const texture = useAsset<Texture, [Texture, string]>(
    (map) =>
      // PMREMGenerator takes its sweet time to generate the env-map,
      // Let's make this part of suspense, or else it just yields a frame-skip
      new Promise((resolve) => {
        const gen = new PMREMGenerator(gl);
        const texture = getTexture(map, gen, isCubeMap) as Texture;
        gen.dispose();
        resolve(texture);
      }),
    map,
    // sceneComposerId needs to be in the cache key of useAssets to support multiple scenes
    // because texture cannot be shared across renderers!
    sceneComposerId,
  );

  React.useLayoutEffect(() => {
    const oldbg = scene ? scene.background : defaultScene.background;
    const oldenv = scene ? scene.environment : defaultScene.environment;
    if (scene) {
      scene.environment = texture;
      if (background) scene.background = texture;
    } else {
      defaultScene.environment = texture;
      if (background) defaultScene.background = texture;
    }
    return () => {
      if (scene) {
        scene.environment = oldenv;
        scene.background = oldbg;
      } else {
        defaultScene.environment = oldenv;
        defaultScene.background = oldbg;
      }
      // Environment textures are volatile, better dispose and uncache them
      useAsset.clear(map, sceneComposerId);
      texture.dispose();
    };
  }, [texture, background, scene, defaultScene]);

  return null;
}

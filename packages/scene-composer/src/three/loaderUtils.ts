// @ts-ignore
import { DRACOLoader } from 'three-stdlib';

import { getGlobalSettings } from '../common/GlobalSettings';
import { DRACO_PATH } from '../common/constants';

import { TwinMakerFileLoader } from './TwinMakerFileLoader';
import { TwinMakerTextureLoader } from './TwinMakerTextureLoader';
import { TwinMakerGLTFLoader } from './GLTFLoader';

export function setupTwinMakerGLTFLoader(loader: TwinMakerGLTFLoader): TwinMakerGLTFLoader {
  const globalSettings = getGlobalSettings();

  if (globalSettings.dracoDecoder.enable) {
    const dracoDecoderPath = globalSettings.dracoDecoder.path ?? DRACO_PATH;
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(dracoDecoderPath);
    // TODO: with CSP issues, Chrome/Edge and some other unknown browsers may fail to load WASM, so we enforce to
    // only JS DRACO decoder for now. Please fix once we found a better solution
    dracoLoader.setDecoderConfig({ type: 'js' });
    (loader as TwinMakerGLTFLoader).setDRACOLoader(dracoLoader);
  }

  if (globalSettings.getSceneObjectFunction) {
    const fileLoader = new TwinMakerFileLoader(loader.manager);
    fileLoader.setGetSceneObjectFunction(globalSettings.getSceneObjectFunction);
    (loader as TwinMakerGLTFLoader).setFileLoader(fileLoader);

    const textureLoader = new TwinMakerTextureLoader(loader.manager);
    textureLoader.setGetSceneObjectFunction(globalSettings.getSceneObjectFunction);
    (loader as TwinMakerGLTFLoader).setTextureLoader(textureLoader);
  }

  return loader;
}

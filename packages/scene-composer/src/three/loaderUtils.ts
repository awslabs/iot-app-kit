import { WebGLRenderer } from 'three';

import { getGlobalSettings } from '../common/GlobalSettings';
import { DRACO_PATH } from '../common/constants';

import { TwinMakerFileLoader } from './TwinMakerFileLoader';
import { TwinMakerTextureLoader } from './TwinMakerTextureLoader';
import { type GLTFLoader as TwinMakerGLTFLoader } from './GLTFLoader';

export function setupTwinMakerGLTFLoader(loader: TwinMakerGLTFLoader, renderer: WebGLRenderer): TwinMakerGLTFLoader {
  setupDracoSupport(loader);
  setupFileLoader(loader);
  setupBasisuSupport(loader, renderer);

  return loader;
}

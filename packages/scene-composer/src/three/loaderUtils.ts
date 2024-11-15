import { WebGLRenderer } from 'three';

import { GLTFLoader as TwinMakerGLTFLoader } from './GLTFLoader';
import { setupBasisuSupport, setupFileLoader, setupDracoSupport } from './loaderUtilsHelpers';

export function setupTwinMakerGLTFLoader(loader: TwinMakerGLTFLoader, renderer: WebGLRenderer): TwinMakerGLTFLoader {
  setupDracoSupport(loader);
  setupFileLoader(loader);
  setupBasisuSupport(loader, renderer);

  return loader;
}

import { type WebGLRenderer } from 'three';
import { DRACOLoader, KTX2Loader } from 'three-stdlib';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { getGlobalSettings } from '../common/GlobalSettings';
import { THREE_PATH } from '../common/constants';
import { type GLTFLoader, type GLTFLoader as TwinMakerGLTFLoader } from './GLTFLoader';
import { TwinMakerFileLoader } from './TwinMakerFileLoader';
import { TwinMakerTextureLoader } from './TwinMakerTextureLoader';

export const setupDracoSupport = (loader: GLTFLoader, dracoLoader: DRACOLoader = new DRACOLoader()): void => {
  const { dracoDecoder, getSceneObjectFunction } = getGlobalSettings();
  // getSceneObjectFunction is needed for the check to ensure that globalSettings are ready to be evaluated against
  if (dracoDecoder.enable && getSceneObjectFunction) {
    const dracoDecoderPath = dracoDecoder.path ?? `${THREE_PATH}/examples/jsm/libs/draco/gltf/`;
    // TODO: with CSP issues, Chrome/Edge and some other unknown browsers may fail to load WASM, so we enforce to
    // only JS DRACO decoder for now. Please fix once we found a better solution
    dracoLoader.setDecoderConfig({ type: 'js' }).setDecoderPath(dracoDecoderPath);

    (loader as TwinMakerGLTFLoader).setDRACOLoader(dracoLoader);
  }
};

export const setupBasisuSupport = (
  loader: GLTFLoader,
  renderer: WebGLRenderer,
  ktx2Loader: KTX2Loader = new KTX2Loader(),
): void => {
  const { basisuDecoder, getSceneObjectFunction } = getGlobalSettings();
  // getSceneObjectFunction is needed for the check to ensure that globalSettings are ready to be evaluated against
  if (basisuDecoder.enable && getSceneObjectFunction) {
    const ktx2DecoderPath = basisuDecoder.path ?? `${THREE_PATH}/examples/jsm/libs/basis/`;
    ktx2Loader.setTranscoderPath(ktx2DecoderPath).detectSupport(renderer);

    (loader as TwinMakerGLTFLoader).setKTX2Loader(ktx2Loader);
    (loader as TwinMakerGLTFLoader).setMeshoptDecoder(MeshoptDecoder);
  }
};

export const setupFileLoader = (loader: GLTFLoader): void => {
  const { getSceneObjectFunction } = getGlobalSettings();
  if (getSceneObjectFunction) {
    const fileLoader = new TwinMakerFileLoader(loader.manager);
    fileLoader.setGetSceneObjectFunction(getSceneObjectFunction);

    const textureLoader = new TwinMakerTextureLoader(loader.manager);
    textureLoader.setGetSceneObjectFunction(getSceneObjectFunction);

    (loader as TwinMakerGLTFLoader).setFileLoader(fileLoader);
    (loader as TwinMakerGLTFLoader).setTextureLoader(textureLoader);
  }
};

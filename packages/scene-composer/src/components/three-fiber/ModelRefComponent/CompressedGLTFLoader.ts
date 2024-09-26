import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';
import { useThree } from '@react-three/fiber';
import { MeshoptDecoder } from 'three-stdlib/libs/MeshoptDecoder';
import { REVISION } from 'three';
import { useGLTF } from '@react-three/drei';

import { GLTFLoadingManager } from '../../../common/loadingManagers';

const THREE_PATH = `https://unpkg.com/three@0.${REVISION}.x`;
const DRACO_LOADER = new DRACOLoader(GLTFLoadingManager).setDecoderPath(`${THREE_PATH}/examples/jsm/libs/draco/gltf/`);
const KTX2_LOADER = new KTX2Loader(GLTFLoadingManager).setTranscoderPath(`${THREE_PATH}/examples/jsm/libs/basis/`);

export const useCompressedGLTF = (path: string | string[]) => {
  const { gl } = useThree();

  const gltf = useGLTF(path, true, true, (loader) => {
    loader
      .setCrossOrigin('anonymous')
      .setKTX2Loader(KTX2_LOADER.detectSupport(gl))
      .setDRACOLoader(DRACO_LOADER)
      .setMeshoptDecoder(MeshoptDecoder);
    return loader;
  });

  return gltf;
};

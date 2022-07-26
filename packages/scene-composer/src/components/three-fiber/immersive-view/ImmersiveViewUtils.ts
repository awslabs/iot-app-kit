import * as THREE from 'three';

import { TwinMakerTextureLoader } from '../../../three/TwinMakerTextureLoader';
import { getGlobalSettings } from '../../../common/GlobalSettings';

export const areAllImagesInCache = (images: string[]) => {
  return images.some((image) => THREE.Cache.get(image));
};

export const generateSixSidedSkyboxTexture = (images: string[], setTextures?: (texture: THREE.Texture[]) => void) => {
  const textures: THREE.Texture[] = new Array(images.length);
  const textureLoader = new TwinMakerTextureLoader(undefined);
  const getSceneObjectFunction = getGlobalSettings().getSceneObjectFunction;
  if (getSceneObjectFunction) {
    textureLoader.setGetSceneObjectFunction(getSceneObjectFunction);
  }
  textureLoader.setOptions({ imageOrientation: 'flipY' });

  const promises = images.map(
    (image, index) =>
      new Promise((resolve, reject) => {
        textureLoader.load(
          image,
          (textureResponse) => {
            const texture = textureResponse as any as THREE.Texture;
            textures[index] = texture;
            resolve(texture);
          },
          undefined,
          reject,
        );
      }),
  );

  return Promise.all(promises)
    .then(() => {
      if (setTextures) setTextures(textures);
    })
    .catch((err) => {
      throw err;
    });
};

export const generateCubeMapSkyboxTexture = (image: string, setTextures?: (texture: THREE.Texture[]) => void) => {
  const textureLoader = new TwinMakerTextureLoader(undefined);
  const getSceneObjectFunction = getGlobalSettings().getSceneObjectFunction;
  if (getSceneObjectFunction) {
    textureLoader.setGetSceneObjectFunction(getSceneObjectFunction);
  }

  const getSide = (imageElement, x, y): THREE.Texture => {
    const size = imageElement.width / 4; // Standard CubeMap is 4 sides across
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(imageElement, -x * size, -y * size);
    }
    return new THREE.CanvasTexture(canvas);
  };

  return new Promise<THREE.Texture[]>((resolve, reject) => {
    textureLoader.load(
      image,
      (textureResponse) => {
        const texture = textureResponse as any as THREE.Texture;
        resolve([
          getSide(texture.image, 2, 1), // px
          getSide(texture.image, 0, 1), // nx
          getSide(texture.image, 1, 0), // py
          getSide(texture.image, 1, 2), // ny
          getSide(texture.image, 1, 1), // pz
          getSide(texture.image, 3, 1), // nz
        ]);
      },
      undefined,
      (err) => {
        reject(err);
      },
    );
  })
    .then((textures) => {
      if (setTextures) setTextures(textures);
    })
    .catch((err) => {
      throw err;
    });
};

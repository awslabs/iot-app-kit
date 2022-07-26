import * as THREE from 'three';

import { GetSceneObjectFunction } from '../interfaces';

import { TwinMakerFileLoader } from './TwinMakerFileLoader';
import { OnFileLoaderLoadFunc, OnProgressFunc, OnErrorFunc } from './types';
import { shouldCreateImageBitmap } from './TwinMakerTextureLoaderUtils';

// https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.imagebitmapoptions.html
export type TwinMakerTextureLoaderOptions = ImageBitmapOptions;

export class TwinMakerTextureLoader extends THREE.Loader {
  private twinMakerFileLoader: TwinMakerFileLoader;
  private options: TwinMakerTextureLoaderOptions = {};

  constructor(manager?: THREE.LoadingManager) {
    super(manager);
    this.twinMakerFileLoader = new TwinMakerFileLoader(this.manager);
    // As images are all arrayBuffer, we should set this otherwise the loader will load it as text file
    this.twinMakerFileLoader.setResponseType('arraybuffer');
  }

  public setGetSceneObjectFunction(getSceneObjectFunction: GetSceneObjectFunction) {
    this.twinMakerFileLoader.setGetSceneObjectFunction(getSceneObjectFunction);
  }

  public setOptions(options: TwinMakerTextureLoaderOptions) {
    this.options = options;
  }

  load(url: string, onLoad?: OnFileLoaderLoadFunc, onProgress?: OnProgressFunc, onError?: OnErrorFunc) {
    if (THREE.Cache.get(url) !== undefined) {
      setTimeout(() => onLoad?.(THREE.Cache.get(url)), 1);
      return;
    }

    const _onLoadTexture = (texture) => {
      THREE.Cache.add(url, texture);
      onLoad?.(texture as any);
    };

    const _onLoadImageBitmap = (imageBitmap) => {
      const texture = new THREE.Texture(imageBitmap);
      texture.needsUpdate = true;

      // https://threejs.org/docs/#api/en/textures/Texture.flipY
      if (this.options.imageOrientation === 'flipY') {
        texture.flipY = true;
      }

      // From @types/three, the response type is "string | ArrayBuffer", but the THREE.TextureLoader
      // returns THREE.Texture , so we need to cast here.
      _onLoadTexture(texture as any);
    };

    this.twinMakerFileLoader.load(
      url,
      (data) => {
        const blob = new Blob([data], { type: 'blob' });
        const imageUrl = window.URL.createObjectURL(blob);

        if (shouldCreateImageBitmap(navigator.userAgent)) {
          const textureLoader = new THREE.ImageBitmapLoader(this.manager);
          textureLoader.setOptions(this.options);
          textureLoader.load(imageUrl, _onLoadImageBitmap, onProgress, onError);
        } else {
          const textureLoader = new THREE.TextureLoader(this.manager);
          textureLoader.load(imageUrl, _onLoadTexture, onProgress, onError);
        }
      },
      onProgress,
      onError,
    );
  }
}

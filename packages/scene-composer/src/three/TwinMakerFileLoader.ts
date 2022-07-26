import * as THREE from 'three';

import { GetSceneObjectFunction } from '../interfaces';

import { OnFileLoaderLoadFunc, OnProgressFunc, OnErrorFunc } from './types';

export class TwinMakerFileLoader extends THREE.FileLoader {
  private getSceneObjectFunction?: GetSceneObjectFunction;

  public setGetSceneObjectFunction(getSceneObjectFunction: GetSceneObjectFunction) {
    this.getSceneObjectFunction = getSceneObjectFunction;
  }

  load(url: string, onLoad?: OnFileLoaderLoadFunc, onProgress?: OnProgressFunc, onError?: OnErrorFunc) {
    url = this.manager ? this.manager.resolveURL(url) : url;

    const promise = this.getSceneObjectFunction?.(url);
    if (!promise) {
      super.load(url, onLoad, onProgress, onError);
    } else {
      const _onLoad = (blob: Blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        super.load(
          blobUrl,
          (data) => {
            this.manager?.itemEnd(url);
            onLoad?.(data);
          },
          onProgress,
          onError,
        );
      };

      this.manager?.itemStart(url);
      if (THREE.Cache.get(url) !== undefined) {
        setTimeout(() => _onLoad(THREE.Cache.get(url)), 1);
        return;
      }

      promise
        .then((arrayBuffer) => {
          const blob = new Blob([arrayBuffer]);
          THREE.Cache.add(url, blob);
          _onLoad(blob);
        })
        .catch((err) => {
          onError?.(err);
        });
    }
  }
}

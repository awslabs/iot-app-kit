import * as THREE from 'three';

import { type GetSceneObjectFunction } from '../interfaces';

import { type OnFileLoaderLoadFunc, type OnProgressFunc, type OnErrorFunc } from './types';

export class TwinMakerFileLoader extends THREE.FileLoader {
  private getSceneObjectFunction?: GetSceneObjectFunction;

  public setGetSceneObjectFunction(getSceneObjectFunction: GetSceneObjectFunction) {
    this.getSceneObjectFunction = getSceneObjectFunction;
  }

  load(url: string, onLoad?: OnFileLoaderLoadFunc, onProgress?: OnProgressFunc, onError?: OnErrorFunc) {
    url = url.replaceAll('\\', '/');
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
        _onLoad(THREE.Cache.get(url));
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

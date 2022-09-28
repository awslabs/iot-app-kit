import create from 'zustand';
import { DefaultLoadingManager } from 'three';

type Data = {
  errors: string[];
  active: boolean;
  progress: number;
  item: string;
  loaded: number;
  total: number;
  downloadItem: string;
  downloaded: number;
  downloadTotal: number;
  downloadProgress: number;
};
let saveLastTotalLoaded = 0;

export const useProgressImpl = (set) => {
  DefaultLoadingManager.onStart = (item, loaded, total) => {
    set({
      active: true,
      item,
      loaded,
      total,
      progress: ((loaded - saveLastTotalLoaded) / (total - saveLastTotalLoaded)) * 100,
    });
  };
  DefaultLoadingManager.onLoad = () => {
    set({ active: false });
  };
  DefaultLoadingManager.onError = (item) => set((state) => ({ errors: [...state.errors, item] }));
  DefaultLoadingManager.onProgress = (item, loaded, total) => {
    if (loaded === total) {
      saveLastTotalLoaded = total;
    }
    set({
      active: true,
      item,
      loaded,
      total,
      progress: ((loaded - saveLastTotalLoaded) / (total - saveLastTotalLoaded)) * 100 || 100,
    });
  };

  // Add an additional function to DefaultLoadingManager to track downloading progress.
  // Note: since we add an additional method to the default loading manager, and three does not use interface
  // when declaring the type of the loading manager, there is no easy way to extend a class in typescript.
  // This is a bit hacky, but the alternative is to recreate all the loader related classes by ourselves.
  // We can revisit if we have the need to do a lot of customization when loading assets in the future.
  // The risk of conflicting with the threejs future change is small since we uses an underscored name here.
  // @ts-ignore
  DefaultLoadingManager.__onDownloadProgress = (url: string, loaded: number, total: number) => {
    set({
      active: true,
      downloadItem: url,
      downloaded: loaded,
      downloadTotal: total,
      downloadProgress: total ? (loaded / total) * 100 : /* istanbul ignore next */ 0,
    });
  };

  return {
    errors: [],
    active: false,
    progress: 0,
    item: '',
    loaded: 0,
    total: 0,
    downloadItem: '',
    downloaded: 0,
    downloadTotal: 0,
    downloadProgress: 0,
  };
};

export default create<Data>(useProgressImpl);

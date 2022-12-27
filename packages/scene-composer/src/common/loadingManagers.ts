import { LoadingManager } from 'three';

export const GLTFLoadingManager = new LoadingManager();
export const EnvironmentLoadingManager = new LoadingManager();

export const tmLoadingManagers = [GLTFLoadingManager, EnvironmentLoadingManager];

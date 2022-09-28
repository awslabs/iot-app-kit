import * as THREE from 'three';

import { TwinMakerFileLoader } from './TwinMakerFileLoader';
import { TwinMakerTextureLoader } from './TwinMakerTextureLoader';
import { shouldCreateImageBitmap } from './TwinMakerTextureLoaderUtils';

jest.mock('./TwinMakerTextureLoaderUtils');

describe('TwinMakerTextureLoader', () => {
  // let mockedS3Client;
  let loadingManager;
  let mockCreateObjectURL;
  let spyTwinMakerFileLoader;
  let spyImageBitmapLoader;
  let spyTextureLoader;

  beforeEach(() => {
    jest.clearAllMocks();

    (shouldCreateImageBitmap as any).mockImplementation(() => true);

    const callOnLoad = (url, onLoad, onProgress, onError) => {
      onLoad?.('mock-value' as any);
      return {} as any;
    };
    spyTwinMakerFileLoader = jest.spyOn(TwinMakerFileLoader.prototype, 'load');
    spyTwinMakerFileLoader.mockImplementation(callOnLoad);
    spyImageBitmapLoader = jest.spyOn(THREE.ImageBitmapLoader.prototype, 'load');
    spyImageBitmapLoader.mockImplementation(callOnLoad);
    spyTextureLoader = jest.spyOn(THREE.TextureLoader.prototype, 'load');
    spyTextureLoader.mockImplementation(callOnLoad);

    mockCreateObjectURL = jest.fn();
    window.URL.createObjectURL = mockCreateObjectURL;
    THREE.Cache.enabled = false;
  });

  it('should load file successfully with S3 client', async () => {
    const url = 's3://test-bucket/file.ext';
    const onLoad = jest.fn();

    const twinMakerTextureLoader = new TwinMakerTextureLoader(loadingManager);
    twinMakerTextureLoader.load(url, onLoad, undefined, undefined);
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(mockCreateObjectURL).toBeCalledTimes(1);
    expect(shouldCreateImageBitmap).toBeCalledTimes(1);
    expect(onLoad).toBeCalledTimes(1);
  });

  it('should load file successfully with texture loader', async () => {
    const url = 's3://test-bucket/file.ext';
    const onLoad = jest.fn();
    (shouldCreateImageBitmap as any).mockImplementation(() => false);

    const twinMakerTextureLoader = new TwinMakerTextureLoader(loadingManager);
    twinMakerTextureLoader.load(url, onLoad, undefined, undefined);
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(mockCreateObjectURL).toBeCalledTimes(1);
    expect(shouldCreateImageBitmap).toBeCalledTimes(1);
    expect(onLoad).toBeCalledTimes(1);
  });

  it('should load file successfully with cache', async () => {
    THREE.Cache.enabled = true;
    const url = 's3://test-bucket/file.ext';
    const onLoad = jest.fn();

    const twinMakerTextureLoader = new TwinMakerTextureLoader(loadingManager);
    twinMakerTextureLoader.load(url, onLoad, undefined, undefined);
    await new Promise((resolve) => setTimeout(resolve, 10));
    twinMakerTextureLoader.load(url, onLoad, undefined, undefined);
    await new Promise((resolve) => setTimeout(resolve, 10));

    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(mockCreateObjectURL).toBeCalledTimes(1);
    expect(shouldCreateImageBitmap).toBeCalledTimes(1);
    expect(onLoad).toBeCalledTimes(2);
  });

  it('should call onError if textureLoader.load fail', async () => {
    const url = 's3://test-bucket/file.ext';
    const onLoad = jest.fn();
    spyImageBitmapLoader.mockImplementation((url, onLoad, onProgress, onError) => onError?.('mock-error' as any));

    const twinMakerTextureLoader = new TwinMakerTextureLoader(loadingManager);
    twinMakerTextureLoader.load(url, onLoad, undefined, undefined);

    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(mockCreateObjectURL).toBeCalledTimes(1);
    expect(shouldCreateImageBitmap).toBeCalledTimes(1);
    expect(onLoad).toBeCalledTimes(0);
  });
});

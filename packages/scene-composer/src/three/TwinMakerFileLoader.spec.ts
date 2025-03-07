import * as THREE from 'three';
import str2ab from 'string-to-arraybuffer';

import { type GetSceneObjectFunction } from '../interfaces';

import { TwinMakerFileLoader } from './TwinMakerFileLoader';

describe('TwinMakerFileLoader', () => {
  let loadingManager;
  let mockCreateObjectURL;

  beforeEach(() => {
    vi.clearAllMocks();

    loadingManager = {
      itemStart: vi.fn(),
      itemEnd: vi.fn(),
      resolveURL: (url) => url,
    } as any as THREE.LoadingManager;

    vi.spyOn(THREE.FileLoader.prototype, 'load').mockImplementation((_url, onLoad, _onProgress, _onError) => {
      onLoad?.('mock-value' as any);
    });

    mockCreateObjectURL = vi.fn();
    window.URL.createObjectURL = mockCreateObjectURL;
  });

  it('should load file successfully with getSceneObjectFunction', async () => {
    const mockResponseString = '{"key1":"value1","key2":123}';
    const mockArrayBuffer = str2ab(mockResponseString);
    const mockGetSceneObjectFunction: GetSceneObjectFunction = vi.fn(() => Promise.resolve(mockArrayBuffer));
    const url = 's3://test-bucket/file.ext';
    const onLoad = vi.fn();

    const twinMakerFileLoader = new TwinMakerFileLoader(loadingManager);
    twinMakerFileLoader.setGetSceneObjectFunction(mockGetSceneObjectFunction);
    twinMakerFileLoader.load(url, onLoad, undefined, undefined);

    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(mockCreateObjectURL).toBeCalledTimes(1);
    expect(onLoad).toBeCalledTimes(1);
  });

  it('should fallback to default loader if S3 client is missing', async () => {
    const url = 's3://test-bucket/file.ext';
    const onLoad = vi.fn();

    const twinMakerFileLoader = new TwinMakerFileLoader(loadingManager);
    twinMakerFileLoader.load(url, onLoad, undefined, undefined);

    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(mockCreateObjectURL).toBeCalledTimes(0);
    expect(onLoad).toBeCalledTimes(1);
  });

  it('should fallback to default loader if the URL is not S3 URL', async () => {
    const url = 'http://test-domain/index.html';
    const onLoad = vi.fn();

    const twinMakerFileLoader = new TwinMakerFileLoader(loadingManager);
    twinMakerFileLoader.load(url, onLoad, undefined, undefined);

    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(mockCreateObjectURL).toBeCalledTimes(0);
    expect(onLoad).toBeCalledTimes(1);
  });

  it('should get default url if loadingManager is missing', async () => {
    const url = 'http://test-domain/index.html';
    const onLoad = vi.fn();

    const twinMakerFileLoader = new TwinMakerFileLoader(loadingManager);
    twinMakerFileLoader.load(url, onLoad, undefined, undefined);

    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(mockCreateObjectURL).toBeCalledTimes(0);
    expect(onLoad).toBeCalledTimes(1);
  });

  it('should call onError if S3 download failed', async () => {
    const url = 's3://test-bucket/file.ext';
    const onLoad = vi.fn();
    const onError = vi.fn();
    const mockError = new Error('Mock-Error');
    const mockGetSceneObjectFunction: GetSceneObjectFunction = vi.fn(() => Promise.reject(mockError));

    const twinMakerFileLoader = new TwinMakerFileLoader(loadingManager);
    twinMakerFileLoader.setGetSceneObjectFunction(mockGetSceneObjectFunction);
    twinMakerFileLoader.load(url, onLoad, undefined, onError);

    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(mockCreateObjectURL).toBeCalledTimes(0);
    expect(onLoad).toBeCalledTimes(0);
    expect(onError).toBeCalledTimes(1);
  });
});

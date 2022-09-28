import { renderHook } from '@testing-library/react-hooks';

/* eslint-disable */
const mockUseThree = jest.fn();
jest.doMock('@react-three/fiber', () => {
  const originalModule = jest.requireActual('@react-three/fiber');
  return {
    ...originalModule,
    useThree: mockUseThree,
  };
});

const mockAddHandler = jest.fn();
const mockSetCamera = jest.fn();
const mockSetResolutionFromRenderer = jest.fn();
jest.doMock('../../../../three/tiles3d/TilesRenderer', () => {
  return {
    TilesRenderer: jest.fn().mockImplementation(() => {
      return {
        manager: {
          addHandler: mockAddHandler,
        },
        setCamera: mockSetCamera,
        setResolutionFromRenderer: mockSetResolutionFromRenderer,
      };
    }),
  };
});

const mockFixNasaUriBug = jest.fn((uri) => uri);
const mockSetupTilesRenderer = jest.fn();
jest.doMock('../TilesLoaderUtils', () => ({
  fixNasaUriBug: mockFixNasaUriBug,
  setupTilesRenderer: mockSetupTilesRenderer,
}));

const mockSetupTwinMakerGLTFLoader = jest.fn();
jest.doMock('../../../../three/loaderUtils', () => ({
  setupTwinMakerGLTFLoader: mockSetupTwinMakerGLTFLoader,
}));

const mockCreateTwinMakerFetch = jest.fn();
jest.doMock('../../../../utils/TwinMakerBrowserUtils', () => ({
  createTwinMakerFetch: mockCreateTwinMakerFetch,
}));

const mockGetGlobalSettings = jest.fn();
jest.doMock('../../../../common/GlobalSettings', () => ({
  getGlobalSettings: mockGetGlobalSettings, // () => ({}),
}));

import { useTiles } from '../TilesLoader';

/* eslint-enable */

describe('useTiles', () => {
  beforeEach(() => {
    // setup();
    jest.clearAllMocks();
    mockGetGlobalSettings.mockReturnValue({});
  });

  it('should create tilesRenderer', async () => {
    renderHook(() => useTiles('mock/path'));
    expect(mockCreateTwinMakerFetch).toBeCalledTimes(0);
    expect(mockAddHandler).toBeCalledTimes(1);
    expect(mockSetCamera).toBeCalledTimes(1);
    expect(mockSetResolutionFromRenderer).toBeCalledTimes(1);
    expect(mockSetupTwinMakerGLTFLoader).toBeCalledTimes(1);
  });

  it('should call createTwinMakerFetch if getSceneObjectFunction is not null', async () => {
    mockGetGlobalSettings.mockReturnValue({ getSceneObjectFunction: jest.fn() });
    renderHook(() => useTiles('mock/path'));
    expect(mockCreateTwinMakerFetch).toBeCalledTimes(1);
    expect(mockAddHandler).toBeCalledTimes(1);
    expect(mockSetCamera).toBeCalledTimes(1);
    expect(mockSetResolutionFromRenderer).toBeCalledTimes(1);
    expect(mockSetupTwinMakerGLTFLoader).toBeCalledTimes(1);
  });

  it('should call preprocessURL successfully', async () => {
    const mockUriModifier = jest.fn((uri) => uri + '-processed');
    const tilesRenderer = renderHook(() => useTiles('mock/path', mockUriModifier)).result.current;
    const uri = tilesRenderer.preprocessURL?.('s3://bucket-name/path/key');
    expect(mockFixNasaUriBug).toBeCalledTimes(1);
    expect(uri).toBe('s3://bucket-name/path/key-processed');
  });

  it('should call preprocessURL without uriModifier successfully', async () => {
    const tilesRenderer = renderHook(() => useTiles('mock/path')).result.current;
    const uri = tilesRenderer.preprocessURL?.('s3://bucket-name/path/key');
    expect(mockFixNasaUriBug).toBeCalledTimes(1);
    expect(uri).toBe('s3://bucket-name/path/key');
  });

  it('should call onLoadTileSet successfully', async () => {
    const tilesRenderer = renderHook(() => useTiles('mock/path')).result.current;
    tilesRenderer.onLoadTileSet?.({} as any);
    expect(mockSetupTilesRenderer).toBeCalledTimes(1);
    expect(mockSetupTilesRenderer).toBeCalledWith(tilesRenderer);
  });
});

import { renderHook } from '@/tests/testing-library';
import { useTiles } from '../TilesLoader';

vi.mock('@react-three/fiber', async () => {
  const originalModule = await vi.importActual('@react-three/fiber');
  return {
    ...originalModule,
    useThree: () => vi.fn(),
  };
});

const mockAddHandler = vi.fn();
const mockSetCamera = vi.fn();
const mockSetResolutionFromRenderer = vi.fn();
vi.mock('../../../../three/tiles3d/TilesRenderer', () => {
  return {
    TilesRenderer: vi.fn(() => {
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

const mockFixNasaUriBug = vi.fn((uri) => uri);
const mockSetupTilesRenderer = vi.fn();
vi.mock('../TilesLoaderUtils', () => ({
  fixNasaUriBug: (uri) => mockFixNasaUriBug(uri),
  setupTilesRenderer: (...args: unknown[]) => mockSetupTilesRenderer(...args),
}));

const mockSetupTwinMakerGLTFLoader = vi.fn();
vi.mock('../../../../three/loaderUtils', () => ({
  setupTwinMakerGLTFLoader: () => mockSetupTwinMakerGLTFLoader(),
}));

const mockCreateTwinMakerFetch = vi.fn();
vi.mock('../../../../utils/TwinMakerBrowserUtils', () => ({
  createTwinMakerFetch: () => mockCreateTwinMakerFetch(),
}));

const mockGetGlobalSettings = vi.fn();
vi.mock('../../../../common/GlobalSettings', () => ({
  getGlobalSettings: () => mockGetGlobalSettings(), // () => ({}),
}));

/* eslint-enable */

describe('useTiles', () => {
  beforeEach(() => {
    // setup();
    vi.clearAllMocks();
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
    mockGetGlobalSettings.mockReturnValue({ getSceneObjectFunction: vi.fn() });
    renderHook(() => useTiles('mock/path'));
    expect(mockCreateTwinMakerFetch).toBeCalledTimes(1);
    expect(mockAddHandler).toBeCalledTimes(1);
    expect(mockSetCamera).toBeCalledTimes(1);
    expect(mockSetResolutionFromRenderer).toBeCalledTimes(1);
    expect(mockSetupTwinMakerGLTFLoader).toBeCalledTimes(1);
  });

  it('should call preprocessURL successfully', async () => {
    const mockUriModifier = vi.fn((uri) => uri + '-processed');
    const tilesRenderer = renderHook(() => useTiles('mock/path', mockUriModifier)).result.current;
    const uri = (tilesRenderer as any).preprocessURL?.('s3://bucket-name/path/key');
    expect(mockFixNasaUriBug).toBeCalledTimes(1);
    expect(uri).toBe('s3://bucket-name/path/key-processed');
  });

  it('should call preprocessURL without uriModifier successfully', async () => {
    const tilesRenderer = renderHook(() => useTiles('mock/path')).result.current;
    const uri = (tilesRenderer as any).preprocessURL?.('s3://bucket-name/path/key');
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

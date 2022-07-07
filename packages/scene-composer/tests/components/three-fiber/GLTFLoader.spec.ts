/* eslint-disable */
const mockSetURLModifier = jest.fn();
jest.doMock('three', () => {
  const originalModule = jest.requireActual('three');
  return {
    ...originalModule,
    LoadingManager: class {
      setURLModifier = mockSetURLModifier
    },
  };
});

const mockUseLoader = jest.fn();
jest.doMock('@react-three/fiber', () => {
  const originalModule = jest.requireActual('@react-three/fiber');
  return {
    ...originalModule,
    useLoader: mockUseLoader,
  };
});

const mockGetGlobalSettings = jest.fn();
jest.doMock('../../../src/GlobalSettings', () => {
  const originalModule = jest.requireActual('../../../src/GlobalSettings');
  return {
    ...originalModule,
    getGlobalSettings: mockGetGlobalSettings,
  };
});

import { useGLTF } from '../../../src/components/three-fiber/GLTFLoader';
import { DRACOLoader } from 'three-stdlib';
import { DefaultLoadingManager } from 'three';
import { TwinMakerGLTFLoader } from '../../../src/three/GLTFLoader';

/* eslint-enable */

describe('GLTFLoader', () => {
  const mockPreloadFn = jest.fn();
  const mockClearFn = jest.fn();

  const uriModifier = jest.fn();
  const extendLoader = jest.fn();
  const onProgress = jest.fn();

  let extensionsCb;
  let mockLoader;

  const createMockLoader = () => {
    return {
      setDRACOLoader: jest.fn(),
    };
  };

  const setup = () => {
    jest.resetAllMocks();

    mockLoader = createMockLoader();

    mockUseLoader.mockImplementation((l, p, e) => {
      extensionsCb = e;
    });
    (mockUseLoader as any).preload = mockPreloadFn;
    (mockUseLoader as any).clear = mockClearFn;

    mockGetGlobalSettings.mockReturnValue({ dracoDecoder: { enable: false } });
  };

  describe('extensions', () => {
    let setDecoderPathSpy;

    beforeEach(() => {
      setup();

      setDecoderPathSpy = jest.spyOn(DRACOLoader.prototype, 'setDecoderPath');
    });

    it('should execute without draco decoder enabled', async () => {
      useGLTF('mock/path', uriModifier, extendLoader, onProgress);
      extensionsCb(mockLoader);

      expect(extendLoader).toBeCalledTimes(1);
      expect(setDecoderPathSpy).not.toBeCalled();
      expect(mockLoader.setDRACOLoader).not.toBeCalled();
    });

    it('should execute without draco decoder enabled', async () => {
      mockGetGlobalSettings.mockReturnValue({ dracoDecoder: { enable: true, path: 'abc/def' } });

      useGLTF('mock/path', uriModifier, extendLoader, onProgress);
      extensionsCb(mockLoader);

      expect(extendLoader).toBeCalledTimes(1);
      expect(setDecoderPathSpy).toBeCalledTimes(1);
      expect(setDecoderPathSpy).toBeCalledWith('abc/def');
      expect(mockLoader.setDRACOLoader).toBeCalledTimes(1);
    });
  });

  describe('useGLTF', () => {
    beforeEach(() => {
      setup();
    });

    it('should call useLoader', async () => {
      const setURLModifierSpy = jest.spyOn(DefaultLoadingManager, 'setURLModifier');

      useGLTF('mock/path', uriModifier, extendLoader, onProgress);
      extensionsCb(mockLoader);

      expect(mockUseLoader).toBeCalledWith(TwinMakerGLTFLoader, 'mock/path', expect.anything(), onProgress);
      expect(extendLoader).toBeCalledTimes(1);
      expect(mockLoader.manager).toBeDefined();
      expect(setURLModifierSpy).toBeCalledWith(uriModifier);
    });
  });

  describe('useGLTF.preload', () => {
    beforeEach(() => {
      setup();
    });

    it('should call useLoader.preload', async () => {
      let ext;
      mockPreloadFn.mockImplementation((_, __, e) => (ext = e));

      useGLTF.preload('mock/path', uriModifier, extendLoader);
      ext(mockLoader);

      expect(mockPreloadFn).toBeCalledWith(TwinMakerGLTFLoader, 'mock/path', expect.anything());
      expect(extendLoader).toBeCalledTimes(1);
      expect(mockLoader.manager).toBeDefined();
      expect(mockSetURLModifier).toBeCalledWith(uriModifier);
    });
  });

  describe('useGLTF.clear', () => {
    beforeEach(() => {
      setup();
    });

    it('should render with default props', async () => {
      const input = 'abc';

      useGLTF.clear(input);

      expect(mockClearFn).toBeCalledTimes(1);
      expect(mockClearFn).toBeCalledWith(TwinMakerGLTFLoader, input);
    });
  });
});

import { DRACOLoader } from 'three-stdlib';
import { DefaultLoadingManager } from 'three';
import { useLoader as mockUseLoader } from '@react-three/fiber';

import { GLTFLoader } from '../../../../three/GLTFLoader';
import { useGLTF } from '../GLTFLoader';
import { getGlobalSettings } from '../../../../common/GlobalSettings';
import { type BasisuDecoderConfig, type DracoDecoderConfig } from '../../../../interfaces';

vi.mock('three', async () => {
  const originalModule = await vi.importActual('three');
  return {
    ...originalModule,
    LoadingManager: class {
      setURLModifier = vi.fn();
    },
  };
});

vi.mock('@react-three/fiber', async () => {
  const originalModule = await vi.importActual('@react-three/fiber');
  return {
    ...originalModule,
    useLoader: vi.fn(),
  };
});

vi.mock('../../../../common/GlobalSettings', async () => {
  const originalModule = await vi.importActual('../../../../common/GlobalSettings');
  return {
    ...originalModule,
    getGlobalSettings: vi.fn(),
  };
});

describe('GLTFLoader', () => {
  const mockPreloadFn = vi.fn();
  const mockClearFn = vi.fn();

  const uriModifier = vi.fn();
  const extendLoader = vi.fn();
  const onProgress = vi.fn();

  let extensionsCb;
  let mockLoader;
  let gl;
  const createMockLoader = () => {
    return {
      setDRACOLoader: vi.fn(),
    };
  };

  const setup = () => {
    vi.resetAllMocks();

    mockLoader = createMockLoader();

    (mockUseLoader as unknown as vi.Mock).mockImplementation((l, p, e) => {
      extensionsCb = e;
    });
    (mockUseLoader as any).preload = mockPreloadFn;
    (mockUseLoader as any).clear = mockClearFn;
  };

  describe('extensions', () => {
    let setDecoderPathSpy;

    beforeEach(() => {
      setup();

      setDecoderPathSpy = vi.spyOn(DRACOLoader.prototype, 'setDecoderPath');
    });

    it('should execute without draco decoder enabled', async () => {
      const getGlobalSettingsMock = getGlobalSettings as vi.Mock;
      const dracoDecoder: DracoDecoderConfig = {
        enable: false,
      };
      const basisuDecoder: BasisuDecoderConfig = {
        enable: false,
      };
      getGlobalSettingsMock.mockReturnValue({
        basisuDecoder,
        dracoDecoder,
      });
      useGLTF('mock/path', gl, uriModifier, extendLoader, onProgress);
      extensionsCb(mockLoader);

      expect(extendLoader).toBeCalledTimes(1);
      expect(setDecoderPathSpy).not.toBeCalled();
      expect(mockLoader.setDRACOLoader).not.toBeCalled();
    });

    it('should execute without draco decoder enabled', async () => {
      const getGlobalSettingsMock = getGlobalSettings as vi.Mock;
      const dracoDecoder: DracoDecoderConfig = {
        enable: false,
      };
      const basisuDecoder: BasisuDecoderConfig = {
        enable: false,
      };
      getGlobalSettingsMock.mockReturnValue({
        basisuDecoder,
        dracoDecoder,
      });

      useGLTF(dracoDecoder.path as string, gl, uriModifier, extendLoader, onProgress);
      extensionsCb(mockLoader);

      expect(extendLoader).toBeCalledTimes(1);
      expect(mockLoader.setDRACOLoader).toBeCalledTimes(0);
    });
  });

  describe('useGLTF', () => {
    beforeEach(() => {
      setup();
    });

    it('should call useLoader', async () => {
      const getGlobalSettingsMock = getGlobalSettings as vi.Mock;
      const dracoDecoder: DracoDecoderConfig = {
        enable: true,
        path: 'draco/path',
      };
      const basisuDecoder: BasisuDecoderConfig = {
        enable: false,
      };
      getGlobalSettingsMock.mockReturnValue({
        basisuDecoder,
        dracoDecoder,
      });
      const setURLModifierSpy = vi.spyOn(DefaultLoadingManager, 'setURLModifier');

      useGLTF(dracoDecoder.path as string, gl, uriModifier, extendLoader, onProgress);
      extensionsCb(mockLoader);

      expect(mockUseLoader).toBeCalledWith(GLTFLoader, 'draco/path', expect.anything(), onProgress);
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
      const getGlobalSettingsMock = getGlobalSettings as vi.Mock;
      const dracoDecoder: DracoDecoderConfig = {
        enable: true,
        path: 'draco/path',
      };
      const basisuDecoder: BasisuDecoderConfig = {
        enable: false,
      };
      getGlobalSettingsMock.mockReturnValue({
        basisuDecoder,
        dracoDecoder,
      });
      mockPreloadFn.mockImplementation((_, __, e) => (ext = e));

      useGLTF.preload(dracoDecoder.path as string, gl, uriModifier, extendLoader);
      ext(mockLoader);

      expect(mockPreloadFn).toBeCalledWith(GLTFLoader, 'draco/path', expect.anything());
      expect(extendLoader).toBeCalledTimes(1);
      expect(mockLoader.manager).toBeDefined();
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
      expect(mockClearFn).toBeCalledWith(GLTFLoader, input);
    });
  });
});

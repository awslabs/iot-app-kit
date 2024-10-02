import { DRACOLoader } from 'three-stdlib';
import { DefaultLoadingManager } from 'three';
import { useLoader as mockUseLoader } from '@react-three/fiber';

import { GLTFLoader } from '../../../../three/GLTFLoader';
import { useGLTF } from '../GLTFLoader';
import { getGlobalSettings, getGlobalSettings as mockGetGlobalSettings } from '../../../../common/GlobalSettings';
import { BasisuDecoderConfig, DracoDecoderConfig } from '../../../../interfaces';
import { THREE_PATH } from '../../../../common/constants';
jest.mock('three', () => {
  const originalModule = jest.requireActual('three');
  return {
    ...originalModule,
    LoadingManager: class {
      setURLModifier = jest.fn();
    },
  };
});

jest.mock('@react-three/fiber', () => {
  const originalModule = jest.requireActual('@react-three/fiber');
  return {
    ...originalModule,
    useLoader: jest.fn(),
  };
});

jest.mock('../../../../common/GlobalSettings', () => {
  const originalModule = jest.requireActual('../../../../common/GlobalSettings');
  return {
    ...originalModule,
    getGlobalSettings: jest.fn(),
  };
});

describe('GLTFLoader', () => {
  const mockPreloadFn = jest.fn();
  const mockClearFn = jest.fn();

  const uriModifier = jest.fn();
  const extendLoader = jest.fn();
  const onProgress = jest.fn();

  let extensionsCb;
  let mockLoader;
  let gl;
  const createMockLoader = () => {
    return {
      setDRACOLoader: jest.fn(),
    };
  };

  const setup = () => {
    jest.resetAllMocks();

    mockLoader = createMockLoader();

    (mockUseLoader as unknown as jest.Mock).mockImplementation((l, p, e) => {
      extensionsCb = e;
    });
    (mockUseLoader as any).preload = mockPreloadFn;
    (mockUseLoader as any).clear = mockClearFn;
  };

  describe('extensions', () => {
    let setDecoderPathSpy;

    beforeEach(() => {
      setup();

      setDecoderPathSpy = jest.spyOn(DRACOLoader.prototype, 'setDecoderPath');
    });

    it('should execute without draco decoder enabled', async () => {
      const getGlobalSettingsMock = getGlobalSettings as jest.Mock;
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
      const getGlobalSettingsMock = getGlobalSettings as jest.Mock;
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

      useGLTF(dracoDecoder.path as string, gl, uriModifier, extendLoader, onProgress);
      extensionsCb(mockLoader);

      expect(extendLoader).toBeCalledTimes(1);
      expect(setDecoderPathSpy).toBeCalledWith('draco/path');
      expect(mockLoader.setDRACOLoader).toBeCalledTimes(1);
    });
  });

  describe('useGLTF', () => {
    beforeEach(() => {
      setup();
    });

    it('should call useLoader', async () => {
      const getGlobalSettingsMock = getGlobalSettings as jest.Mock;
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
      const setURLModifierSpy = jest.spyOn(DefaultLoadingManager, 'setURLModifier');

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
      const getGlobalSettingsMock = getGlobalSettings as jest.Mock;
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

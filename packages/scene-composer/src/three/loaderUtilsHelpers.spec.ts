import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module';

import { THREE_PATH } from '../common/constants';
import { getGlobalSettings } from '../common/GlobalSettings';
import { BasisuDecoderConfig, DracoDecoderConfig } from '../interfaces';

import { setupBasisuSupport, setupDracoSupport, setupFileLoader } from './loaderUtilsHelpers';

jest.mock('../common/GlobalSettings');

describe('dracoSupport', () => {
  it('it should do nothing if draco is not enabled', () => {
    const getGlobalSettingsMock = getGlobalSettings as jest.Mock;

    const dracoDecoder: DracoDecoderConfig = {
      enable: false,
    };

    getGlobalSettingsMock.mockReturnValue({
      dracoDecoder,
      getSceneObjectFunction: jest.fn(),
    });

    const loader = {
      setDRACOLoader: jest.fn(),
    };

    // Act
    setupDracoSupport(loader);

    expect(loader.setDRACOLoader).not.toBeCalled();
  });

  ['/fake/path/to/draco', undefined].forEach((path) => {
    it(`should use ${path} if not provided`, () => {
      const getGlobalSettingsMock = getGlobalSettings as jest.Mock;

      const dracoDecoder: DracoDecoderConfig = {
        enable: true,
        path,
      };

      getGlobalSettingsMock.mockReturnValue({
        dracoDecoder,
        getSceneObjectFunction: jest.fn(),
      });

      const loader = {
        setDRACOLoader: jest.fn(),
      };

      const dracoLoader = {
        setDecoderConfig: jest.fn(() => dracoLoader),
        setDecoderPath: jest.fn(),
      };

      // Act
      setupDracoSupport(loader, dracoLoader);

      const expectedPath = path ?? `${THREE_PATH}/examples/jsm/libs/draco/gltf/`;

      // Assert
      expect(dracoLoader.setDecoderConfig).toBeCalledWith({ type: 'js' });
      expect(dracoLoader.setDecoderPath).toBeCalledWith(expectedPath);
    });
  });
});

describe('setupBasisu', () => {
  it('should do nothing if not enabled', () => {
    const gl = {};
    const getGlobalSettingsMock = getGlobalSettings as jest.Mock;
    const basisuDecoder: BasisuDecoderConfig = {
      enable: false,
    };
    getGlobalSettingsMock.mockReturnValue({
      basisuDecoder,
      getSceneObjectFunction: jest.fn(),
    });

    const loader = {
      setKTX2Loader: jest.fn(),
    };

    // Act
    setupBasisuSupport(loader, gl);
    expect(loader.setKTX2Loader).not.toBeCalled();
  });
  ['/fake/path/to/basisu', undefined].forEach((path) => {
    it(`should use ${path} if not provided`, () => {
      const gl = {};
      const getGlobalSettingsMock = getGlobalSettings as jest.Mock;

      const basisuDecoder: BasisuDecoderConfig = {
        enable: true,
        path,
      };
      getGlobalSettingsMock.mockReturnValue({
        basisuDecoder,
        getSceneObjectFunction: jest.fn(),
      });
      const loader = {
        setKTX2Loader: jest.fn(),
        setMeshoptDecoder: jest.fn(),
      };

      const ktx2loader = {
        setTranscoderPath: jest.fn(() => ktx2loader),
        detectSupport: jest.fn(),
      };

      // Act
      setupBasisuSupport(loader, gl, ktx2loader);

      const expectedPath = path ?? `${THREE_PATH}/examples/jsm/libs/basis/`;

      // Assert
      expect(ktx2loader.setTranscoderPath).toBeCalledWith(expectedPath);
      expect(ktx2loader.detectSupport).toBeCalledWith(gl);
      expect(loader.setMeshoptDecoder).toBeCalledWith(MeshoptDecoder);
    });
  });
});

describe('setupFileLoader', () => {
  it('should do nothing if getSceneObjectFunction is undefined', () => {
    const loader = {
      setFileLoader: jest.fn(),
      setTextureLoader: jest.fn(),
    };

    // Act
    expect(loader.setFileLoader).not.toBeCalled();
    expect(loader.setTextureLoader).not.toBeCalled();
  });
  it('should set the file & texture loaders', () => {
    const getGlobalSettingsMock = getGlobalSettings as jest.Mock;
    getGlobalSettingsMock.mockReturnValue({
      getSceneObjectFunction: jest.fn(),
    });
    const loader = {
      setFileLoader: jest.fn(),
      setTextureLoader: jest.fn(),
    };

    // Act
    setupFileLoader(loader);

    // Assert
    expect(loader.setFileLoader).toBeCalled();
    expect(loader.setTextureLoader).toBeCalled();
  });
});

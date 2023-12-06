import { renderHook } from '@testing-library/react-hooks';
import { Mesh, Texture, MeshStandardMaterial } from 'three';

jest.mock('../common/GlobalSettings', () => ({
  getGlobalSettings: jest.fn(() => ({
    getSceneObjectFunction: jest.fn(),
  })),
}));

const texture = new Texture();
texture.name = 'testTexture';

const oldTexture = new Texture();
texture.name = 'oldTexture';

jest.mock('../three/TwinMakerTextureLoader', () => {
  return {
    TwinMakerTextureLoader: jest.fn().mockImplementation(() => {
      return {
        setOptions: jest.fn(),
        load: jest.fn((url, onLoad) => {
          onLoad(texture);
        }),
        setGetSceneObjectFunction: jest.fn(),
        manager: {
          onStart: jest.fn(),
          onLoad: jest.fn(),
          onError: jest.fn(),
        },
      };
    }),
  };
});

import useTwinMakerTextureLoader from './useTwinMakerTextureLoader';

describe('useTwinMakerTextureLoader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call texture load callback', () => {
    const { loadTexture } = renderHook(() => useTwinMakerTextureLoader({ imageOrientation: 'flipY' })).result.current;
    const mockOnLoadCallback = jest.fn();
    loadTexture('myUri', mockOnLoadCallback);

    expect(mockOnLoadCallback).toBeCalledWith(texture);
  });

  it('should load texture on mesh', () => {
    const material = new MeshStandardMaterial();
    const mesh = new Mesh(undefined, material);
    const { loadTextureOnMesh } = renderHook(() => useTwinMakerTextureLoader()).result.current;
    loadTextureOnMesh('myUri', mesh);

    expect(mesh.material.map).toEqual(texture);
  });

  it('should replace a texture on mesh', () => {
    const material = new MeshStandardMaterial();
    material.map = oldTexture;
    const mesh = new Mesh(undefined, material);
    const { loadTextureOnMesh } = renderHook(() => useTwinMakerTextureLoader()).result.current;
    loadTextureOnMesh('myUri', mesh);

    expect(mesh.material.map).toEqual(texture);
  });

  it('should remove texture on mesh', () => {
    const material = new MeshStandardMaterial();
    material.map = texture;
    const mesh = new Mesh(undefined, material);
    const { clearTextureOnMesh } = renderHook(() => useTwinMakerTextureLoader()).result.current;
    clearTextureOnMesh(mesh);

    expect(mesh.material.map).toBeNull();
  });
});

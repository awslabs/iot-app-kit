import { renderHook } from '@testing-library/react';
import { Mesh, MeshStandardMaterial, Texture } from 'three';

vi.mock('../common/GlobalSettings', () => ({
  getGlobalSettings: vi.fn(() => ({
    getSceneObjectFunction: vi.fn(),
  })),
}));

const texture = new Texture();
texture.name = 'testTexture';

const oldTexture = new Texture();
texture.name = 'oldTexture';

vi.mock('../three/TwinMakerTextureLoader', () => {
  return {
    TwinMakerTextureLoader: vi.fn().mockImplementation(() => {
      return {
        setOptions: vi.fn(),
        load: vi.fn((url, onLoad) => {
          onLoad(texture);
        }),
        setGetSceneObjectFunction: vi.fn(),
        manager: {
          onStart: vi.fn(),
          onLoad: vi.fn(),
          onError: vi.fn(),
        },
      };
    }),
  };
});

import useTwinMakerTextureLoader from './useTwinMakerTextureLoader';

describe('useTwinMakerTextureLoader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call texture load callback', () => {
    const { loadTexture } = renderHook(() => useTwinMakerTextureLoader({ imageOrientation: 'flipY' })).result.current;
    const mockOnLoadCallback = vi.fn();
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

import * as THREE from 'three';

import { TwinMakerTextureLoader } from '../../../three/TwinMakerTextureLoader';

import { generateCubeMapSkyboxTexture, generateSixSidedSkyboxTexture, areAllImagesInCache } from './ImmersiveViewUtils';

describe('ImmersiveViewUtils', () => {
  describe('areAllImagesInCache', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return true if all are cached', () => {
      jest.spyOn(THREE.Cache, 'get').mockReturnValue(new THREE.Texture());

      expect(areAllImagesInCache(['test1'])).toEqual(true);
    });

    it('should return true if any are not cached', () => {
      jest.spyOn(THREE.Cache, 'get').mockReturnValue(new THREE.Texture()).mockReturnValue(null);

      expect(areAllImagesInCache(['test1', 'test2'])).toEqual(false);
    });
  });

  describe('generateSixSidedSkyboxTexture', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should load textures successfully with valid S3 images', async () => {
      const setTextures = jest.fn();
      jest.spyOn(TwinMakerTextureLoader.prototype, 'load').mockImplementation((url, onLoad, onProgress, onError) => {
        onLoad?.(`mock-value-${url}` as any);
      });

      generateSixSidedSkyboxTexture(['image-0', 'image-1', 'image-2'], setTextures);
      await new Promise((resolve) => setTimeout(resolve, 1));

      expect(setTextures).toBeCalledTimes(1);
      expect(setTextures).toBeCalledWith(['mock-value-image-0', 'mock-value-image-1', 'mock-value-image-2']);
    });

    it('should load textures successfully with valid S3 images without setTexture', async () => {
      jest.spyOn(TwinMakerTextureLoader.prototype, 'load').mockImplementation((url, onLoad, onProgress, onError) => {
        onLoad?.(`mock-value-${url}` as any);
      });

      generateSixSidedSkyboxTexture(['image-0', 'image-1', 'image-2']);
      await new Promise((resolve) => setTimeout(resolve, 1));

      ['image-0', 'image-1', 'image-2'].forEach((url) => {
        expect(TwinMakerTextureLoader.prototype.load).toHaveBeenCalledWith(
          url,
          expect.anything(),
          undefined,
          expect.anything(),
        );
      });
    });

    it('should fail is if failed to load images', async () => {
      const setTextures = jest.fn();
      jest.spyOn(TwinMakerTextureLoader.prototype, 'load').mockImplementation((url, onLoad, onProgress, onError) => {
        onError?.(`mock-error-${url}` as any);
      });

      let error: string | undefined;
      try {
        await generateSixSidedSkyboxTexture(['image-0', 'image-1', 'image-2'], setTextures);
      } catch (err) {
        error = err as string;
      }
      expect(error).toMatch(/^mock-error-/);
      expect(setTextures).toBeCalledTimes(0);
    });
  });

  describe('generateCubeMapSkyboxTexture', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should load texture successfully with valid S3 image', async () => {
      const setTextures = jest.fn();
      jest.spyOn(TwinMakerTextureLoader.prototype, 'load').mockImplementation((url, onLoad, onProgress, onError) => {
        onLoad?.({ image: { width: 1 } } as any);
      });

      generateCubeMapSkyboxTexture('image-0', setTextures);
      await new Promise((resolve) => setTimeout(resolve, 1));

      expect(setTextures).toBeCalledTimes(1);
      expect(setTextures).toBeCalledWith(expect.any(Array));
      expect(setTextures.mock.calls[0][0]).toHaveLength(6);
    });

    it('should load textures successfully with valid S3 images without setTexture', async () => {
      jest.spyOn(TwinMakerTextureLoader.prototype, 'load').mockImplementation((url, onLoad, onProgress, onError) => {
        onLoad?.({ image: { width: 1 } } as any);
      });

      generateCubeMapSkyboxTexture('image');
      await new Promise((resolve) => setTimeout(resolve, 1));

      expect(TwinMakerTextureLoader.prototype.load).toHaveBeenCalledWith(
        'image',
        expect.anything(),
        undefined,
        expect.anything(),
      );
    });

    it('should fail is if failed to load images', (done) => {
      const setTextures = jest.fn();
      jest.spyOn(TwinMakerTextureLoader.prototype, 'load').mockImplementation((url, onLoad, onProgress, onError) => {
        onError?.(`mock-error-${url}` as any);
      });

      let error: string | undefined;
      generateCubeMapSkyboxTexture('image-0', setTextures)
        .catch((err) => {
          error = err as string;

          expect(error).toMatch(/^mock-error-/);
          expect(setTextures).toBeCalledTimes(0);
        })
        .finally(() => {
          done();
        });
    });
  });
});

import { type WebGLRenderer } from 'three';

import { type GLTFLoader } from './GLTFLoader';
import { setupTwinMakerGLTFLoader } from './loaderUtils';
import { setupBasisuSupport, setupDracoSupport, setupFileLoader } from './loaderUtilsHelpers';

vi.mock('./loaderUtilsHelpers');

describe('loaderUtils', () => {
  it('should setup DRACO', () => {
    const loader = vi.fn() as unknown as GLTFLoader;
    const renderer = vi.fn() as unknown as WebGLRenderer;

    // ACT
    const results = setupTwinMakerGLTFLoader(loader, renderer);

    // Assert
    expect(results).toBe(loader);
    expect(setupDracoSupport).toBeCalled();
    expect(setupFileLoader).toBeCalled();
    expect(setupBasisuSupport).toBeCalled();
  });
});

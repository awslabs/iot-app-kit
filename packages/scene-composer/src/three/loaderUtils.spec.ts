import { setDracoDecoder, setGetSceneObjectFunction } from '../common/GlobalSettings';
import { DRACO_PATH } from '../common/constants';

import { TwinMakerGLTFLoader } from './GLTFLoader';
import { setupTwinMakerGLTFLoader } from './loaderUtils';

describe('setupTwinMakerGLTFLoader', () => {
  it('should setup DRACO loader with custom path successfully', async () => {
    setDracoDecoder({ enable: true, path: 'mock-path' });
    const loader = new TwinMakerGLTFLoader();
    setupTwinMakerGLTFLoader(loader);
    expect(loader.dracoLoader.decoderPath).toBe('mock-path');
  });

  it('should setup DRACO loader with default path successfully', async () => {
    setDracoDecoder({ enable: true });
    const loader = new TwinMakerGLTFLoader();
    setupTwinMakerGLTFLoader(loader);
    expect(loader.dracoLoader.decoderPath).toBe(DRACO_PATH);
  });

  it('should setup DRACO loader and getSceneObjectFunction successfully', async () => {
    const mockGetSceneObjectFunction = {} as any;
    setGetSceneObjectFunction(mockGetSceneObjectFunction);
    const loader = new TwinMakerGLTFLoader();
    setupTwinMakerGLTFLoader(loader);
    expect(loader.fileLoader.getSceneObjectFunction).toBe(mockGetSceneObjectFunction);
  });
});

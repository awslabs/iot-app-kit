import { MathUtils } from 'three';

import { DEFAULT_CAMERA_OPTIONS, DEFAULT_CAMERA_POSITION, DEFAULT_CAMERA_TARGET } from '../common/constants';
import { useSceneComposerId } from '../common/sceneComposerIdContext';
import { type CameraSettings } from '../interfaces';
import { useEditorState } from '../store';

import useActiveCamera from './useActiveCamera';

vi.mock('../store', async () => ({
  ...(await vi.importActual('../store')),
  useEditorState: vi.fn(),
}));

vi.mock('../common/sceneComposerIdContext', async () => ({
  ...(await vi.importActual('../common/sceneComposerIdContext')),
  useSceneComposerId: vi.fn(),
}));

vi.mock('react', async () => ({
  ...(await vi.importActual('react')),
  useCallback: vi.fn((cb) => cb), // unbox callbacks.
}));

describe('useSelectedObject', () => {
  const defaultCameraSettings: CameraSettings = {
    cameraType: 'Perspective',
    fov: DEFAULT_CAMERA_OPTIONS.fov,
    far: DEFAULT_CAMERA_OPTIONS.far,
    near: DEFAULT_CAMERA_OPTIONS.near,
    zoom: 1,
    transform: {
      position: DEFAULT_CAMERA_POSITION,
    },
  };
  const sceneComposerId = 'default';
  const setActiveCameraSettings = vi.fn();
  const isViewing = vi.fn();
  const setCameraTarget = vi.fn();

  beforeEach(() => {
    (useSceneComposerId as vi.Mock).mockImplementation(() => sceneComposerId);
    (useEditorState as vi.Mock).mockImplementation(() => ({
      setActiveCameraSettings,
      activeCameraSettings: defaultCameraSettings,
      isViewing,
      setCameraTarget,
    }));
    vi.clearAllMocks();
  });

  it('should return the object from the store', () => {
    // Act
    const result = useActiveCamera();

    expect(result).toMatchSnapshot();
  });

  it('should call dependencies when setActiveCameraSettings is called and in viewing mode', () => {
    const differentCameraSettings: CameraSettings = {
      cameraType: 'Perspective',
      fov: 100,
      far: 20,
      near: 0.1,
      zoom: 1,
      transform: {
        position: [1, 1, 1],
      },
    };
    isViewing.mockReturnValue(true);

    const activeCamera = useActiveCamera();
    activeCamera.setActiveCameraSettings(differentCameraSettings, 'teleport');

    expect(setActiveCameraSettings).toHaveBeenCalledWith(differentCameraSettings);
    expect(setCameraTarget).toHaveBeenCalledWith({ position: [1, 1, 1], target: DEFAULT_CAMERA_TARGET }, 'teleport');
  });

  it('should call dependencies with calculated target is called and in viewing mode with a rotation transform', () => {
    const differentCameraSettings: CameraSettings = {
      cameraType: 'Perspective',
      fov: 1000,
      far: 50,
      near: 0.2,
      zoom: 1,
      transform: {
        position: [10, 0, 0],
        rotation: [0, MathUtils.degToRad(90), 0],
      },
    };
    const expectedCalculatedTarget = [0, 0, -2.220446049250313e-15];
    isViewing.mockReturnValue(true);

    const activeCamera = useActiveCamera();
    activeCamera.setActiveCameraSettings(differentCameraSettings);

    expect(setActiveCameraSettings).toHaveBeenCalledWith(differentCameraSettings);
    expect(setCameraTarget).toHaveBeenCalledWith(
      { position: [10, 0, 0], target: expectedCalculatedTarget },
      'transition',
    );
  });

  it('should call setActiveCameraSettings but not setCameraTarget when setActiveCameraSettings is called and in edit mode', () => {
    const differentCameraSettings: CameraSettings = {
      cameraType: 'Perspective',
      fov: 100,
      far: 20,
      near: 0.1,
      zoom: 1,
      transform: {
        position: [1, 1, 1],
      },
    };
    isViewing.mockReturnValue(false);

    const activeCamera = useActiveCamera();
    activeCamera.setActiveCameraSettings(differentCameraSettings, 'teleport');

    expect(setActiveCameraSettings).toHaveBeenCalledWith(differentCameraSettings);
    expect(setCameraTarget).not.toBeCalled();
  });

  it('should call dependencies when setActiveCameraSettings is called and in edit mode when forced', () => {
    const differentCameraSettings: CameraSettings = {
      cameraType: 'Perspective',
      fov: 100,
      far: 20,
      near: 0.1,
      zoom: 1,
      transform: {
        position: [1, 1, 1],
      },
    };
    isViewing.mockReturnValue(false);

    const activeCamera = useActiveCamera();
    activeCamera.setActiveCameraSettings(differentCameraSettings, 'teleport', true);

    expect(setActiveCameraSettings).toHaveBeenCalledWith(differentCameraSettings);
    expect(setCameraTarget).toHaveBeenCalledWith({ position: [1, 1, 1], target: DEFAULT_CAMERA_TARGET }, 'teleport');
  });
});

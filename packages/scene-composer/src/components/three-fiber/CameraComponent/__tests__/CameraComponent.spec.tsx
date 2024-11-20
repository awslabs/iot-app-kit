import { render } from '@/tests/testing-library';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { type Mock } from 'vitest';
import CameraComponent from '..';
import useActiveCamera from '../../../../hooks/useActiveCamera';
import { accessStore, type ICameraComponentInternal, type ISceneNodeInternal, useEditorState } from '../../../../store';

vi.mock('../../../../store', async () => {
  const originalModule = await vi.importActual('../../../../store');
  return {
    ...originalModule,
    accessStore: vi.fn(),
    useSceneDocument: vi.fn(() => ({ document: { defaultCameraRef: { ref: 'testCamera' } } })),
    useEditorState: vi.fn(),
  };
});

vi.mock('@react-three/fiber', async () => {
  const originalModule = await vi.importActual('@react-three/fiber');
  return {
    ...originalModule,
    useThree: vi.fn(),
    useFrame: vi.fn().mockImplementation((callback) => callback()),
  };
});

vi.mock('../../../../hooks/useSelectedNode', () => ({
  default: vi.fn().mockReturnValue({
    selectedSceneNodeRef: 'testRef',
  }),
}));

vi.mock('../../../../hooks/useActiveCamera', () => ({
  default: vi.fn().mockReturnValue({ activeCameraName: 'test-camera', setActiveCameraName: vi.fn() }),
}));

vi.mock('../../../../hooks/useEditorHelper', () => {
  return { useEditorHelper: vi.fn() };
});

describe('CameraComponent', () => {
  const node = {
    ref: 'testRef',
    name: 'testCamera',
    transform: {
      position: [5, 5, 5],
    },
  } as ISceneNodeInternal;
  const isEditing = vi.fn();
  const isViewing = vi.fn();
  const object3D = new THREE.Object3D();
  object3D.position.set(5, 5, 5);
  object3D.rotation.set(0, 0, 0);
  object3D.scale.set(1, 1, 1);

  beforeEach(() => {
    const mockState = { isEditing: true, isLoadingModel: false };

    const accessStoreMock = accessStore as Mock;
    accessStoreMock.mockReturnValue({ getState: vi.fn(() => mockState) });

    const useThreeMock = useThree as Mock;
    useThreeMock.mockReturnValue({ width: 1920, height: 1080 });

    const useEditorStateMock = useEditorState as Mock;
    useEditorStateMock.mockReturnValue({
      isEditing,
      isViewing,
      getObject3DBySceneNodeRef: vi.fn().mockReturnValue(object3D),
    });

    vi.clearAllMocks();
  });

  it.skip('should render correctly for perspective camera', () => {
    isEditing.mockReturnValue(true);
    (useActiveCamera as Mock).mockReturnValue({
      activeCameraSettings: {
        cameraType: 'Perspective',
        fov: 100,
        far: 50,
        near: 0.2,
        transform: {
          position: [5, 5, 5],
        },
      },
      setActiveCameraSettings: vi.fn(),
    });
    const component = {
      ref: 'testCamera',
      fov: 60,
      near: 0,
      far: 100,
      zoom: 1,
      cameraType: 'Perspective',
    } as ICameraComponentInternal;

    const { container } = render(<CameraComponent node={node} component={component} />);
    expect(container).toMatchSnapshot();
    expect(useActiveCamera().setActiveCameraSettings).not.toBeCalled();
  });

  it('should render as default correctly for perspective camera in viewing mode', () => {
    isEditing.mockReturnValue(false);
    const component = {
      ref: 'testCamera',
      fov: 60,
      near: 0,
      far: 100,
      zoom: 1,
      cameraType: 'Perspective',
    } as ICameraComponentInternal;

    const { container } = render(<CameraComponent node={node} component={component} />);
    expect(container).toMatchSnapshot();
  });

  it.skip('should render correctly for orthographic camera', () => {
    isEditing.mockReturnValue(true);
    const component = {
      ref: 'testCamera',
      fov: 60,
      near: 0,
      far: 100,
      zoom: 1,
      cameraType: 'Orthographic',
    } as ICameraComponentInternal;

    const { container } = render(<CameraComponent node={node} component={component} />);
    expect(container).toMatchSnapshot();
  });

  it.skip('should call setActiveCameraSettings if activeCameraName matches the name of the node', () => {
    isEditing.mockReturnValue(true);
    (useActiveCamera as Mock).mockReturnValue({
      activeCameraSettings: {
        cameraType: 'Perspective',
        fov: 100,
        far: 50,
        near: 0.2,
        transform: {
          position: [5, 5, 5],
        },
      },
      setActiveCameraSettings: vi.fn(),
      activeCameraName: 'testCamera',
    });
    const component = {
      ref: 'testCamera',
      fov: 60,
      near: 0,
      far: 100,
      zoom: 1,
      cameraType: 'Perspective',
    } as ICameraComponentInternal;

    render(<CameraComponent node={node} component={component} />);

    const argValue = (useActiveCamera().setActiveCameraSettings as Mock).mock.calls[0][0];

    expect(argValue).toMatchInlineSnapshot(`
      {
        "cameraType": "Perspective",
        "far": 100,
        "fov": 60,
        "near": 0,
        "transform": {
          "position": [
            5,
            5,
            5,
          ],
          "rotation": [
            -0,
            0,
            -0,
          ],
          "scale": [
            1,
            1,
            1,
          ],
        },
        "zoom": 1,
      }
    `);
  });
});

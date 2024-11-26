import { fireEvent, render } from '@/tests/testing-library';
import * as THREE from 'three';
import { DEFAULT_CAMERA_OPTIONS, DEFAULT_CAMERA_POSITION, KnownComponentType } from '../../..';
import { accessStore } from '../../../store';
import { TopBar } from '../TopBar';

const setActiveCameraSettings = vi.fn();

vi.mock('../../../hooks/useActiveCamera', () => ({
  default: vi.fn(() => ({
    setActiveCameraSettings,
  })),
}));

const cameraSettings = {
  cameraType: 'Perspective',
  fov: DEFAULT_CAMERA_OPTIONS.fov,
  far: DEFAULT_CAMERA_OPTIONS.far,
  near: DEFAULT_CAMERA_OPTIONS.near,
  zoom: 1,
};
const cameraComponent = {
  ...cameraSettings,
  type: KnownComponentType.Camera,
};

const cameraNode = {
  ref: 'camera-uuid',
  name: 'Camera',
  transform: {
    position: DEFAULT_CAMERA_POSITION,
  },
  components: [cameraComponent],
};

const node = {
  ref: 'test-uuid',
  name: 'Model',
  transform: {
    position: [1, 1, 1],
  },
  components: [{ type: KnownComponentType.ModelRef }],
};

const object3D = new THREE.Object3D();
object3D.position.set(5, 5, 5);
object3D.rotation.set(0, 0, 0);
object3D.scale.set(1, 1, 1);

const getObject3DBySceneNodeRef = vi.fn(() => object3D);

const baseState = {
  getSceneNodeByRef: vi.fn(() => cameraNode),
  getObject3DBySceneNodeRef,
  document: {
    nodeMap: {
      'test-uuid': node,
    },
  },
} as any;

describe('<TopBar />', () => {
  it('should not render without camera view', () => {
    accessStore('default').setState(baseState);

    const { container } = render(<TopBar />);
    expect(container).toMatchSnapshot();
  });

  it('should render Cameras Drop down with camera view', () => {
    const document = {
      nodeMap: {
        'camera-uuid': cameraNode,
      },
    };

    accessStore('default').setState({ ...baseState, document });

    const { container } = render(<TopBar />);
    expect(container).toMatchSnapshot();
  });

  it.skip('should call setActiveCameraSettings when camera clicked', async () => {
    const document = {
      nodeMap: {
        'camera-uuid': cameraNode,
      },
    };

    accessStore('default').setState({ ...baseState, document });

    const { getByTestId } = render(<TopBar />);

    const dropdown = getByTestId('camera-views');
    const item = dropdown?.querySelector('#camera-uuid');

    fireEvent.click(item!);

    const arg = setActiveCameraSettings.mock.calls[0][0];

    expect(arg).toMatchInlineSnapshot(`
      {
        "cameraType": "Perspective",
        "far": 1000,
        "fov": 53.13,
        "near": 0.1,
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

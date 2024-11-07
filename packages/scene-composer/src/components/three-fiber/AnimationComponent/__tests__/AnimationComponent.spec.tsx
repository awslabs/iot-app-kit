import * as THREE from 'three';
import { render } from '@testing-library/react';

import { type ISceneNodeInternal, accessStore, type IAnimationComponentInternal } from '../../../../store';
import AnimationComponent, { toggleIsAnimationPaused } from '../AnimationComponent';
import { generateUUID } from '../../../../utils/mathUtils';

jest.mock('../../../../store', () => {
  const originalModule = jest.requireActual('../../../../store');
  return {
    ...originalModule,
  };
});

jest.mock('@react-three/fiber', () => {
  const originalModule = jest.requireActual('@react-three/fiber');
  return {
    ...originalModule,
    useLoader: jest.fn(),
    useFrame: jest.fn().mockImplementation((func) => {
      func();
    }),
  };
});

jest.useFakeTimers();

describe('toggleIsAnimationPaused', () => {
  test('tests if paused', () => {
    jest.mock('../../../../common/sceneComposerIdContext', () => ({
      useSceneComposerId: jest.fn(() => '3d74e3fe-9f8a-4190-a3c1-1b311a70ae30'),
    }));

    jest.mock('three', () => ({
      findByName: jest.fn(),
    }));
    const Mixer = new THREE.AnimationMixer({ animations: ['Action.013'] } as any);

    jest.mock('three', () => ({
      findByName: jest.fn(),
      clipAction: jest.fn(),
    }));

    expect(toggleIsAnimationPaused(Mixer, true, ['Action.013'])).toBe(undefined);
  });
});

const mockNode = {
  ref: 'ce7802dd-477e-4bae-b787-374aea3fce77',
  name: 'ANIMATED_MIXER',
  transform: {
    position: [-0.2548017433916856, 0.1565180250896893, 1.9222755178165505],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
  transformConstraint: {},
  properties: {},
  components: [
    {
      ref: 'f7bdb4b0-8627-4c83-825e-bace9874bc08',
      type: 'ModelRef',
      uri: 'ANIMATED_MIXER.gltf',
      modelType: 'GLTF',
    },
    {
      selector: 1,
      ref: 'a2159735-991c-41da-a217-c39445a47b46',
      currentAnimations: ['Action.018'],
      uri: 'ANIMATED_MIXER.gltf',
      type: 'Animation',
    },
  ],
  childRefs: [],
} as unknown as ISceneNodeInternal;

const object3D = new THREE.Object3D();
const sceneobject = new THREE.Object3D();

sceneobject.animations = { animations: 'Action.018' } as unknown as THREE.AnimationClip;
sceneobject.name = 'Scene';
object3D.add(sceneobject);
const baseState = {
  setScene: jest.fn().mockReturnValue(mockNode),
  getObject3DBySceneNodeRef: jest.fn().mockReturnValue(object3D),
  getObjectByName: jest.fn().mockReturnValue(new THREE.Scene()),
  document: {
    nodeMap: {
      'test-uuid': mockNode,
    },
  },
};

describe('<AnimationComponent />', () => {
  it('should test a simple animation component', () => {
    const mockComponent: IAnimationComponentInternal = {
      ref: generateUUID(),
      uri: 'Animated_Mixer.gltf',
      currentAnimations: ['Action.018'],
    } as IAnimationComponentInternal;

    accessStore('default').setState(baseState);
    const { container } = render(<AnimationComponent node={mockNode} component={mockComponent as IComponent} />);

    expect(container).toMatchSnapshot();
  });
  it('should test more branches', () => {
    const mockComponent: IAnimationComponentInternal = {
      ref: generateUUID(),
      uri: 'Animated_Mixer.gltf',
      currentAnimations: ['Action.018'],
    } as IAnimationComponentInternal;
    jest.mock('three', () => ({
      findByName: jest.fn().mockReturnValue(''),
      clipAction: jest.fn().mockReturnValue(''),
    }));
    const mockObject3D = { s: 'action 1' };

    jest.mock('../../../../store', () => {
      const originalModule = jest.requireActual('../../../../store');

      const getObject3DMock = jest.fn();
      getObject3DMock.mockImplementation(() => {
        return mockObject3D;
      });
      return {
        ...originalModule,
        useEditorState: { getObject3DBySceneNodeRef: getObject3DMock },
      };
    });
    accessStore('default').setState(baseState);
    const { container } = render(<AnimationComponent node={mockNode} component={mockComponent as IComponent} />);
    expect(container).toMatchSnapshot();
  });
});

import { Canvas, useThree } from '@react-three/fiber';
import * as React from 'react';
import { create } from 'react-test-renderer';
import { BoxGeometry, Group, Mesh, MeshBasicMaterial } from 'three';

import { setFeatureConfig } from '../common/GlobalSettings';
import { accessStore } from '../store';

import { WebGLCanvasManager } from './WebGLCanvasManager';

import Mock = vi.Mock;

vi.mock('react', async () => ({
  ...(await vi.importActual('react')),
  useEffect: vi.fn(),
}));

// Mock other internal components
vi.mock('./three-fiber/EntityGroup', () => ({ default: 'EntityGroup' }));
vi.mock('./three-fiber/Environment', async () => {
  const originalModule = await vi.importActual('./three-fiber/Environment');
  return {
    ...originalModule,
    Environment: 'Environment',
  };
});
vi.mock('./three-fiber/StatsWindow', () => {
  return {
    StatsWindow: 'StatsWindow',
  };
});
vi.mock('./three-fiber/EditorCamera', () => {
  return {
    EditorMainCamera: 'EditorMainCamera',
  };
});
vi.mock('./three-fiber/EditorTransformControls', () => {
  return {
    EditorTransformControls: 'EditorTransformControls',
  };
});
vi.mock('./three-fiber/SceneInfoView', () => {
  return {
    SceneInfoView: 'SceneInfoView',
  };
});

// Mock Hooks
vi.mock('@react-three/fiber', async () => {
  const originalModule = await vi.importActual('@react-three/fiber');
  return {
    ...originalModule,
    useThree: vi.fn(),
    useLoader: vi.fn(),
  };
});

class ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

const Layout: React.FC = () => {
  return (
    <Canvas>
      <React.Suspense fallback={null}>
        <WebGLCanvasManager />
      </React.Suspense>
    </Canvas>
  );
};

describe('WebGLCanvasManagerSnap', () => {
  window.ResizeObserver = ResizeObserver;
  const body = document.createElement('body');
  const div = document.createElement('div');
  body.appendChild(div);

  const mockThreeStates = {
    gl: {
      domElement: div,
    },
    size: {
      width: 1920,
      height: 1080,
    },
  };

  const sceneDocument = {
    rootNodeRefs: ['testNode'],
    nodeMap: {
      testNode: { childRefs: ['childNode'] },
      childNode: { parentRef: 'testNode', childRefs: ['grandchildNode'] },
      grandchildNode: { parentRef: 'childNode', childRefs: [] },
    },
  };

  const group = new Group();
  const geometry = new BoxGeometry();
  geometry.uuid = 'Geometry';
  const material = new MeshBasicMaterial();
  material.uuid = 'Material';
  const mesh = new Mesh(geometry, material);
  group.name = 'Test';
  group.uuid = 'Forced';
  mesh.uuid = 'Forced2';
  group.add(mesh);

  const baseState: any = {
    getSceneNodeByRef: vi.fn(),
    getSceneProperty: vi.fn(),
    isEditing: vi.fn(),
    document: sceneDocument,
    getObject3DBySceneNodeRef: vi.fn().mockReturnValue(group),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    const mockUseThree = useThree as Mock;
    mockUseThree.mockReturnValue(mockThreeStates);

    setFeatureConfig({});
  });

  it('should render editing correctly without immersive view feature', () => {
    accessStore('default').setState(baseState);
    baseState.isEditing.mockReturnValue(true);
    baseState.getSceneNodeByRef.mockReturnValue('childNode');

    const container = create(<Layout />);
    expect(container).toMatchSnapshot();
  });

  it('should render viewing correctly without immersive view feature', () => {
    accessStore('default').setState(baseState);
    baseState.isEditing.mockReturnValue(false);
    baseState.getSceneNodeByRef.mockReturnValue('childNode');

    const container = create(<Layout />);
    expect(container).toMatchSnapshot();
  });
});

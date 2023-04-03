import React from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { BoxGeometry, Mesh, MeshBasicMaterial, Group } from 'three';
import renderer from 'react-test-renderer';

import { useStore } from '../store';
import { setFeatureConfig } from '../common/GlobalSettings';

import { WebGLCanvasManager } from './WebGLCanvasManager';

import Mock = jest.Mock;

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
}));

// Mock other internal components
jest.mock('./three-fiber/EntityGroup', () => 'EntityGroup');
jest.mock('./three-fiber/Environment', () => {
  const originalModule = jest.requireActual('./three-fiber/Environment');
  return {
    ...originalModule,
    Environment: 'Environment',
  };
});
jest.mock('./three-fiber/StatsWindow', () => {
  return {
    StatsWindow: 'StatsWindow',
  };
});
jest.mock('./three-fiber/EditorCamera', () => {
  return {
    EditorMainCamera: 'EditorMainCamera',
  };
});
jest.mock('./three-fiber/EditorTransformControls', () => {
  return {
    EditorTransformControls: 'EditorTransformControls',
  };
});
jest.mock('./three-fiber/SceneInfoView', () => {
  return {
    SceneInfoView: 'SceneInfoView',
  };
});

// Mock Hooks
jest.mock('@react-three/fiber', () => {
  const originalModule = jest.requireActual('@react-three/fiber');
  return {
    ...originalModule,
    useThree: jest.fn(),
    useLoader: jest.fn(),
  };
});

class ResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
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
    getSceneNodeByRef: jest.fn(),
    getSceneProperty: jest.fn(),
    isEditing: jest.fn(),
    document: sceneDocument,
    getObject3DBySceneNodeRef: jest.fn().mockReturnValue(group),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    const mockUseThree = useThree as Mock;
    mockUseThree.mockReturnValue(mockThreeStates);

    setFeatureConfig({});
  });

  it('should render editing correctly without immersive view feature', () => {
    useStore('default').setState(baseState);
    baseState.isEditing.mockReturnValue(true);
    baseState.getSceneNodeByRef.mockReturnValue('childNode');

    const container = renderer.create(<Layout />);
    expect(container).toMatchSnapshot();
  });

  it('should render viewing correctly without immersive view feature', () => {
    useStore('default').setState(baseState);
    baseState.isEditing.mockReturnValue(false);
    baseState.getSceneNodeByRef.mockReturnValue('childNode');

    const container = renderer.create(<Layout />);
    expect(container).toMatchSnapshot();
  });
});

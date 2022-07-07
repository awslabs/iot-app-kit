/* eslint-disable import/first */
import renderer from 'react-test-renderer';
import React from 'react';
import { useThree } from '@react-three/fiber';
import { BoxGeometry, Mesh, MeshBasicMaterial, Group } from 'three';

import { useStore } from '../../src/store';
import { mockPolaris } from '../__mocks__/MockPolaris';
// eslint-disable-next-line import/order
import { mockR3F } from '../__mocks__/MockR3F';

mockPolaris();
mockR3F();

import { WebGLCanvasManager } from '../../src/components/WebGLCanvasManager';
import { setFeatureConfig } from '../../src/GlobalSettings';
import { COMPOSER_FEATURES } from '../../src';

import Mock = jest.Mock;

// Mock other internal components
jest.mock('../../src/components/three-fiber/EntityGroup', () => 'EntityGroup');
jest.mock('../../src/components/three-fiber/Environment', () => {
  const originalModule = jest.requireActual('../../src/components/three-fiber/Environment');
  return {
    ...originalModule,
    Environment: 'Environment',
  };
});
jest.mock('../../src/components/three-fiber/StatsWindow', () => {
  return {
    StatsWindow: 'StatsWindow',
  };
});
jest.mock('../../src/components/three-fiber/EditorCamera', () => {
  return {
    EditorMainCamera: 'EditorMainCamera',
  };
});
jest.mock('../../src/components/three-fiber/EditorTransformControls', () => {
  return {
    EditorTransformControls: 'EditorTransformControls',
  };
});
jest.mock('../../src/components/three-fiber/ImmersiveViewCamera', () => {
  return {
    ImmersiveViewCamera: 'ImmersiveViewCamera',
  };
});
jest.mock('../../src/components/three-fiber/SceneInfoView', () => {
  return {
    SceneInfoView: 'SceneInfoView',
  };
});
jest.mock('../../src/components/three-fiber/immersive-view/ImmersiveView', () => {
  return {
    ImmersiveView: 'ImmersiveView',
  };
});

// Mock Hooks
jest.mock('@react-three/fiber', () => {
  const originalModule = jest.requireActual('@react-three/fiber');
  return {
    ...originalModule,
    useThree: jest.fn(),
  };
});

describe('WebGLCanvasManagerSnap', () => {
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
  (geometry as any).uuid = 'Geometry';
  const material = new MeshBasicMaterial();
  (material as any).uuid = 'Material';
  const mesh = new Mesh(geometry, material);
  group.name = 'Test';
  (group as any).uuid = 'Forced';
  (mesh as any).uuid = 'Forced2';
  group.add(mesh);

  const baseState: any = {
    getSceneNodeByRef: jest.fn(),
    getSceneProperty: jest.fn(),
    isEditing: jest.fn(),
    document: sceneDocument,
    highlightedSceneNodeRef: 'childNode',
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

    const container = renderer.create(<WebGLCanvasManager />);
    expect(container).toMatchSnapshot();
  });

  it('should render viewing correctly without immersive view feature', () => {
    useStore('default').setState(baseState);
    baseState.isEditing.mockReturnValue(false);
    baseState.getSceneNodeByRef.mockReturnValue('childNode');

    const container = renderer.create(<WebGLCanvasManager />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with immersive view feature', () => {
    useStore('default').setState(baseState);
    setFeatureConfig({ [COMPOSER_FEATURES.IMMERSIVE_VIEW]: true });

    baseState.isEditing.mockReturnValue(true);
    baseState.getSceneNodeByRef.mockReturnValue('childNode');

    const container = renderer.create(<WebGLCanvasManager />);

    expect(container).toMatchSnapshot();
  });

  it('should render correctly in immersive view feature', () => {
    const baseState: any = {
      cameraControlsType: 'immersive',
      getSceneNodeByRef: jest.fn(),
      getSceneProperty: jest.fn(),
      isEditing: jest.fn(),
      document: sceneDocument,
      highlightedSceneNodeRef: 'childNode',
      getObject3DBySceneNodeRef: jest.fn().mockReturnValue(group),
    };

    useStore('default').setState(baseState);
    setFeatureConfig({ [COMPOSER_FEATURES.IMMERSIVE_VIEW]: true });

    baseState.isEditing.mockReturnValue(true);
    baseState.getSceneNodeByRef.mockReturnValue('childNode');

    const container = renderer.create(<WebGLCanvasManager />);

    expect(container).toMatchSnapshot();
  });
});

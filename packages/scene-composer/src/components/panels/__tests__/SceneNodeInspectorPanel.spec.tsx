import React from 'react';
import { render } from '@testing-library/react';

import { SceneNodeInspectorPanel } from '../SceneNodeInspectorPanel';
import { KnownComponentType } from '../../../interfaces';
import { Component, ModelType } from '../../../models/SceneModels';

const getSceneNodeByRef = jest.fn();
const updateSceneNodeInternal = jest.fn();

jest.mock('../../../store/Store', () => {
  const originalModule = jest.requireActual('../../../store/Store');
  return {
    __esModule: true,
    ...originalModule,
    useEditorState: jest.fn().mockReturnValue({ selectedSceneNodeRef: 'testNodeRef' }),
    useSceneDocument: jest.fn(() => ({
      getSceneNodeByRef: getSceneNodeByRef,
      updateSceneNodeInternal: updateSceneNodeInternal,
    })),
  };
});

jest.mock('../../../three/transformUtils', () => {
  const originalModule = jest.requireActual('../../../three/transformUtils');
  return {
    __esModule: true,
    ...originalModule,
    useSnapObjectToFloor: jest.fn(),
  };
});

describe('SceneNodeInspectorPanel returns expected elements.', () => {
  it('SceneNode panel contains expected elements when none selected scene node.', async () => {
    getSceneNodeByRef.mockReset();
    getSceneNodeByRef.mockReturnValue(null);
    const { container } = render(<SceneNodeInspectorPanel />);

    expect(container).toMatchSnapshot();
  });

  it('SceneNode panel contains expected elements when selected scene node.', async () => {
    getSceneNodeByRef.mockReset();
    updateSceneNodeInternal.mockReset();
    getSceneNodeByRef.mockReturnValue({
      components: [
        {
          type: KnownComponentType.ModelRef,
        },
      ],
      transform: {
        position: [1, 1, 1],
        rotation: [0, 0, 0],
        scale: [2, 2, 2],
      },
      transformConstraint: {
        snapToFloor: true,
      },
    });

    const { container } = render(<SceneNodeInspectorPanel />);

    expect(container).toMatchSnapshot();
  });

  it('disable y scale when selected scene node is LinearPlane motion indicator.', async () => {
    getSceneNodeByRef.mockReset();
    updateSceneNodeInternal.mockReset();
    getSceneNodeByRef.mockReturnValue({
      components: [
        {
          type: KnownComponentType.MotionIndicator,
          shape: Component.MotionIndicatorShape.LinearPlane,
        },
      ],
      transform: {
        position: [1, 1, 1],
        rotation: [0, 0, 0],
        scale: [2, 2, 2],
      },
      transformConstraint: {
        snapToFloor: false,
      },
    });

    const { container } = render(<SceneNodeInspectorPanel />);

    expect(container).toMatchSnapshot();
  });

  it('SceneNode panel contains expected elements when selected Environment model.', async () => {
    getSceneNodeByRef.mockReset();
    updateSceneNodeInternal.mockReset();
    getSceneNodeByRef.mockReturnValue({
      components: [
        {
          type: KnownComponentType.ModelRef,
          modelType: ModelType.Environment,
        },
      ],
      transform: {
        position: [1, 1, 1],
        rotation: [0, 0, 0],
        scale: [2, 2, 2],
      },
      transformConstraint: {
        snapToFloor: true,
      },
    });

    const { container } = render(<SceneNodeInspectorPanel />);

    expect(container).toMatchSnapshot();
  });
});

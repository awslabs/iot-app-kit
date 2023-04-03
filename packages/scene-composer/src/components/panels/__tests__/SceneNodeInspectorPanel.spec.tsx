import React from 'react';
import { render } from '@testing-library/react';

import { SceneNodeInspectorPanel } from '../SceneNodeInspectorPanel';
import { COMPOSER_FEATURES, KnownComponentType } from '../../../interfaces';
import { Component, ModelType } from '../../../models/SceneModels';
import { ISceneNodeInternal, useStore } from '../../../store';
import { setFeatureConfig } from '../../../common/GlobalSettings';

const getSceneNodeByRef = jest.fn();
const updateSceneNodeInternal = jest.fn();

jest.mock('../ComponentEditor', () => ({
  ComponentEditor: (...props: unknown[]) => <div data-testid='ComponentEditor'>{JSON.stringify(props)}</div>,
}));

jest.mock('../../../three/transformUtils', () => {
  const originalModule = jest.requireActual('../../../three/transformUtils');
  return {
    __esModule: true,
    ...originalModule,
    useSnapObjectToFloor: jest.fn(),
  };
});

describe('SceneNodeInspectorPanel returns expected elements.', () => {
  const baseNode: ISceneNodeInternal = {
    ref: 'node-ref',
    properties: {},
    childRefs: [],
    name: 'node-name',
    transform: {
      position: [1, 1, 1],
      rotation: [0, 0, 0],
      scale: [2, 2, 2],
    },
    transformConstraint: {
      snapToFloor: false,
    },
    components: [],
  };

  beforeEach(() => {
    useStore('default').setState({
      selectedSceneNodeRef: 'testNodeRef',
      getSceneNodeByRef: getSceneNodeByRef,
      updateSceneNodeInternal: updateSceneNodeInternal,
    });
    jest.clearAllMocks();
    setFeatureConfig({});
  });

  it('SceneNode panel contains expected elements when none selected scene node.', async () => {
    getSceneNodeByRef.mockReturnValue(null);
    const { container } = render(<SceneNodeInspectorPanel />);

    expect(container).toMatchSnapshot();
  });

  it('SceneNode panel contains expected elements when selected scene node.', async () => {
    getSceneNodeByRef.mockReturnValue({
      ...baseNode,
      components: [
        {
          type: KnownComponentType.ModelRef,
        },
      ],
      transformConstraint: {
        snapToFloor: true,
      },
    });

    const { container } = render(<SceneNodeInspectorPanel />);

    expect(container).toMatchSnapshot();
  });

  it('disable y scale when selected scene node is LinearPlane motion indicator.', async () => {
    getSceneNodeByRef.mockReturnValue({
      ...baseNode,
      components: [
        {
          type: KnownComponentType.MotionIndicator,
          shape: Component.MotionIndicatorShape.LinearPlane,
        },
      ],
    });

    const { container } = render(<SceneNodeInspectorPanel />);

    expect(container).toMatchSnapshot();
  });

  it('SceneNode panel contains expected elements when selected Environment model.', async () => {
    getSceneNodeByRef.mockReturnValue({
      ...baseNode,
      components: [
        {
          type: KnownComponentType.ModelRef,
          modelType: ModelType.Environment,
        },
      ],
      transformConstraint: {
        snapToFloor: true,
      },
    });

    const { container } = render(<SceneNodeInspectorPanel />);

    expect(container).toMatchSnapshot();
  });

  it('disable rotation, hide scale and render correct overlay section when selected scene node is Tag.', async () => {
    setFeatureConfig({ [COMPOSER_FEATURES.Overlay]: true });
    getSceneNodeByRef.mockReturnValue({
      ...baseNode,
      components: [
        {
          type: KnownComponentType.Tag,
        },
      ],
    });

    const { container } = render(<SceneNodeInspectorPanel />);

    expect(container.querySelector('[controlid="Rotation_input_X"')).not.toBeNull();
    expect(container.querySelector('[controlid="Rotation_input_X"')?.getAttribute('disabled')).not.toBeNull();
    expect(container.querySelector('[controlid="Rotation_input_Y"')).not.toBeNull();
    expect(container.querySelector('[controlid="Rotation_input_Y"')?.getAttribute('disabled')).not.toBeNull();
    expect(container.querySelector('[controlid="Rotation_input_Z"')).not.toBeNull();
    expect(container.querySelector('[controlid="Rotation_input_Z"')?.getAttribute('disabled')).not.toBeNull();
    expect(container.querySelector('[controlid="Scale_input_X"')).toBeNull();
    expect(container.querySelector('[controlid="Scale_input_Y"')).toBeNull();
    expect(container.querySelector('[controlid="Scale_input_Z"')).toBeNull();
    expect(container).toMatchSnapshot();
  });

  it('disable scale and rotation when selected scene node is Annotation.', async () => {
    setFeatureConfig({ [COMPOSER_FEATURES.Overlay]: true });
    getSceneNodeByRef.mockReturnValue({
      ...baseNode,
      components: [
        {
          type: KnownComponentType.DataOverlay,
          subType: Component.DataOverlaySubType.TextAnnotation,
        },
      ],
    });

    const { container } = render(<SceneNodeInspectorPanel />);

    expect(container.querySelector('[controlid="Rotation_input_X"')).not.toBeNull();
    expect(container.querySelector('[controlid="Rotation_input_X"')?.getAttribute('disabled')).not.toBeNull();
    expect(container.querySelector('[controlid="Rotation_input_Y"')).not.toBeNull();
    expect(container.querySelector('[controlid="Rotation_input_Y"')?.getAttribute('disabled')).not.toBeNull();
    expect(container.querySelector('[controlid="Rotation_input_Z"')).not.toBeNull();
    expect(container.querySelector('[controlid="Rotation_input_Z"')?.getAttribute('disabled')).not.toBeNull();
    expect(container.querySelector('[controlid="Scale_input_X"')).not.toBeNull();
    expect(container.querySelector('[controlid="Scale_input_X"')?.getAttribute('disabled')).not.toBeNull();
    expect(container.querySelector('[controlid="Scale_input_Y"')).not.toBeNull();
    expect(container.querySelector('[controlid="Scale_input_Y"')?.getAttribute('disabled')).not.toBeNull();
    expect(container.querySelector('[controlid="Scale_input_Z"')).not.toBeNull();
    expect(container.querySelector('[controlid="Scale_input_Z"')?.getAttribute('disabled')).not.toBeNull();
    expect(container).toMatchSnapshot();
  });

  it('disable rotation, hide scale and render correct overlay section when selected scene node is Tag with Overlay panel.', async () => {
    setFeatureConfig({ [COMPOSER_FEATURES.Overlay]: true });
    getSceneNodeByRef.mockReturnValue({
      ...baseNode,
      components: [
        {
          type: KnownComponentType.Tag,
        },
        {
          type: KnownComponentType.DataOverlay,
          subType: Component.DataOverlaySubType.OverlayPanel,
        },
      ],
    });

    const { container } = render(<SceneNodeInspectorPanel />);

    expect(container.querySelector('[controlid="Rotation_input_X"')).not.toBeNull();
    expect(container.querySelector('[controlid="Rotation_input_X"')?.getAttribute('disabled')).not.toBeNull();
    expect(container.querySelector('[controlid="Rotation_input_Y"')).not.toBeNull();
    expect(container.querySelector('[controlid="Rotation_input_Y"')?.getAttribute('disabled')).not.toBeNull();
    expect(container.querySelector('[controlid="Rotation_input_Z"')).not.toBeNull();
    expect(container.querySelector('[controlid="Rotation_input_Z"')?.getAttribute('disabled')).not.toBeNull();
    expect(container.querySelector('[controlid="Scale_input_X"')).toBeNull();
    expect(container.querySelector('[controlid="Scale_input_Y"')).toBeNull();
    expect(container.querySelector('[controlid="Scale_input_Z"')).toBeNull();
    expect(container).toMatchSnapshot();
  });
});

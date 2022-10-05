import React from 'react';
import { render } from '@testing-library/react';

import ModelRefComponent from '../index';
import { IModelRefComponentInternal, ISceneNodeInternal } from '../../../../store';
import { KnownComponentType } from '../../../../interfaces';
import { ModelType } from '../../../../models/SceneModels';

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

jest.mock('../GLTFModelComponent', () => ({
  GLTFModelComponent: (props) => <div id={'GLTFModelComponent'} {...props} />,
  ErrorModelComponent: (props) => <div id={'ErrorModelComponent'} {...props} />,
}));

jest.mock('../TilesModelComponent', () => ({
  TilesModelComponent: (props) => <div id={'TilesModelComponent'} {...props} />,
}));

jest.mock('../EnvironmentModelComponent', () => ({
  EnvironmentModelComponent: (props) => <div id={'EnvironmentModelComponent'} {...props} />,
}));

describe('ModelRefComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const component: IModelRefComponentInternal = {
      uri: 'uri',
      modelType: ModelType.GLB,
      ref: 'test-ref',
      type: KnownComponentType.ModelRef,
    };

    const node: ISceneNodeInternal = {
      ref: 'test-ref',
      name: 'test-name',
      transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [0, 0, 0] },
      transformConstraint: {},
      components: [component],
      childRefs: [],
      properties: {},
    };

    const { container } = render(<ModelRefComponent node={node} component={component} />);

    expect(container).toMatchSnapshot();
  });

  it('should render correctly with Environment Model Type', () => {
    const component: IModelRefComponentInternal = {
      uri: 'uri',
      modelType: ModelType.Environment,
      ref: 'test-ref',
      type: 'ModelRef',
    };

    const node: ISceneNodeInternal = {
      ref: 'test-ref',
      name: 'test-name',
      transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [0, 0, 0] },
      transformConstraint: {},
      components: [component],
      childRefs: [],
      properties: {},
    };

    const { container } = render(<ModelRefComponent node={node} component={component} />);

    expect(container).toMatchSnapshot();
  });

  it('should render correctly with Tiles Model Type', () => {
    const component: IModelRefComponentInternal = {
      uri: 'uri',
      modelType: ModelType.Tiles3D,
      ref: 'test-ref',
      type: 'ModelRef',
    };

    const node: ISceneNodeInternal = {
      ref: 'test-ref',
      name: 'test-name',
      transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [0, 0, 0] },
      transformConstraint: {},
      components: [component],
      childRefs: [],
      properties: {},
    };

    const { container } = render(<ModelRefComponent node={node} component={component} />);

    expect(container).toMatchSnapshot();
  });
});

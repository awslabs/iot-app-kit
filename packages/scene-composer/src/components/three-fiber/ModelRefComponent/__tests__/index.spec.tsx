import renderer, { act } from 'react-test-renderer';
import React from 'react';

import ModelRefComponent from '../index';
import { IModelRefComponentInternal, ISceneComponentInternal, ISceneNodeInternal } from '../../../../store';
import { DefaultAnchorStatus, ITransformConstraint } from '../../../../interfaces';
import { ITransformInternal } from '../../../../store/internalInterfaces';

jest.mock('../../../../../src/augmentations/components/three-fiber/common/SvgIconToWidgetSprite', () =>
  jest.fn(((data, name, alwaysVisible, props) => <div data-test-id={name} {...props} />) as any),
);

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

describe('ModelRefComponent', () => {
  const onWidgetClick = jest.fn();
  const setHighlightedSceneNodeRef = jest.fn();
  const setSelectedSceneNodeRef = jest.fn();

  const component: IModelRefComponentInternal = {
    uri: 'uri',
    modelType: 'modelType',
    ref: 'test-ref',
    type: 'Camera',
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const container = renderer.create(<ModelRefComponent node={node} component={DefaultAnchorStatus.Info} />);

    expect(container).toMatchSnapshot();
  });
});

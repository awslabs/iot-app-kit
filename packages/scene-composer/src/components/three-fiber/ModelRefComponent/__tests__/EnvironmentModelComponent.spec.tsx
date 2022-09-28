import React from 'react';
import { render } from '@testing-library/react';

import { EnvironmentModelComponent } from '../EnvironmentModelComponent';
import { IModelRefComponentInternal, ISceneNodeInternal, useStore } from '../../../../store';
import { ModelType } from '../../../../models/SceneModels';
import { KnownComponentType } from '../../../../interfaces';

// @ts-ignore
jest.mock('scheduler', () => require('scheduler/unstable_mock'));

jest.mock('../GLTFModelComponent', () => ({
  GLTFModelComponent: (props) => <div id={'GLTFModelComponent'} {...props} />,
}));

/* eslint-enable */

describe('EnvironmentModelComponent', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render as expected when editing', () => {
    useStore('default').setState({
      isEditing: jest.fn().mockReturnValue(true),
    });
    const { container } = render(<EnvironmentModelComponent component={component} node={node} />);

    expect(container).toMatchSnapshot();
  });

  it('should render as empty when viewing', () => {
    useStore('default').setState({
      isEditing: jest.fn().mockReturnValue(false),
    });
    const { container } = render(<EnvironmentModelComponent component={component} node={node} />);

    expect(container).toMatchSnapshot();
  });
});

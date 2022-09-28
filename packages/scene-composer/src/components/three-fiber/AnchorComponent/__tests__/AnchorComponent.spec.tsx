import React from 'react';
import renderer from 'react-test-renderer';

import AnchorComponent from '..';
import { IAnchorComponentInternal, ISceneNodeInternal } from '../../../../store';
import { DefaultAnchorStatus } from '../../../..';

jest.mock('../../../../augmentations/components/three-fiber/anchor/AnchorWidget', () => ({
  AnchorWidget: 'AnchorWidget',
}));

jest.mock('../../../../store', () => {
  const originalModule = jest.requireActual('../../../../store');
  return {
    ...originalModule,
    useStore: jest.fn(() => () => ({ rule: { expression: 'test' } })),
  };
});

describe('AnchorComponent', () => {
  const node = { ref: 'testRef' } as unknown as ISceneNodeInternal;
  const component = {
    ruleBasedMapId: 'testId',
    navLink: 'https://test.url',
    valueDataBinding: { test: 'test' },
  } as unknown as IAnchorComponentInternal;

  it('should render correctly with default icon', () => {
    const container = renderer.create(<AnchorComponent node={node} component={component} />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with set icon', () => {
    const component = {
      icon: DefaultAnchorStatus.Error,
      ruleBasedMapId: 'testId',
      navLink: 'https://test.url',
      valueDataBinding: { test: 'test' },
    } as unknown as IAnchorComponentInternal;
    const container = renderer.create(<AnchorComponent node={node} component={component} />);
    expect(container).toMatchSnapshot();
  });
});

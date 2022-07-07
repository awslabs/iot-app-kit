import React from 'react';
import renderer from 'react-test-renderer';

import { mockR3F } from '../../__mocks__/MockR3F';
import { AnchorComponent } from '../../../src/components/three-fiber/AnchorComponent';
import { IAnchorComponentInternal, ISceneNodeInternal } from '../../../src/store';
import { DefaultAnchorStatus } from '../../../src';

mockR3F();

jest.mock('../../../src/augmentations/components/three-fiber/anchor/AnchorWidget', () => ({
  AnchorWidget: 'AnchorWidget',
}));

jest.mock('../../../src/store', () => {
  const originalModule = jest.requireActual('../../../src/store');
  return {
    ...originalModule,
    useStore: jest.fn(() => () => ({ rule: { expression: 'test' } })),
  };
});

describe('AnchorComponentSnap', () => {
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

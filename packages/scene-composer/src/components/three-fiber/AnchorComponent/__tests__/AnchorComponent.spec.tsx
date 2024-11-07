import { create } from 'react-test-renderer';

import AnchorComponent from '..';
import { DefaultAnchorStatus } from '../../../..';
import { type IAnchorComponentInternal, type ISceneNodeInternal } from '../../../../store';

jest.mock('../../../../augmentations/components/three-fiber/anchor/AnchorWidget', () => ({
  AnchorWidget: 'AnchorWidget',
}));

jest.mock('../../../../store', () => {
  const originalModule = jest.requireActual('../../../../store');
  return {
    ...originalModule,
    accessStore: jest.fn(() => () => ({ rule: { expression: 'test' } })),
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
    const container = create(<AnchorComponent node={node} component={component} />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with set icon', () => {
    const component = {
      icon: DefaultAnchorStatus.Error,
      ruleBasedMapId: 'testId',
      navLink: 'https://test.url',
      valueDataBinding: { test: 'test' },
    } as unknown as IAnchorComponentInternal;
    const container = create(<AnchorComponent node={node} component={component} />);
    expect(container).toMatchSnapshot();
  });
});

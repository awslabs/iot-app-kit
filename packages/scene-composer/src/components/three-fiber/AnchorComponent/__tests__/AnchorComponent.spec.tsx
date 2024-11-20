import { create } from 'react-test-renderer';

import AnchorComponent from '..';
import { DefaultAnchorStatus } from '../../../..';
import { type IAnchorComponentInternal, type ISceneNodeInternal } from '../../../../store';

vi.mock('../../../../augmentations/components/three-fiber/anchor/AnchorWidget', () => ({
  AnchorWidget: 'AnchorWidget',
}));

vi.mock('../../../../store', async () => {
  const originalModule = await vi.importActual('../../../../store');
  return {
    ...originalModule,
    accessStore: vi.fn(() => () => ({ rule: { expression: 'test' } })),
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

import { render } from '@/tests/testing-library';

import { mockNode, mockProvider } from '../../../../tests/components/panels/scene-components/MockComponents';
import { type IAnimationComponentInternal, accessStore } from '../../../store';
import { generateUUID } from '../../../utils/mathUtils';

import { AnimationComponentEditor } from './AnimationComponentEditor';

const updateComponentInternalFn = vi.fn();

const mockEditorConfig = {
  valueDataBindingProvider: mockProvider,
};

const baseState = {
  updateComponentInternal: updateComponentInternalFn,
  getEditorConfig: vi.fn(() => {
    return mockEditorConfig;
  }),
};

vi.mock('../../../../src/store/Store', async () => {
  const originalModule = await vi.importActual('../../../../src/store/Store');
  return {
    __esModule: true,
    ...originalModule,
    useSceneDocument: vi.fn(() => ({})),
  };
});

describe('AnimationComponentEditor', () => {
  const mockComponent: IAnimationComponentInternal = {
    ref: generateUUID(),
    currentAnimations: [''],
  } as IAnimationComponentInternal;

  it('should render as expected', () => {
    accessStore('default').setState(baseState);
    const { container } = render(<AnimationComponentEditor node={mockNode} component={mockComponent} />);
    expect(container).toMatchSnapshot();
  });
});

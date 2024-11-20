import { fireEvent, render, screen } from '@/tests/testing-library';

import { mockNode, mockProvider } from '../../../../tests/components/panels/scene-components/MockComponents';
import { type IAnimationComponentInternal, accessStore } from '../../../store';
import { generateUUID } from '../../../utils/mathUtils';

import { AnimationViewStateEditor } from './AnimationViewStateEditor';

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

describe('AnimationViewStateEditor', () => {
  const mockComponentExtraPanel: IAnimationComponentInternal = {
    ref: generateUUID(),
    type: 'animation',
    selector: 3,
    currentAnimations: ['Action.018', 'Action.013'],
  } as IAnimationComponentInternal;

  it('should update the correct animations and render the correct component', () => {
    const mockComponent: IAnimationComponentInternal = {
      ref: generateUUID(),
      type: 'animation',
      selector: 2,
      currentAnimations: ['Action.018', 'Action.013'],
    } as IAnimationComponentInternal;

    const onUpdate = vi.fn();
    const { container } = render(
      <AnimationViewStateEditor node={mockNode} component={mockComponent} onUpdate={onUpdate} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should fire the remove button and render the correct component', () => {
    accessStore('default').setState(baseState);
    const onUpdate = vi.fn();
    const { getByTestId } = render(
      <AnimationViewStateEditor node={mockNode} component={mockComponentExtraPanel} onUpdate={onUpdate} />,
    );
    fireEvent.click(screen.getByTestId('removeButton0'));
    expect(getByTestId).toMatchSnapshot();
  });
});

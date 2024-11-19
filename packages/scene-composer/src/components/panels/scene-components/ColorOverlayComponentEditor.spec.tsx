/* eslint-disable import/first */
import wrapper from '@cloudscape-design/components/test-utils/dom';
import { render } from '@/tests/testing-library';

import {
  mockBinding,
  mockBuilderState,
  mockComponent,
  mockNode,
  mockProvider,
} from '../../../../tests/components/panels/scene-components/MockComponents';
import { type IColorOverlayComponentInternal, accessStore } from '../../../store';
import { isDynamicScene } from '../../../utils/entityModelUtils/sceneUtils';

import { ColorOverlayComponentEditor } from './ColorOverlayComponentEditor';

/* TODO: This component needs to be refactored, and rely on mocks, but it's too deeply coupled to use mocks atm, so this fixes the tests */
vi.mock('@cloudscape-design/components', async () => ({
  ...(await vi.importActual('@cloudscape-design/components')),
}));

vi.mock('../../../utils/entityModelUtils/sceneUtils');

const updateComponentInternalFn = vi.fn();
const removeComponentFn = vi.fn();
const setDeleteConfirmationModalVisible = vi.fn();

const mockEditorConfig = {
  valueDataBindingProvider: mockProvider,
};

const baseState = {
  updateComponentInternal: updateComponentInternalFn,
  getEditorConfig: vi.fn(() => {
    return mockEditorConfig;
  }),
  listSceneRuleMapIds: vi.fn(() => {
    return ['rule1'];
  }),
  removeComponent: removeComponentFn,
  setDeleteConfirmationModalVisible,
};

describe('ColorOverlayComponentEditor', () => {
  // has rule already selected
  const colorComponent: IColorOverlayComponentInternal = {
    ...mockComponent,
    valueDataBinding: mockBinding,
    ruleBasedMapId: 'rule1',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (isDynamicScene as vi.Mock).mockReturnValue(false);
  });

  it('should select bindings', () => {
    accessStore('default').setState(baseState);

    const { container } = render(<ColorOverlayComponentEditor node={mockNode} component={colorComponent} />);

    const polarisWrapper = wrapper(container);
    const autoSuggest = polarisWrapper.findAutosuggest();

    autoSuggest!.focus();
    autoSuggest!.selectSuggestion(2);
    expect(mockProvider.createStore(false).updateSelection).toBeCalledWith(mockBuilderState.definitions[0].fieldName, {
      value: mockBuilderState.definitions[0].options[1].value,
    });
  });

  it('should select rule ids', () => {
    accessStore('default').setState(baseState);

    const { container } = render(<ColorOverlayComponentEditor node={mockNode} component={colorComponent} />);

    const polarisWrapper = wrapper(container);
    const select = polarisWrapper.find('[data-testid="rule-id-form-field"]')?.findSelect();

    select!.openDropdown();
    select!.selectOption(1);
    expect(updateComponentInternalFn).toBeCalledWith(
      mockNode.ref,
      {
        ref: mockNode.components[0].ref,
        ruleBasedMapId: 'rule1',
      },
      undefined,
    );

    select!.openDropdown();
    select!.selectOption(2);
    expect(updateComponentInternalFn).toBeCalledWith(
      mockNode.ref,
      {
        ref: mockNode.components[0].ref,
        ruleBasedMapId: undefined,
      },
      undefined,
    );
  });

  it('should remove components', () => {
    accessStore('default').setState(baseState);

    const { container } = render(<ColorOverlayComponentEditor node={mockNode} component={colorComponent} />);

    const polarisWrapper = wrapper(container);
    const button = polarisWrapper.findButton('[data-testid="color-overlay-remove-component-button"]');
    button!.click();

    expect(removeComponentFn).toBeCalledWith(mockNode.ref, mockNode.components[0].ref);
  });

  it('should remove components for dynamic scene', () => {
    (isDynamicScene as vi.Mock).mockReturnValue(true);
    accessStore('default').setState(baseState);

    const { container } = render(<ColorOverlayComponentEditor node={mockNode} component={colorComponent} />);

    const polarisWrapper = wrapper(container);
    const button = polarisWrapper.findButton('[data-testid="color-overlay-remove-component-button"]');
    button!.click();

    expect(removeComponentFn).not.toBeCalled();
    expect(setDeleteConfirmationModalVisible).toBeCalledTimes(1);
    expect(setDeleteConfirmationModalVisible).toBeCalledWith(true, {
      type: 'deleteComponent',
      nodeRef: mockNode.ref,
      componentRef: colorComponent.ref,
    });
  });

  it('should build with no rule selected', () => {
    accessStore('default').setState(baseState);

    const colorComponentNoRule: IColorOverlayComponentInternal = {
      ...mockComponent,
      valueDataBinding: mockBinding,
    };

    const { container } = render(<ColorOverlayComponentEditor node={mockNode} component={colorComponentNoRule} />);

    const polarisWrapper = wrapper(container);
    const select = polarisWrapper.find('[data-testid="rule-id-form-field"]')?.findSelect();

    select!.openDropdown();
    select!.selectOption(1);
    expect(updateComponentInternalFn).toBeCalledWith(
      mockNode.ref,
      {
        ref: mockNode.components[0].ref,
        ruleBasedMapId: 'rule1',
      },
      undefined,
    );
  });
});

/* eslint-disable import/first */
import { render } from '@testing-library/react';
import wrapper from '@cloudscape-design/components/test-utils/dom';

import { type IColorOverlayComponentInternal, accessStore } from '../../../store';
import {
  mockBinding,
  mockBuilderState,
  mockNode,
  mockComponent,
  mockProvider,
} from '../../../../tests/components/panels/scene-components/MockComponents';
import { isDynamicScene } from '../../../utils/entityModelUtils/sceneUtils';

import { ColorOverlayComponentEditor } from './ColorOverlayComponentEditor';

/* TODO: This component needs to be refactored, and rely on mocks, but it's too deeply coupled to use mocks atm, so this fixes the tests */
jest.mock('@cloudscape-design/components', () => ({
  ...jest.requireActual('@cloudscape-design/components'),
}));

jest.mock('../../../utils/entityModelUtils/sceneUtils');

const updateComponentInternalFn = jest.fn();
const removeComponentFn = jest.fn();
const setDeleteConfirmationModalVisible = jest.fn();

const mockEditorConfig = {
  valueDataBindingProvider: mockProvider,
};

const baseState = {
  updateComponentInternal: updateComponentInternalFn,
  getEditorConfig: jest.fn(() => {
    return mockEditorConfig;
  }),
  listSceneRuleMapIds: jest.fn(() => {
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
    jest.clearAllMocks();
    (isDynamicScene as jest.Mock).mockReturnValue(false);
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
    (isDynamicScene as jest.Mock).mockReturnValue(true);
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

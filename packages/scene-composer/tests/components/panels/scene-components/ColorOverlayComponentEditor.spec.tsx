/* eslint-disable import/first */
import React from 'react';
import { render } from '@testing-library/react';
import wrapper from '@awsui/components-react/test-utils/dom';

import { ColorOverlayComponentEditor } from '../../../../src/components/panels/scene-components/ColorOverlayComponentEditor';
import { IColorOverlayComponentInternal, useStore } from '../../../../src/store';

import {
  mockDataBindingConfig,
  mockBinding,
  mockBuilderState,
  mockNode,
  mockComponent,
  mockProvider,
} from './MockComponents';

/* TODO: This component needs to be refactored, and rely on mocks, but it's too deeply coupled to use mocks atm, so this fixes the tests */
jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
}));

const updateComponentInternalFn = jest.fn();
const removeComponentFn = jest.fn();

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
  });

  it('should select bindings', () => {
    useStore('default').setState(baseState);

    const { container } = render(<ColorOverlayComponentEditor node={mockNode} component={colorComponent} />);

    const polarisWrapper = wrapper(container);
    const autoSuggest = polarisWrapper.findAutosuggest();

    autoSuggest!.focus();
    autoSuggest!.selectSuggestion(2);
    expect(mockProvider.useStore('').updateSelection).toBeCalledWith(
      mockBuilderState.definitions[0].fieldName,
      { value: mockBuilderState.definitions[0].options[1].value },
      mockDataBindingConfig,
    );
  });

  it('should select rule ids', () => {
    useStore('default').setState(baseState);

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
    useStore('default').setState(baseState);

    const { container } = render(<ColorOverlayComponentEditor node={mockNode} component={colorComponent} />);

    const polarisWrapper = wrapper(container);
    const button = polarisWrapper.findButton();
    button!.click();
    expect(removeComponentFn).toBeCalledWith(mockNode.ref, mockNode.components[0].ref);
  });

  it('should build with no rule selected', () => {
    useStore('default').setState(baseState);

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

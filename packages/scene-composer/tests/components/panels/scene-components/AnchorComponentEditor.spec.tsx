/* eslint-disable import/first */
import React from 'react';
import { render } from '@testing-library/react';
import wrapper from '@awsui/components-react/test-utils/dom';

import {
  AnchorComponentEditor,
  convertParamsToKeyValuePairs,
} from '../../../../src/components/panels/scene-components/AnchorComponentEditor';
import { IAnchorComponentInternal, useStore } from '../../../../src/store';

import {
  mockDataBindingConfig,
  mockBuilderState,
  mockBinding,
  mockNode,
  mockComponent,
  mockProvider,
} from './MockComponents';

/* TODO: This component needs to be refactored, and rely on mocks, but it's too deeply coupled to use mocks atm, so this fixes the tests */
jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
}));

const updateComponentInternalFn = jest.fn();

const mockEditorConfig = {
  valueDataBindingProvider: mockProvider,
};

const baseState = {
  updateComponentInternal: updateComponentInternalFn,
  getEditorConfig: jest.fn(() => {
    return mockEditorConfig;
  }),
};

jest.mock('../../../../src/store/Store', () => {
  const originalModule = jest.requireActual('../../../../src/store/Store');
  return {
    __esModule: true,
    ...originalModule,
    useSceneDocument: jest.fn(() => ({
      listSceneRuleMapIds: jest.fn(() => {
        return ['rule1'];
      }),
    })),
  };
});

describe('AnchorComponentEditor', () => {
  // has rule already selected
  const anchorComponent: IAnchorComponentInternal = {
    ...mockComponent,
    valueDataBinding: mockBinding,
    ruleBasedMapId: 'rule1',
    icon: 'icon1',
    navLink: {
      destination: 'dest1',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should select icon types', () => {
    useStore('default').setState(baseState);

    const { container } = render(<AnchorComponentEditor node={mockNode} component={anchorComponent} />);

    const polarisWrapper = wrapper(container);
    const select = polarisWrapper.findSelect('[data-testid="anchor-default-icon-select"]');

    select!.openDropdown();
    select!.selectOption(1);
    expect(updateComponentInternalFn).toBeCalledWith(
      mockNode.ref,
      {
        ref: mockNode.components[0].ref,
        icon: 'iottwinmaker.common.icon:Info',
      },
      undefined,
    );

    select!.openDropdown();
    select!.selectOption(2);
    expect(updateComponentInternalFn).toBeCalledWith(
      mockNode.ref,
      {
        ref: mockNode.components[0].ref,
        icon: 'iottwinmaker.common.icon:Warning',
      },
      undefined,
    );

    select!.openDropdown();
    select!.selectOption(3);
    expect(updateComponentInternalFn).toBeCalledWith(
      mockNode.ref,
      {
        ref: mockNode.components[0].ref,
        icon: 'iottwinmaker.common.icon:Error',
      },
      undefined,
    );

    select!.openDropdown();
    select!.selectOption(4);
    expect(updateComponentInternalFn).toBeCalledWith(
      mockNode.ref,
      {
        ref: mockNode.components[0].ref,
        icon: 'iottwinmaker.common.icon:Video',
      },
      undefined,
    );
  });

  it('should select binding', () => {
    useStore('default').setState(baseState);

    const { container } = render(<AnchorComponentEditor node={mockNode} component={anchorComponent} />);

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

  it('should select rule id', () => {
    useStore('default').setState(baseState);

    const { container } = render(<AnchorComponentEditor node={mockNode} component={anchorComponent} />);

    const polarisWrapper = wrapper(container);
    const select = polarisWrapper.findSelect('[data-testid="anchor-rule-id-select"]');

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

  it('should select link target', () => {
    useStore('default').setState(baseState);

    const { container } = render(<AnchorComponentEditor node={mockNode} component={anchorComponent} />);

    const polarisWrapper = wrapper(container);
    const input = polarisWrapper.findInput('[data-testid="anchor-link-target-input"]');
    input?.setInputValue('link2');

    expect(updateComponentInternalFn).toBeCalledWith(
      mockNode.ref,
      {
        ref: mockNode.components[0].ref,
        navLink: { destination: 'link2' },
      },
      undefined,
    );
  });

  it('should add remove parameter key value pairs', () => {
    useStore('default').setState(baseState);

    const { container } = render(<AnchorComponentEditor node={mockNode} component={anchorComponent} />);

    const polarisWrapper = wrapper(container);
    const editor = polarisWrapper.findAttributeEditor('[data-testid="anchor-attribute-editor-select"]');

    let rows = editor!.findRows();
    expect(rows.length).toBe(0);

    const addButton = editor!.findAddButton();
    addButton.click();
    rows = editor!.findRows();
    expect(rows.length).toBe(1);

    const key = rows[0].findField(1)!.findControl()!.findInput();
    key!.setInputValue('key1');

    const value = rows[0].findField(2)?.findControl()?.findInput();
    value?.setInputValue('value1');

    const remove = rows[0].findRemoveButton();
    remove!.click();
    rows = editor!.findRows();
    expect(rows.length).toBe(0);
  });

  it('should convert params to key value pairs', () => {
    const result = convertParamsToKeyValuePairs({ key1: 'value1', key2: 'value2' });
    expect(result).toStrictEqual([
      { key: 'key1', value: 'value1' },
      { key: 'key2', value: 'value2' },
    ]);
  });

  it('should build with no rule and icon selected', () => {
    useStore('default').setState(baseState);

    const componentSparse: IAnchorComponentInternal = {
      ...mockComponent,
      valueDataBinding: mockBinding,
      navLink: {
        destination: 'dest1',
      },
    };

    const { container } = render(<AnchorComponentEditor node={mockNode} component={componentSparse} />);

    const polarisWrapper = wrapper(container);
    const select = polarisWrapper.findSelect('[data-testid="anchor-rule-id-select"]');

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

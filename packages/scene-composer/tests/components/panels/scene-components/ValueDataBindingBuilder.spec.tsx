/* eslint-disable import/first */
import React from 'react';
import { render } from '@testing-library/react';
import wrapper from '@awsui/components-react/test-utils/dom';

import { ValueDataBindingBuilder } from '../../../../src/components/panels/scene-components/ValueDataBindingBuilder';

import { mockDataBindingConfig, mockBinding, mockBuilderState, mockProvider } from './MockComponents';

/* TODO: This component needs to be refactored, and rely on mocks, but it's too deeply coupled to use mocks atm, so this fixes the tests */
jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
}));

describe('ValueDataBindingBuilder', () => {
  const componentRef = 'testRef';
  const onChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should change the selection from option 1 to 2', () => {
    const { container } = render(
      <ValueDataBindingBuilder
        componentRef={componentRef}
        binding={mockBinding}
        valueDataBindingProvider={mockProvider}
        onChange={onChange}
      />,
    );
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

  it('should allow entering value', () => {
    const { container } = render(
      <ValueDataBindingBuilder
        componentRef={componentRef}
        binding={mockBinding}
        valueDataBindingProvider={mockProvider}
        onChange={onChange}
      />,
    );
    const polarisWrapper = wrapper(container);
    const autoSuggest = polarisWrapper.findAutosuggest();

    autoSuggest!.focus();
    autoSuggest!.setInputValue('test');

    expect(mockProvider.useStore('').updateSelection).toBeCalledWith(
      mockBuilderState.definitions[0].fieldName,
      { value: 'test' },
      mockDataBindingConfig,
    );
  });

  it('should select components', () => {
    const { container } = render(
      <ValueDataBindingBuilder
        componentRef={componentRef}
        binding={mockBinding}
        valueDataBindingProvider={mockProvider}
        onChange={onChange}
      />,
    );
    const polarisWrapper = wrapper(container);

    const select = polarisWrapper.findSelect();
    select!.openDropdown();
    select!.selectOption(2);

    expect(mockProvider.useStore('').updateSelection).toBeCalledWith(
      mockBuilderState.definitions[1].fieldName,
      mockBuilderState.definitions[1].options[1],
      mockDataBindingConfig,
    );

    expect(mockProvider.useStore('').createBinding).toBeCalledTimes(1);
  });
});

/* eslint-disable import/first */
import wrapper from '@cloudscape-design/components/test-utils/dom';
import { act, render, screen } from '@/tests/testing-library';
import flushPromises from 'flush-promises';

import {
  mockBinding,
  mockBuilderState,
  mockProvider,
  mockUpdateSelection,
} from '../../../../../tests/components/panels/scene-components/MockComponents';

import { ValueDataBindingBuilder } from './ValueDataBindingBuilder';

/* TODO: This component needs to be refactored, and rely on mocks, but it's too deeply coupled to use mocks atm, so this fixes the tests */
vi.mock('@cloudscape-design/components', async () => ({
  ...(await vi.importActual('@cloudscape-design/components')),
}));

describe('ValueDataBindingBuilder', () => {
  const componentRef = 'testRef';
  const onChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateSelection.mockResolvedValue(mockBuilderState);
  });

  it('should change the selection from option 1 to 2', async () => {
    mockUpdateSelection.mockResolvedValue({
      ...mockBuilderState,
      selectedOptions: [
        {
          label: 'label2',
          value: 'value2',
        },
      ],
    });

    let container;
    act(() => {
      container = render(
        <ValueDataBindingBuilder
          componentRef={componentRef}
          binding={mockBinding}
          valueDataBindingProvider={mockProvider}
          onChange={onChange}
        />,
      ).container;
    });

    const polarisWrapper = wrapper(container);
    const autoSuggest = polarisWrapper.findAutosuggest();

    autoSuggest!.focus();
    autoSuggest!.selectSuggestion(2);

    await flushPromises();

    expect(mockProvider.createStore(false).updateSelection).toBeCalledWith(mockBuilderState.definitions[0].fieldName, {
      value: mockBuilderState.definitions[0].options[1].value,
    });
    expect(mockProvider.createStore(false).createBinding).not.toBeCalled();
  });

  it('should change the selection from option 1 to 2 and save partial binding', async () => {
    mockUpdateSelection.mockResolvedValue({
      ...mockBuilderState,
      selectedOptions: [
        {
          label: 'label2',
          value: 'value2',
        },
      ],
    });
    const { container } = render(
      <ValueDataBindingBuilder
        allowPartialBinding
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

    await flushPromises();

    expect(mockProvider.createStore(false).updateSelection).toBeCalledWith(mockBuilderState.definitions[0].fieldName, {
      value: mockBuilderState.definitions[0].options[1].value,
    });
    expect(mockProvider.createStore(false).createBinding).toBeCalledTimes(1);
  });

  it('should allow entering value', async () => {
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

    await flushPromises();
  });

  it('should select components', async () => {
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

    await flushPromises();

    expect(mockProvider.createStore(false).updateSelection).toBeCalledWith(
      mockBuilderState.definitions[1].fieldName,
      mockBuilderState.definitions[1].options[1],
    );

    expect(mockProvider.createStore(false).createBinding).not.toBeCalled();
  });

  it('should select components and save partial binding', async () => {
    const { container } = render(
      <ValueDataBindingBuilder
        allowPartialBinding
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

    await flushPromises();

    expect(mockProvider.createStore(false).updateSelection).toBeCalledWith(
      mockBuilderState.definitions[1].fieldName,
      mockBuilderState.definitions[1].options[1],
    );

    expect(mockProvider.createStore(false).createBinding).toBeCalledTimes(1);
  });

  it('should render only entity binding', async () => {
    const { container } = render(
      <ValueDataBindingBuilder
        allowPartialBinding
        componentRef={componentRef}
        binding={mockBinding}
        valueDataBindingProvider={mockProvider}
        onChange={onChange}
        numFields={1}
      />,
    );
    const polarisWrapper = wrapper(container);
    expect(polarisWrapper.findAutosuggest()).toBeTruthy();
    expect(screen.getByLabelText('Entity Id')).toBeTruthy();
    const autoSuggest = polarisWrapper.findAutosuggest();
    autoSuggest!.focus();
    autoSuggest!.setInputValue(mockBuilderState.selectedOptions[0]?.value || '');

    await flushPromises();

    expect(mockProvider.createStore(false).updateSelection).toBeCalledWith(mockBuilderState.definitions[0].fieldName, {
      value: mockBuilderState.selectedOptions[0]?.value,
    });
    expect(mockProvider.createStore(false).createBinding).toBeCalledTimes(1);
  });
});

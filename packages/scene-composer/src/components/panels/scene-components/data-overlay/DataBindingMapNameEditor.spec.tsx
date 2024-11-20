import { act, fireEvent, render } from '@/tests/testing-library';

import { DataBindingMapNameEditor } from './DataBindingMapNameEditor';

vi.mock('@cloudscape-design/components', async () => ({
  ...(await vi.importActual('@cloudscape-design/components')),
}));

describe('DataBindingMapNameEditor', () => {
  const valueDataBindings = [
    {
      bindingName: 'binding-1',
      valueDataBinding: {
        dataBindingContext: { entityId: 'random-1' },
      },
    },
  ];
  const onUpdateCallbackMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update binding name', async () => {
    const { getByDisplayValue } = render(
      <DataBindingMapNameEditor
        bindingName='binding-1'
        valueDataBindings={valueDataBindings}
        onBindingNameChange={onUpdateCallbackMock}
      />,
    );

    const nameInput = getByDisplayValue('binding-1');
    expect(nameInput).not.toBeNull();

    act(() => {
      fireEvent.change(nameInput, { target: { value: 'new-name' } });
      fireEvent.blur(nameInput);
    });

    expect(onUpdateCallbackMock).toBeCalledTimes(1);
    expect(onUpdateCallbackMock).toBeCalledWith('new-name');
  });
});

import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import { DataBindingMapNameEditor } from './DataBindingMapNameEditor';

jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
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
  const onUpdateCallbackMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
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

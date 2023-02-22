import React from 'react';
import { act, render } from '@testing-library/react';
import wrapper from '@awsui/components-react/test-utils/dom';

import { DataBindingMapNameEditor } from './DataBindingMapNameEditor';

jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
}));

describe('DataBindingMapNameEditor', () => {
  const valueDataBindings = [
    {
      bindingName: 'binding-1',
      valueDataBinding: {
        dataBindingContext: 'random-1',
      },
    },
  ];
  const onUpdateCallbackMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update binding name', async () => {
    const { container } = render(
      <DataBindingMapNameEditor
        bindingName='binding-1'
        index={0}
        valueDataBindings={valueDataBindings}
        onUpdateCallback={onUpdateCallbackMock}
      />,
    );
    const polarisWrapper = wrapper(container);

    const nameInput = polarisWrapper.findInput('[data-test-id="binding-name-input"]');
    expect(nameInput).not.toBeNull();

    act(() => {
      nameInput!.setInputValue('new-name');
    });

    expect(onUpdateCallbackMock).toBeCalledTimes(1);
    expect(onUpdateCallbackMock).toBeCalledWith({
      valueDataBindings: [{ ...valueDataBindings[0], bindingName: 'new-name' }],
    });
  });
});

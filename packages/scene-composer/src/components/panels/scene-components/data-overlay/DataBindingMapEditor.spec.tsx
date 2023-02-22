import React from 'react';
import { act, render } from '@testing-library/react';
import wrapper from '@awsui/components-react/test-utils/dom';

import { mockProvider } from '../../../../../tests/components/panels/scene-components/MockComponents';
import { IDataOverlayComponentInternal } from '../../../../store';
import { Component } from '../../../../models/SceneModels';
import { IValueDataBindingBuilderProps } from '../ValueDataBindingBuilder';

import { DataBindingMapEditor } from './DataBindingMapEditor';

jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
}));

jest.mock('../../../../utils/mathUtils', () => ({
  generateUUID: jest.fn(() => 'random-uuid'),
}));

let builderOnChangeCb;
jest.mock('../ValueDataBindingBuilder', () => {
  const originalModule = jest.requireActual('../ValueDataBindingBuilder');
  return {
    ...originalModule,
    ValueDataBindingBuilder: (props: IValueDataBindingBuilderProps) => {
      builderOnChangeCb = props.onChange;
      return <div data-testid='ValueDataBindingBuilder'>{JSON.stringify(props)}</div>;
    },
  };
});

describe('DataBindingMapEditor', () => {
  const component = {
    subType: Component.DataOverlaySubType.OverlayPanel,
    valueDataBindings: [
      {
        bindingName: 'binding-1',
        valueDataBinding: {
          dataBindingContext: 'random-1',
        },
      },
    ],
  } as unknown as IDataOverlayComponentInternal;
  const onUpdateCallbackMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add new binding by clicking add button', async () => {
    const { container } = render(
      <DataBindingMapEditor
        valueDataBindingProvider={mockProvider}
        component={{ valueDataBindings: [] } as unknown as IDataOverlayComponentInternal}
        onUpdateCallback={onUpdateCallbackMock}
      />,
    );
    const polarisWrapper = wrapper(container);

    const addButton = polarisWrapper.findButton('[data-test-id="add-binding-button"]');
    expect(addButton).not.toBeNull();

    act(() => {
      addButton!.click();
    });

    expect(onUpdateCallbackMock).toBeCalledTimes(1);
    expect(onUpdateCallbackMock).toBeCalledWith({ valueDataBindings: [{ bindingName: 'random-uuid' }] });
  });

  it('should add additional binding by clicking add button without removing existing ones', async () => {
    const { container } = render(
      <DataBindingMapEditor
        valueDataBindingProvider={mockProvider}
        component={component}
        onUpdateCallback={onUpdateCallbackMock}
      />,
    );
    const polarisWrapper = wrapper(container);

    const addButton = polarisWrapper.findButton('[data-test-id="add-binding-button"]');
    expect(addButton).not.toBeNull();

    act(() => {
      addButton!.click();
    });

    expect(onUpdateCallbackMock).toBeCalledTimes(1);
    expect(onUpdateCallbackMock).toBeCalledWith({
      valueDataBindings: [...component.valueDataBindings, { bindingName: 'random-uuid' }],
    });
  });

  it('should remove binding by clicking remove button', async () => {
    const { container } = render(
      <DataBindingMapEditor
        valueDataBindingProvider={mockProvider}
        component={component}
        onUpdateCallback={onUpdateCallbackMock}
      />,
    );
    const polarisWrapper = wrapper(container);

    const removeButton = polarisWrapper.findButton('[data-test-id="remove-binding-button"]');
    expect(removeButton).not.toBeNull();

    act(() => {
      removeButton!.click();
    });

    expect(onUpdateCallbackMock).toBeCalledTimes(1);
    expect(onUpdateCallbackMock).toBeCalledWith({ ...component, valueDataBindings: [] }, true);
  });

  it('should call update when data binding changed', async () => {
    render(
      <DataBindingMapEditor
        valueDataBindingProvider={mockProvider}
        component={{ ...component, valueDataBindings: [...component.valueDataBindings, { bindingName: 'binding-2' }] }}
        onUpdateCallback={onUpdateCallbackMock}
      />,
    );

    builderOnChangeCb({ key: 'value' }, 1);

    expect(onUpdateCallbackMock).toBeCalledTimes(1);
    expect(onUpdateCallbackMock).toBeCalledWith(
      {
        ...component,
        valueDataBindings: [
          ...component.valueDataBindings,
          { bindingName: 'binding-2', valueDataBinding: { key: 'value' } },
        ],
      },
      true,
    );
  });
});

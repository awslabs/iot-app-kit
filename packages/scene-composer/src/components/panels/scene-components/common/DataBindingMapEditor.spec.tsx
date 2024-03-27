import wrapper from '@cloudscape-design/components/test-utils/dom';
import { act, render } from '@testing-library/react';
import React from 'react';

import { mockProvider } from '../../../../../tests/components/panels/scene-components/MockComponents';
import { Component } from '../../../../models/SceneModels';
import { IDataOverlayComponentInternal } from '../../../../store';

import { DataBindingMapEditor } from './DataBindingMapEditor';
import { IValueDataBindingBuilderProps } from './ValueDataBindingBuilder';

jest.mock('@cloudscape-design/components', () => ({
  ...jest.requireActual('@cloudscape-design/components'),
}));

jest.mock('../../../../utils/mathUtils', () => ({
  generateUUID: jest.fn(() => 'random-uuid'),
}));

let builderOnChangeCb;
jest.mock('./ValueDataBindingBuilder', () => {
  const originalModule = jest.requireActual('./ValueDataBindingBuilder');
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

  it('should remove binding by clicking remove button', async () => {
    const { container } = render(
      <DataBindingMapEditor
        hasRemoveButton={true}
        hasBindingName
        valueDataBindingProvider={mockProvider}
        component={component}
        onUpdateCallback={onUpdateCallbackMock}
      />,
    );
    const polarisWrapper = wrapper(container);

    const removeButton = polarisWrapper.findButton('[data-testid="remove-binding-button"]');
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
        hasBindingName
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

import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import { KnownComponentType } from '../../../interfaces';
import { IDataBindingComponentInternal, ISceneNodeInternal, useStore } from '../../../store';
import { mockProvider } from '../../../../tests/components/panels/scene-components/MockComponents';

import { DataBindingComponentEditor } from './DataBindingComponentEditor';

jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
}));

describe('DataBindingComponentEditor', () => {
  const component: IDataBindingComponentInternal = {
    ref: 'comp-ref',
    type: KnownComponentType.DataBinding,
    valueDataBindings: [{}, {}],
  };
  const node = {
    ref: 'node-ref',
  } as ISceneNodeInternal;
  const updateComponentInternalMock = jest.fn();
  const removeComponentMock = jest.fn();

  const baseState = {
    updateComponentInternal: updateComponentInternalMock,
    removeComponent: removeComponentMock,
    getEditorConfig: jest.fn().mockReturnValue({ valueDataBindingProvider: mockProvider }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call update component when there are still binding remaining after removing', async () => {
    useStore('default').setState(baseState);

    const { getAllByTestId } = render(<DataBindingComponentEditor node={node} component={component} />);

    const removeBindingButton = getAllByTestId('remove-binding-button')[0];
    act(() => {
      fireEvent.click(removeBindingButton);
    });

    expect(updateComponentInternalMock).toBeCalledTimes(1);
    expect(updateComponentInternalMock).toBeCalledWith(node.ref, { ...component, valueDataBindings: [{}] }, true);
  });

  it('should call remove component when there are no binding remaining after removing', async () => {
    useStore('default').setState(baseState);

    const { getAllByTestId } = render(
      <DataBindingComponentEditor node={node} component={{ ...component, valueDataBindings: [{}] }} />,
    );

    const removeBindingButton = getAllByTestId('remove-binding-button')[0];
    act(() => {
      fireEvent.click(removeBindingButton);
    });

    expect(removeComponentMock).toBeCalledTimes(1);
    expect(removeComponentMock).toBeCalledWith(node.ref, component.ref);
  });
});

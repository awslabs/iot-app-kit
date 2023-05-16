import { render, screen } from '@testing-library/react';
import React from 'react';

import { mockProvider } from '../../../../tests/components/panels/scene-components/MockComponents';
import { KnownComponentType } from '../../../interfaces';
import { IDataBindingComponentInternal, ISceneNodeInternal, useStore } from '../../../store';

import { DataBindingComponentEditor } from './DataBindingComponentEditor';

jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
}));

describe('DataBindingComponentEditor', () => {
  const component: IDataBindingComponentInternal = {
    ref: 'comp-ref',
    type: KnownComponentType.DataBinding,
    valueDataBinding: {
      dataBindingContext: { entityId: 'abcd' },
    },
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

  it('should not have remove button', async () => {
    useStore('default').setState(baseState);
    render(<DataBindingComponentEditor node={node} component={component} />);
    expect(screen.queryByText('remove-binding-button')).toBeNull();
    expect(updateComponentInternalMock).toBeCalledTimes(0);
  });

  it('should have entity search field', async () => {
    useStore('default').setState(baseState);
    render(<DataBindingComponentEditor node={node} component={component} />);
    expect(screen.getByTestId('select-entityId')).toBeTruthy();
    expect(updateComponentInternalMock).toBeCalledTimes(0);
  });
});

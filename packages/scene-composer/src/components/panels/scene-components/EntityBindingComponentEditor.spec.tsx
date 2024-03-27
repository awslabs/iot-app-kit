import { render, screen } from '@testing-library/react';
import React from 'react';

import { mockProvider } from '../../../../tests/components/panels/scene-components/MockComponents';
import { KnownComponentType } from '../../../interfaces';
import { IEntityBindingComponentInternal, ISceneNodeInternal, useStore } from '../../../store';

import { EntityBindingComponentEditor } from './EntityBindingComponentEditor';

jest.mock('@cloudscape-design/components', () => ({
  ...jest.requireActual('@cloudscape-design/components'),
}));

describe('EntityindingComponentEditor', () => {
  const component: IEntityBindingComponentInternal = {
    ref: 'comp-ref',
    type: KnownComponentType.EntityBinding,
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
    render(<EntityBindingComponentEditor node={node} component={component} />);
    expect(screen.queryByText('remove-binding-button')).toBeNull();
    expect(updateComponentInternalMock).toBeCalledTimes(0);
  });

  it('should have entity search field', async () => {
    useStore('default').setState(baseState);
    render(<EntityBindingComponentEditor node={node} component={component} />);
    expect(screen.getByTestId('select-entityId')).toBeTruthy();
    expect(updateComponentInternalMock).toBeCalledTimes(0);
  });
});

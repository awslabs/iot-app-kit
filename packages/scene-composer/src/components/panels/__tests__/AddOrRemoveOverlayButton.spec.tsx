import React from 'react';
import { act, render } from '@testing-library/react';

import { AddOrRemoveOverlayButton } from '../AddOrRemoveOverlayButton';
import { useStore } from '../../../store';
import { KnownComponentType } from '../../../interfaces';
import { Component } from '../../../models/SceneModels';

jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
}));

describe('AddOrRemoveOverlayButton', () => {
  const getSceneNodeByRef = jest.fn();
  const addComponentInternal = jest.fn();
  const removeComponent = jest.fn();

  beforeEach(() => {
    useStore('default').setState({
      selectedSceneNodeRef: 'selected',
      getSceneNodeByRef,
      addComponentInternal,
      removeComponent,
    });
  });

  it('should add overlay when clicking the button and the node has Tag component but no overlay component', async () => {
    getSceneNodeByRef.mockReturnValue({ components: [{ type: KnownComponentType.Tag }] });

    const { getByRole } = render(<AddOrRemoveOverlayButton />);
    const addButton = getByRole('button');

    act(() => {
      addButton!.click();
    });

    expect(addComponentInternal).toBeCalledTimes(1);
    expect(addComponentInternal).toBeCalledWith(
      'selected',
      expect.objectContaining({
        type: KnownComponentType.DataOverlay,
        subType: Component.DataOverlaySubType.OverlayPanel,
      }),
    );
  });

  it('should render remove button when the node has Tag component and overlay component', async () => {
    getSceneNodeByRef.mockReturnValue({
      components: [
        { type: KnownComponentType.Tag, ref: 'tag-ref' },
        { type: KnownComponentType.DataOverlay, ref: 'overlay-ref' },
      ],
    });

    const { getByRole } = render(<AddOrRemoveOverlayButton />);
    const removeButton = getByRole('button');

    act(() => {
      removeButton!.click();
    });

    expect(removeComponent).toBeCalledTimes(1);
    expect(removeComponent).toBeCalledWith('selected', 'overlay-ref');
  });
});

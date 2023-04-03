import React from 'react';
import { render } from '@testing-library/react';

import { AddOrRemoveOverlayButton } from '../AddOrRemoveOverlayButton';
import { useStore } from '../../../store';
import { setFeatureConfig } from '../../../common/GlobalSettings';
import { COMPOSER_FEATURES, KnownComponentType } from '../../../interfaces';

describe('AddOrRemoveOverlayButtonSnap', () => {
  const getSceneNodeByRef = jest.fn();
  const addComponentInternal = jest.fn();
  const removeComponent = jest.fn();

  beforeEach(() => {
    setFeatureConfig({ [COMPOSER_FEATURES.Overlay]: true });
    useStore('default').setState({
      selectedSceneNodeRef: 'selected',
      getSceneNodeByRef,
      addComponentInternal,
      removeComponent,
    });
  });

  it('should not render button when the node has no Tag component', async () => {
    getSceneNodeByRef.mockReturnValue({ components: [] });

    const { container } = render(<AddOrRemoveOverlayButton />);

    expect(container).toMatchInlineSnapshot(`<div />`);
  });

  it('should render add button when the node has Tag component but no overlay component', async () => {
    getSceneNodeByRef.mockReturnValue({ components: [{ type: KnownComponentType.Tag }] });

    const { container, queryByText } = render(<AddOrRemoveOverlayButton />);

    expect(queryByText('Add overlay')).not.toBeNull();
    expect(container).toMatchSnapshot();
  });

  it('should render remove button when the node has Tag component and overlay component', async () => {
    getSceneNodeByRef.mockReturnValue({
      components: [{ type: KnownComponentType.Tag }, { type: KnownComponentType.DataOverlay }],
    });

    const { container, queryByText } = render(<AddOrRemoveOverlayButton />);

    expect(queryByText('Remove overlay')).not.toBeNull();
    expect(container).toMatchSnapshot();
  });
});

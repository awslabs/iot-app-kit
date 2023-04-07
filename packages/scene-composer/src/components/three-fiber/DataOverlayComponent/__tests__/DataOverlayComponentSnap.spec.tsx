import React from 'react';
import { render } from '@testing-library/react';
import { BoxGeometry, Group, Mesh } from 'three';

import { DataOverlayComponent } from '../DataOverlayComponent';
import { Component } from '../../../../models/SceneModels';
import { KnownComponentType } from '../../../../interfaces';
import { IDataOverlayComponentInternal, ISceneNodeInternal, useStore } from '../../../../store';

jest.mock('../DataOverlayContainer', () => ({
  DataOverlayContainer: (...props: unknown[]) => <div data-testid='container'>{JSON.stringify(props)}</div>,
}));

describe('DataOverlayComponent', () => {
  const mockComponent: IDataOverlayComponentInternal = {
    ref: 'comp-ref',
    type: KnownComponentType.DataOverlay,
    subType: Component.DataOverlaySubType.OverlayPanel,
    dataRows: [
      {
        rowType: Component.DataOverlayRowType.Markdown,
        content: 'content',
      },
    ],
    valueDataBindings: [
      {
        bindingName: 'bindingA',
        valueDataBinding: { dataBindingContext: 'dataBindingContext' },
      },
    ],
  };
  const mockNode: Partial<ISceneNodeInternal> = {
    ref: 'node-ref',
    transform: { position: [1, 2, 3], rotation: [0, 0, 0], scale: [0, 0, 0] },
    components: [mockComponent],
  };

  const group = new Group();
  const geometry = new BoxGeometry(2, 4, 6);
  const mesh = new Mesh(geometry);
  group.add(mesh);

  const getObject3DBySceneNodeRef = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    useStore('default').setState({ getObject3DBySceneNodeRef });
  });

  it('should render the component correctly', () => {
    const { container } = render(
      <DataOverlayComponent node={mockNode as ISceneNodeInternal} component={mockComponent} />,
    );
    expect(container.getElementsByClassName('tm-html-wrapper').length).toBe(1);
    expect(container).toMatchSnapshot();
  });

  it('should render the component correctly with object 3D size', () => {
    getObject3DBySceneNodeRef.mockReturnValue(group);
    const { container } = render(
      <DataOverlayComponent node={mockNode as ISceneNodeInternal} component={mockComponent} />,
    );
    // expect(container.querySelector('[position="{\\"x\\":0,\\"y\\":1.7,\\"z\\":0}"]')).not.toBeNull();
    expect(container).toMatchSnapshot();
  });
});

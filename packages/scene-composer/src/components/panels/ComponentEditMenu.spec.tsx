import wrapper from '@awsui/components-react/test-utils/dom';
import { act, fireEvent, render } from '@testing-library/react';
import React from 'react';

import { setMetricRecorder } from '../../common/GlobalSettings';
import { KnownComponentType } from '../../interfaces';
import { Component } from '../../models/SceneModels';
import { useStore } from '../../store';

import { ComponentEditMenu } from './ComponentEditMenu';

describe('ComponentEditMenu', () => {
  const nodeRef = 'test-node-ref';
  const removeComponent = jest.fn();
  const updateComponentInternal = jest.fn();
  const mockMetricRecorder = {
    recordClick: jest.fn(),
  };
  setMetricRecorder(mockMetricRecorder);

  beforeEach(() => {
    jest.clearAllMocks();

    useStore('default').setState({
      removeComponent,
      updateComponentInternal,
    });
  });

  it('should render empty when current component has no menu item', () => {
    const { container } = render(
      <ComponentEditMenu nodeRef={nodeRef} currentComponent={{ type: KnownComponentType.Light, ref: 'comp-ref' }} />,
    );
    expect(container).toMatchInlineSnapshot(`<div />`);
  });

  it('should not add additional data binding to data binding component', () => {
    const component = { type: KnownComponentType.EntityBinding, ref: 'comp-ref', valueDataBindings: [{}] };
    render(<ComponentEditMenu nodeRef={nodeRef} currentComponent={component} />);
    expect(wrapper().getElement().innerHTML).not.toContain('Add entity binding');
  });

  it('should correctly remove data binding component', () => {
    const component = { type: KnownComponentType.EntityBinding, ref: 'comp-ref', valueDataBindings: [{}] };
    const { getByTestId } = render(<ComponentEditMenu nodeRef={nodeRef} currentComponent={component} />);
    const removeEntityBinding = getByTestId('remove-entity-binding');

    act(() => {
      fireEvent.pointerUp(removeEntityBinding);
    });

    expect(getByTestId('edit-component').childNodes[2].childNodes.length).toEqual(1);
    expect(removeComponent).toBeCalledTimes(1);
    expect(removeComponent).toBeCalledWith(nodeRef, component.ref);
    expect(mockMetricRecorder.recordClick).toBeCalledTimes(1);
    expect(mockMetricRecorder.recordClick).toBeCalledWith('EntityBinding-remove-entity-binding');
  });

  it('should correctly add additional data binding to overlay component', () => {
    const component = {
      type: KnownComponentType.DataOverlay,
      ref: 'comp-ref',
      subType: Component.DataOverlaySubType.OverlayPanel,
      valueDataBindings: [],
    };
    const { getByTestId } = render(<ComponentEditMenu nodeRef={nodeRef} currentComponent={component} />);
    const addBindingButton = getByTestId('add-data-binding');

    act(() => {
      fireEvent.pointerUp(addBindingButton);
    });

    expect(getByTestId('edit-component').childNodes[2].childNodes[0].childNodes.length).toEqual(2);
    expect(updateComponentInternal).toBeCalledTimes(1);
    expect(updateComponentInternal).toBeCalledWith(nodeRef, {
      ...component,
      valueDataBindings: [{ bindingName: expect.anything() }],
    });
    expect(mockMetricRecorder.recordClick).toBeCalledTimes(1);
    expect(mockMetricRecorder.recordClick).toBeCalledWith('DataOverlay-add-data-binding');
  });

  it('should correctly remove overlay panel component', () => {
    const component = {
      type: KnownComponentType.DataOverlay,
      ref: 'comp-ref',
      subType: Component.DataOverlaySubType.OverlayPanel,
      valueDataBindings: [],
    };
    const { getByTestId } = render(<ComponentEditMenu nodeRef={nodeRef} currentComponent={component} />);
    const removeOverlayButton = getByTestId('remove-overlay');

    act(() => {
      fireEvent.pointerUp(removeOverlayButton);
    });

    expect(getByTestId('edit-component').childNodes[2].childNodes[0].childNodes.length).toEqual(2);
    expect(removeComponent).toBeCalledTimes(1);
    expect(removeComponent).toBeCalledWith(nodeRef, component.ref);
    expect(mockMetricRecorder.recordClick).toBeCalledTimes(1);
    expect(mockMetricRecorder.recordClick).toBeCalledWith('DataOverlay-remove-overlay');
  });

  it('should not render remove overlay button for annotation', () => {
    const component = {
      type: KnownComponentType.DataOverlay,
      ref: 'comp-ref',
      subType: Component.DataOverlaySubType.TextAnnotation,
      valueDataBindings: [],
    };
    const { getByTestId, queryAllByTestId } = render(
      <ComponentEditMenu nodeRef={nodeRef} currentComponent={component} />,
    );
    const removeOverlayButton = queryAllByTestId('remove-overlay');

    expect(removeOverlayButton.length).toBe(0);
    expect(getByTestId('edit-component').childNodes[2].childNodes.length).toEqual(1);
  });
});

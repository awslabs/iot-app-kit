import React from 'react';

import { screen } from '@testing-library/dom';
import { act, fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { DASHBOARD_CONTAINER_ID } from '../grid/getDashboardPosition';
import InternalDashboard from '../internalDashboard';
import { DefaultDashboardMessages } from '../../messages';

import { configureDashboardStore } from '../../store';
import { setupDashboardPlugins } from '../../customization/api';
import pluginsConfiguration from '../../customization/pluginsConfiguration';
import type { DashboardState } from '../../store/state';
import type { RecursivePartial } from '~/types';

const renderDashboard = (state?: RecursivePartial<DashboardState>) => {
  setupDashboardPlugins(pluginsConfiguration);

  const store = configureDashboardStore(state);

  const { container } = render(
    <Provider store={store}>
      <DndProvider
        backend={HTML5Backend}
        options={{
          enableMouseEvents: true,
          enableKeyboardEvents: true,
        }}
      >
        <InternalDashboard hasEditPermission={false} messageOverrides={DefaultDashboardMessages} />
      </DndProvider>
    </Provider>
  );

  return { container, store };
};

describe('Component Palette', () => {
  it('can drag widgets onto the grid', function () {
    const { container, store } = renderDashboard();

    const draggableLine = screen.getByText('Line').previousElementSibling;
    const draggableText = screen.getByText('Text').previousElementSibling;

    const grid = container.querySelector(`#${DASHBOARD_CONTAINER_ID}`);

    if (!draggableLine || !draggableText || !grid) throw new Error('could not get draggable elements for test');

    expect(store.getState().dashboardConfiguration.widgets).toHaveLength(0);

    act(() => {
      fireEvent.dragStart(draggableLine);
      fireEvent.dragEnter(grid);
      fireEvent.dragOver(grid);
      fireEvent.drop(grid);
    });

    expect(store.getState().dashboardConfiguration.widgets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'iot-line',
        }),
      ])
    );

    act(() => {
      fireEvent.dragStart(draggableText);
      fireEvent.dragEnter(grid);
      fireEvent.dragOver(grid);
      fireEvent.drop(grid);
    });

    expect(store.getState().dashboardConfiguration.widgets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'iot-line',
        }),
        expect.objectContaining({
          type: 'text',
        }),
      ])
    );
  });

  it('does not add a widget if dropped outside of grid', function () {
    const { container, store } = renderDashboard();

    const draggable = screen.getByText('Line').previousElementSibling;

    const componentPalette = container.querySelector('.component-palette');

    if (!draggable || !componentPalette) throw new Error('could not get draggable elements for test');

    expect(store.getState().dashboardConfiguration.widgets).toHaveLength(0);

    act(() => {
      fireEvent.dragStart(draggable);
      fireEvent.dragEnter(componentPalette);
      fireEvent.dragOver(componentPalette);
      fireEvent.drop(componentPalette);
    });

    expect(store.getState().dashboardConfiguration.widgets).toHaveLength(0);
  });
});

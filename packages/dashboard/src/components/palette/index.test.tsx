import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { DASHBOARD_CONTAINER_ID } from '../grid/getDashboardPosition';
import InternalDashboard from '../internalDashboard';

import { configureDashboardStore } from '../../store';
import { setupDashboardPlugins } from '../../customization/api';
import pluginsConfiguration from '../../customization/pluginsConfiguration';
import type { DashboardState } from '../../store/state';
import type { RecursivePartial } from '~/types';

const renderDashboard = (state?: RecursivePartial<DashboardState>) => {
  setupDashboardPlugins(pluginsConfiguration);

  const store = configureDashboardStore(state);

  const renderResults = render(
    <Provider store={store}>
      <DndProvider
        backend={HTML5Backend}
        options={{
          enableMouseEvents: true,
          enableKeyboardEvents: true,
        }}
      >
        <InternalDashboard editable={true} />
      </DndProvider>
    </Provider>
  );

  return { ...renderResults, store };
};

describe('Component Palette', () => {
  it('can drag widgets onto the grid', function () {
    const { container, store } = renderDashboard();

    const draggableLine = screen.getByLabelText(/add line widget/i);
    const draggableText = screen.getByLabelText(/add text widget/i);

    const grid = container.querySelector(`#${DASHBOARD_CONTAINER_ID}`);

    if (!grid) throw new Error('could not get draggable elements for test');

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
          type: 'line-chart',
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
          type: 'line-chart',
        }),
        expect.objectContaining({
          type: 'text',
        }),
      ])
    );
  });

  it('does not add a widget if dropped outside of grid', function () {
    const { store } = renderDashboard();

    const draggable = screen.getByLabelText(/add line widget/i);

    // Preview button is always visible, and outside of the grid area
    const previewBtn = screen.getByRole('button', { name: /preview/i });

    expect(store.getState().dashboardConfiguration.widgets).toHaveLength(0);

    act(() => {
      fireEvent.dragStart(draggable);
      fireEvent.dragEnter(previewBtn);
      fireEvent.dragOver(previewBtn);
      fireEvent.drop(previewBtn);
    });

    expect(store.getState().dashboardConfiguration.widgets).toHaveLength(0);
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import LineWidgetComponent from './component';
import { Provider } from 'react-redux';
import { configureDashboardStore } from '~/store';
import { DashboardState } from '~/store/state';
import { LineProperties, LineWidget } from '../types';

const mockWidgetPartial = {
  id: 'mock-line-widget',
  type: 'line-symbol',
  x: 0,
  y: 0,
  z: 1,
  width: 7,
  height: 4,
};

const TestComponent = (object: { widget: LineWidget; isSelected: boolean }) => {
  const { widget, isSelected } = object;

  const initialState: Partial<DashboardState> = {
    dashboardConfiguration: {
      widgets: [widget],
    },
    selectedWidgets: isSelected ? [widget] : [],
  };

  return (
    <Provider store={configureDashboardStore(initialState)}>
      <DndProvider backend={HTML5Backend}>
        <LineWidgetComponent {...widget} />
      </DndProvider>
    </Provider>
  );
};

describe('LineWidgetComponent', () => {
  describe('Rendering', () => {
    [
      {
        properties: {
          lineStyle: 'solid',
          color: 'black',
          thickness: 5,
          start: { x: 20, y: 20 },
          end: { x: 180, y: 180 },
        } as LineProperties,
        isSelected: true,
      },
      {
        properties: {
          lineStyle: 'dashed',
          color: 'black',
          thickness: 5,
          start: { x: 30, y: 20 },
          end: { x: 180, y: 190 },
        } as LineProperties,
        isSelected: true,
      },
      {
        properties: {
          lineStyle: 'dotted',
          color: 'black',
          thickness: 5,
          start: { x: 25, y: 5 },
          end: { x: 100, y: 120 },
        } as LineProperties,
        isSelected: true,
      },
      {
        properties: {
          lineStyle: 'solid',
          color: 'red',
          thickness: 5,
          start: { x: 20, y: 20 },
          end: { x: 180, y: 180 },
        } as LineProperties,
        isSelected: true,
      },
      {
        properties: {
          lineStyle: 'dashed',
          color: 'blue',
          thickness: 10,
          start: { x: 180, y: 175 },
          end: { x: 20, y: 30 },
        } as LineProperties,
        isSelected: true,
      },
      {
        properties: {
          lineStyle: 'dotted',
          color: 'green',
          thickness: 15,
          start: { x: 180, y: 175 },
          end: { x: 20, y: 30 },
        } as LineProperties,
        isSelected: true,
      },
    ].forEach((configuration) => {
      const widget = {
        ...mockWidgetPartial,
        properties: { ...configuration.properties },
      };
      const isSelected = configuration.isSelected;
      it(`should render correctly with ${JSON.stringify(configuration)} while ${
        isSelected ? 'selected' : 'not selected'
      }`, () => {
        const { container } = render(
          <TestComponent widget={widget} isSelected={isSelected} />
        );
        expect(container).toMatchSnapshot();
      });
    });
  });

  describe('Anchor visibility', () => {
    const widget = {
      ...mockWidgetPartial,
      properties: {
        lineStyle: 'solid',
        color: 'black',
        thickness: 5,
        start: { x: 180, y: 175 },
        end: { x: 20, y: 30 },
      },
    } as LineWidget;

    it('should display anchors when the widget is selected', async () => {
      const { getAllByTestId } = render(
        <TestComponent widget={widget} isSelected={true} />
      );
      expect(getAllByTestId('line-anchor')).toHaveLength(2);
    });
    it('should not display anchors when the widget is not selected', () => {
      const { queryAllByTestId } = render(
        <TestComponent widget={widget} isSelected={false} />
      );
      expect(queryAllByTestId('line-anchor')).toHaveLength(0);
    });
  });
});

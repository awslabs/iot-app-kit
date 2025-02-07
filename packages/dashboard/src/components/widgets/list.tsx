import type { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import includes from 'lodash-es/includes';
import map from 'lodash-es/map';
import { type DashboardState } from '~/store/state';
import { SelectionBox } from './selectionBox';
import { WidgetComponent } from './widget';
import './list.css';
import { type WidgetInstance } from '~/features/widget-instance/instance';

export interface WidgetsProps {
  readOnly: boolean;
  query?: SiteWiseQuery;
  dashboardConfiguration: DashboardState['dashboardConfiguration'];
  selectedWidgets: WidgetInstance[];
  cellSize: number;
  dragEnabled: boolean;
}

export const Widgets = ({
  dashboardConfiguration,
  selectedWidgets,
  cellSize,
  dragEnabled,
  query,
  readOnly,
}: WidgetsProps) => {
  const { widgets } = dashboardConfiguration;
  const isSelected = (id: string) =>
    includes(
      map(selectedWidgets, (sw) => sw.id),
      id
    );

  return (
    <div
      className='widgets'
      style={{
        margin: `${cellSize / 2}px`,
      }}
    >
      {!readOnly && (
        <SelectionBox
          selectedWidgets={selectedWidgets}
          cellSize={cellSize}
          dragEnabled={dragEnabled}
        />
      )}
      {widgets.map((widget) => (
        <WidgetComponent
          readOnly={readOnly}
          query={query}
          isSelected={isSelected(widget.id)}
          numSelected={selectedWidgets.length}
          key={widget.id}
          cellSize={cellSize}
          widget={widget}
        />
      ))}
    </div>
  );
};

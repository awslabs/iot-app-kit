import type { DashboardMessages } from '~/messages';
import { type DashboardState } from '~/store/state';
import './list.css';
import SelectionBox from './selectionBox';
import WidgetComponent from './widget';

export interface WidgetsProps {
  readOnly: boolean;
  dashboardConfiguration: DashboardState['dashboardConfiguration'];
  cellSize: number;
  dragEnabled: boolean;
  messageOverrides: DashboardMessages;
}

export const Widgets = ({
  dashboardConfiguration,
  cellSize,
  dragEnabled,
  messageOverrides,
  readOnly,
}: WidgetsProps) => {
  return (
    <div
      className='widgets'
      style={{
        margin: `${cellSize / 2}px`,
      }}
    >
      {!readOnly && (
        <SelectionBox cellSize={cellSize} dragEnabled={dragEnabled} />
      )}
      {dashboardConfiguration.widgets.map((widget) => (
        <WidgetComponent
          readOnly={readOnly}
          messageOverrides={messageOverrides}
          key={widget.id}
          cellSize={cellSize}
          widget={widget}
        />
      ))}
    </div>
  );
};

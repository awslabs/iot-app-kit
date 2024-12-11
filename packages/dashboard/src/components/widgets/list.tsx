import type { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import includes from 'lodash-es/includes';
import map from 'lodash-es/map';
import type { DashboardMessages } from '../../messages';
import { type DashboardState } from '../../store/state-old';
import type { DashboardWidget } from '../../types';
import './list.css';
import SelectionBox from './selectionBox';
import WidgetComponent from './widget';

export type WidgetsProps = {
  readOnly: boolean;
  query?: SiteWiseQuery;
  dashboardConfiguration: DashboardState['dashboardConfiguration'];
  selectedWidgets: DashboardWidget[];
  cellSize: number;
  dragEnabled: boolean;
  messageOverrides: DashboardMessages;
};

const Widgets: React.FC<WidgetsProps> = ({
  dashboardConfiguration,
  selectedWidgets,
  cellSize,
  dragEnabled,
  messageOverrides,
  query,
  readOnly,
}) => {
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
          messageOverrides={messageOverrides}
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

export default Widgets;

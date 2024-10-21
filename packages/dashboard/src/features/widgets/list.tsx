import React from 'react';

import type { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import includes from 'lodash/includes';
import map from 'lodash/map';
import { useSelectedWidgets } from '~/features/widget-selection/use-selected-widgets';
import type { DashboardMessages } from '~/messages';
import { useDashboardCellSize } from '~/store/dashboard/use-dashboard-cell-size';
import { useWidgets } from '~/store/dashboard/use-widgets';
import SelectionBox from '../widget-resize/selectionBox';
import './list.css';
import WidgetComponent from './widget';

export type WidgetsProps = {
  readOnly: boolean;
  query?: SiteWiseQuery;
  dragEnabled: boolean;
  messageOverrides: DashboardMessages;
};

const Widgets: React.FC<WidgetsProps> = ({
  dragEnabled,
  messageOverrides,
  query,
  readOnly,
}) => {
  const widgets = useWidgets();
  const selectedWidgets = useSelectedWidgets();
  const [cellSize] = useDashboardCellSize();

  const isSelected = (id: string) =>
    includes(
      map(selectedWidgets, (sw) => sw.id),
      id
    );

  return (
    <div className='widgets'>
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
          key={widget.id}
          cellSize={cellSize}
          widget={widget}
        />
      ))}
    </div>
  );
};

export default Widgets;

import { useEffect, useMemo } from 'react';
import { type DataStreamInformation, type TrendCursor } from './types';
import Table, { type TableProps } from '@cloudscape-design/components/table';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { createTableLegendColumnDefinitions } from './columnDefinitions/factory';
import { type ChartLegend, type ChartOptions } from '../../types';
import type { AssistantProperty } from '../../../../common/assistantProps';
import { useAssistant } from '../../../../hooks/useAssistant/useAssistant';
import './table.css';

type ChartLegendTableOptions = ChartLegend & {
  datastreams: DataStreamInformation[];
  trendCursors: TrendCursor[];
  significantDigits: ChartOptions['significantDigits'];
  assistant?: AssistantProperty;
  selectedItems?: DataStreamInformation[];
  setSelectedItems?: (selectedItems: DataStreamInformation[]) => void;
  selectionType?: TableProps.SelectionType;
};

export const ChartLegendTable = ({
  datastreams,
  trendCursors,
  visible,
  position,
  width,
  visibleContent,
  significantDigits,
  assistant,
  selectedItems,
  setSelectedItems,
  selectionType,
}: ChartLegendTableOptions) => {
  const { items, collectionProps } = useCollection(datastreams, {
    sorting: {},
  });

  const columnDefinitions = useMemo(
    () =>
      createTableLegendColumnDefinitions({
        trendCursors,
        width: Number(width),
        visibleContent,
        significantDigits,
      }),
    [width, trendCursors, visibleContent, significantDigits]
  );

  const { actionsByComponent, clearActions } = useAssistant({});
  useEffect(() => {
    if (assistant?.componentId && setSelectedItems) {
      const componentAction = actionsByComponent[assistant?.componentId];
      if (componentAction?.action === 'clear-selection') {
        setSelectedItems([]);
        clearActions(assistant?.componentId);
      }
    }
  }, [actionsByComponent, assistant, setSelectedItems, clearActions]);

  if (!visible) return null;

  return (
    <div
      className='base-chart-legend-table-container'
      style={
        position === 'right' ? { padding: `0 16px 0 0` } : { padding: '0 16px' }
      }
    >
      <Table
        {...collectionProps}
        items={items}
        columnDefinitions={columnDefinitions}
        stickyColumns={{ first: 1, last: 0 }}
        stickyHeader
        trackBy='id'
        variant='embedded'
        preferences={<></>}
        contentDensity='compact'
        onSelectionChange={(event) => {
          if (setSelectedItems) {
            setSelectedItems(event.detail.selectedItems);
          }
        }}
        selectedItems={selectedItems}
        selectionType={selectionType}
      />
    </div>
  );
};

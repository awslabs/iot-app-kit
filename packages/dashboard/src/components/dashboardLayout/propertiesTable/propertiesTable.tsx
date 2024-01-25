import React from 'react';
import Table from '@cloudscape-design/components/table';
import Pagination from '@cloudscape-design/components/pagination';
import './propertiesTable.css';
import { CancelableEventHandler } from '@cloudscape-design/components/internal/events';
import { ButtonProps } from '@cloudscape-design/components/button/interfaces';
import { useCollection } from '@cloudscape-design/collection-hooks';

import { useSelector } from 'react-redux';
import { DashboardState } from '~/store/state';
import { usePreferences } from '~/components/dashboardLayout/propertiesTable/tableHelpers/usePrefrences';
import { getColumnDefinition } from '~/components/dashboardLayout/propertiesTable/tableHelpers/columnDefinition';
import { PROPERTIES_PANEL_FILTERING_PROPERTIES } from '~/components/dashboardLayout/propertiesTable/tableHelpers/filteringProperties';
import { PropertyPanelEmptyTable } from '~/components/dashboardLayout/propertiesTable/tableHelpers/propertyPanelEmptyTable';
import { PropertyPanelTableFilter } from '~/components/dashboardLayout/propertiesTable/tableHelpers/propertyPanelTableFilter';
import { PropertyPanelTableHeader } from '~/components/dashboardLayout/propertiesTable/tableHelpers/propertyPanelTableHeader';
import { PropertyPanelTablePreferences } from '~/components/dashboardLayout/propertiesTable/tableHelpers/propertyPanelTablePreferences';
import { useSelected } from '~/components/dashboardLayout/hooks/useSelected';
import { ModeledDataStream } from '~/components/queryEditor/iotSiteWiseQueryEditor/modeledDataStreamQueryEditor/modeledDataStreamExplorer/types';

interface TableItems extends ModeledDataStream {
  type: string;
  color: string;
  latestValue: string;
  yAxis: { visible: string; yMin: string; yMax: string };
  line: {
    connectionStyle: string;
    style: string;
    thickness: string;
  };
}
export const PropertiesTable = ({
  onAddDataStreams,
}: {
  onAddDataStreams: CancelableEventHandler<ButtonProps.ClickDetail>;
}) => {
  const { selectedCount } = useSelected();
  const significantDigits = useSelector(
    (state: DashboardState) => state.significantDigits
  );

  const [preferences, setPreferences] = usePreferences();
  const allItems: TableItems[] = [];

  const {
    items,
    collectionProps,
    paginationProps,
    propertyFilterProps,
    actions,
  } = useCollection(selectedCount === 1 ? allItems : [], {
    propertyFiltering: {
      filteringProperties: PROPERTIES_PANEL_FILTERING_PROPERTIES,
    },
    pagination: { pageSize: preferences.pageSize },
    selection: {
      keepSelection: true,
      trackBy: 'name',
    },
    sorting: {},
  });

  const paginationPropsWithAriaLabels = {
    ...paginationProps,
    ariaLabels: {
      nextPageLabel: 'Next page',
      paginationLabel: 'Properties Table pagination',
      previousPageLabel: 'Previous page',
      pageLabel: (pageNumber: number) => `Page ${pageNumber}`,
    },
  };

  return (
    <div className='properties-table-parent-container'>
      {/*TODO: possibly different table needs to render based on the widget type*/}
      <Table
        {...collectionProps}
        columnDefinitions={getColumnDefinition(significantDigits)}
        items={items}
        trackBy={(item) => `${item.assetId ?? item.type}-${item.propertyId}`}
        stickyHeader
        variant='borderless'
        loadingText='Loading resources'
        selectionType='multi'
        contentDensity='compact'
        resizableColumns
        visibleColumns={preferences.visibleContent}
        stripedRows={preferences.stripedRows}
        wrapLines={preferences.wrapLines}
        stickyColumns={preferences.stickyColumns}
        empty={
          <PropertyPanelEmptyTable
            selectedWidgetsLength={selectedCount}
            allItemsLength={allItems.length}
            onAddDataStreams={onAddDataStreams}
          />
        }
        filter={<PropertyPanelTableFilter {...propertyFilterProps} />}
        header={
          <PropertyPanelTableHeader
            selectedItems={collectionProps.selectedItems as unknown[]}
            clearItems={() => actions.setSelectedItems([])}
            allItemsCount={allItems.length}
            onAddDataStreams={onAddDataStreams}
            selectedWidgetsCount={selectedCount}
          />
        }
        pagination={<Pagination {...paginationPropsWithAriaLabels} />}
        preferences={
          <PropertyPanelTablePreferences
            preferences={preferences}
            updatePreferences={setPreferences}
          />
        }
      />
    </div>
  );
};

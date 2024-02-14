import React from 'react';
import Table from '@cloudscape-design/components/table';
import Pagination from '@cloudscape-design/components/pagination';
import './propertiesPanelTable.css';
import { CancelableEventHandler } from '@cloudscape-design/components/internal/events';
import { ButtonProps } from '@cloudscape-design/components/button/interfaces';
import { useCollection } from '@cloudscape-design/collection-hooks';

import { useSelector } from 'react-redux';
import { DashboardState } from '~/store/state';
import { ModeledDataStream } from '~/components/queryEditor/iotSiteWiseQueryEditor/modeledDataStreamQueryEditor/modeledDataStreamExplorer/types';
import { usePreferences } from '~/components/dashboardLayout/propertyPanel/propertiesPanelTable/tableHelpers/usePrefrences';
import { PROPERTIES_PANEL_FILTERING_PROPERTIES } from '~/components/dashboardLayout/propertyPanel/propertiesPanelTable/tableHelpers/filteringProperties';
import { getColumnDefinition } from '~/components/dashboardLayout/propertyPanel/propertiesPanelTable/tableHelpers/columnDefinition';
import { PropertyPanelEmptyTable } from '~/components/dashboardLayout/propertyPanel/propertiesPanelTable/tableHelpers/propertyPanelEmptyTable';
import { PropertyPanelTableFilter } from '~/components/dashboardLayout/propertyPanel/propertiesPanelTable/tableHelpers/propertyPanelTableFilter';
import { PropertyPanelTableHeader } from '~/components/dashboardLayout/propertyPanel/propertiesPanelTable/tableHelpers/propertyPanelTableHeader';
import { PropertyPanelTablePreferences } from '~/components/dashboardLayout/propertyPanel/propertiesPanelTable/tableHelpers/propertyPanelTablePreferences';
import { useSelectedWidgets } from '~/hooks/useSelectedWidgets';

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
export const PropertiesPanelTable = ({
  onAddDataStreams,
}: {
  onAddDataStreams: CancelableEventHandler<ButtonProps.ClickDetail>;
}) => {
  const selectedWidgets = useSelectedWidgets();
  const selectedCount = selectedWidgets.length;
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

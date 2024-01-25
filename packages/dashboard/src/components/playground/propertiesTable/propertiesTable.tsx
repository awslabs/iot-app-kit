import Table from '@cloudscape-design/components/table';
import React from 'react';
import {
  Box,
  Button,
  CollectionPreferences,
  Header,
  SpaceBetween,
  TextFilter,
} from '@cloudscape-design/components';
import Pagination from '@cloudscape-design/components/pagination';
import './propertiesTable.css';
import CustomOrangeButton from '~/components/customOrangeButton';
import { CancelableEventHandler } from '@cloudscape-design/components/internal/events';
import { ButtonProps } from '@cloudscape-design/components/button/interfaces';
import { useSelectedWidgets } from '~/hooks/useSelectedWidgets';
import { AssetSummary } from '~/hooks/useAssetDescriptionQueries';
import {
  SiteWiseQueryConfig,
  StyledAssetQuery,
} from '~/customization/widgets/types';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { useWidgetMetaData } from '~/components/playground/propertiesTable/widgetMetaData/useWidgetMetaData';
import {
  spaceScaledL,
  spaceScaledXl,
  spaceScaledXs,
} from '@cloudscape-design/design-tokens';

export const convertPropertiesToMap = (
  describedAssetsMapQueryData: Record<string, AssetSummary>
) => {
  if (Object.entries(describedAssetsMapQueryData).length === 0)
    return undefined;

  const assetEntries = Object.entries(describedAssetsMapQueryData).map(
    ([assetId, summary]) => {
      const propertiesEntries = summary.properties.map((property) => {
        return [property.propertyId, property];
      });
      return [
        assetId,
        { ...summary, properties: Object.fromEntries(propertiesEntries) },
      ];
    }
  );

  return Object.fromEntries(assetEntries);
};

export const PropertiesTable = ({
  onAddDataStreams,
}: {
  onAddDataStreams: CancelableEventHandler<ButtonProps.ClickDetail>;
}) => {
  const selectedWidgets = useSelectedWidgets();

  const queryConfig: StyledAssetQuery | undefined = selectedWidgets.length
    ? (selectedWidgets[0].properties.queryConfig as SiteWiseQueryConfig)?.query
    : undefined;

  const allItems = useWidgetMetaData(queryConfig);

  const { items, paginationProps, collectionProps } = useCollection(
    allItems ?? [],
    {
      pagination: {
        defaultPage: 1,
      },
      selection: {
        keepSelection: true,
        trackBy: 'key',
      },
    }
  );
  return (
    <div className='properties-table-parent-container'>
      <Table
        stickyHeader
        onSelectionChange={collectionProps?.onSelectionChange}
        selectedItems={collectionProps.selectedItems}
        loadingText='Loading resources'
        selectionType='multi'
        trackBy='key'
        contentDensity='compact'
        resizableColumns
        stickyColumns={{ first: 1 }}
        columnDefinitions={[
          {
            id: 'name',
            header: 'Name',
            cell: (item) => (
              <div className='properties-table-property-td-container'>
                <span
                  style={{
                    backgroundColor: item.color,
                    minWidth: spaceScaledXl,
                    height: spaceScaledL,
                    borderRadius: spaceScaledXs,
                    marginRight: spaceScaledXs,
                  }}
                ></span>
                <span>{item.name}</span>
              </div>
            ),
            sortingField: 'name',
            isRowHeader: true,
          },
          {
            id: 'currentValue',
            header: 'Current Value',
            cell: (item) => item.currentValue,
            sortingField: 'currentValue',
          },
          {
            id: 'assetName',
            header: 'Asset Name',
            cell: (item) => item.assetName,
            sortingField: 'assetName',
          },
          {
            id: 'showYAxis',
            header: 'Show Y Axis',
            cell: (item) => item.showYAxis,
            sortingField: 'showYAxis',
          },
          {
            id: 'yMin',
            header: 'Y min',
            cell: (item) => item.yMin,
            sortingField: 'yMin',
          },
          {
            id: 'yMax',
            header: 'Y Max',
            cell: (item) => item.yMax,
            sortingField: 'yMax',
          },
          {
            id: 'lineType',
            header: 'Line Type',
            cell: (item) => item.lineType,
            sortingField: 'lineType',
          },
          {
            id: 'lineStyle',
            header: 'Line Style',
            cell: (item) => item.lineStyle,
            sortingField: 'lineStyle',
          },
          {
            id: 'lineThickness',
            header: 'Line Thickness',
            cell: (item) => item.lineThickness,
            sortingField: 'lineThickness',
          },
        ]}
        items={items}
        empty={
          selectedWidgets.length === 1 && allItems?.length === 0 ? (
            <Box
              margin={{ vertical: 'xxxl' }}
              textAlign='center'
              color='inherit'
            >
              <SpaceBetween size='m'>
                <b>No data streams</b>
                <Button>Add data stream</Button>
              </SpaceBetween>
            </Box>
          ) : (
            <Box
              margin={{ vertical: 'xxxl' }}
              textAlign='center'
              color='inherit'
            >
              <SpaceBetween size='xxl'>
                <b> Please select a widget above</b>
              </SpaceBetween>
            </Box>
          )
        }
        filter={
          <TextFilter filteringPlaceholder='Find resources' filteringText='' />
        }
        header={
          <Header
            counter={
              collectionProps?.selectedItems?.length
                ? '(' + collectionProps?.selectedItems?.length + '/10)'
                : '(10)'
            }
            actions={
              <SpaceBetween direction='horizontal' size='xs'>
                <Button disabled={collectionProps?.selectedItems?.length === 0}>
                  Remove
                </Button>
                <Button disabled={collectionProps.selectedItems?.length === 0}>
                  Edit
                </Button>
                <CustomOrangeButton
                  title='+ Add data streams'
                  onClick={onAddDataStreams}
                  disabled={selectedWidgets.length !== 1}
                />
              </SpaceBetween>
            }
          >
            Selected data streams
          </Header>
        }
        pagination={
          <Pagination
            currentPageIndex={paginationProps.currentPageIndex}
            pagesCount={paginationProps.pagesCount}
          />
        }
        preferences={
          <CollectionPreferences
            title='Preferences'
            confirmLabel='Confirm'
            cancelLabel='Cancel'
            preferences={{
              pageSize: 10,
              contentDisplay: [
                { id: 'name', visible: true },
                { id: 'currentValue', visible: true },
                { id: 'assetName', visible: true },
                { id: 'showYAxis', visible: true },
                { id: 'yMin', visible: true },
                { id: 'yMax', visible: true },
                { id: 'lineType', visible: true },
                { id: 'lineStyle', visible: true },
                { id: 'lineThickness', visible: true },
              ],
            }}
            pageSizePreference={{
              title: 'Page size',
              options: [
                { value: 10, label: '10 data streams' },
                { value: 20, label: '20 data streams' },
                { value: 30, label: '30 data streams' },
              ],
            }}
            contentDisplayPreference={{
              options: [
                {
                  id: 'name',
                  label: 'name',
                  alwaysVisible: true,
                },
                { id: 'currentValue', label: 'current value' },
                { id: 'assetName', label: 'asset name' },
                { id: 'showYAxis', label: 'show Y axis' },
                { id: 'yMin', label: 'Y min' },
                { id: 'yMax', label: 'Y max' },
                { id: 'lineType', label: 'line type' },
                { id: 'lineStyle', label: 'line style' },
                { id: 'lineThickness', label: 'line thickness' },
              ],
            }}
          />
        }
      />
    </div>
  );
};

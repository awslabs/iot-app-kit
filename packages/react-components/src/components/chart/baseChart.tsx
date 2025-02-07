import { type TableProps } from '@cloudscape-design/components/table';
import {
  colorBorderDividerSecondary,
  spaceStaticL,
  spaceStaticM,
} from '@cloudscape-design/design-tokens';
import {
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { HotKeys } from 'react-hotkeys';
import { Resizable, type ResizeHandle } from 'react-resizable';
import { useECharts, useResizeableEChart } from '../../hooks/useECharts';
import { getTimeSeriesQueries, useViewport } from '@iot-app-kit/component-core';
import { useChartConfiguration } from './chartOptions/useChartConfiguration';
import { useChartDataset } from './chartOptions/useChartDataset';
import ChartContextMenu from './contextMenu/ChartContextMenu';
import { useHandleChartEvents } from './events/useHandleChartEvents';
import { useDataZoom } from './hooks/useDataZoom';
import { useVisualizedDataStreams } from './hooks/useVisualizedDataStreams';
import Legend from './legend/table';
import { MultiYAxisLegend } from './multiYAxis/multiYAxis';
import { type ChartOptions } from './types';
import { viewportEndDate, viewportStartDate } from '@iot-app-kit/core';
import { getAdjustedChartHeight, Title } from '../../common/title';
import { useTrendCursors } from '../../echarts/extensions/trendCursors';
import { useAssistantContext } from '../../hooks/useAssistantContext/useAssistantContext';
import {
  convertToSupportedTimeRange,
  getSelectedQueriesAndProperties,
} from '../../hooks/useAssistantContext/utils';
import { useModalVisibility } from '../../hooks/useModalVisibility/useModalVisibility';
import useDataStore from '../../store';
import { Timestamp } from '../timestampBar';
import './chart.css';
import {
  REFRESHING_DELAY_MS,
  TIMESTAMP_HEIGHT_FACTOR_BOTTOM,
  TIMESTAMP_WIDTH_FACTOR,
  TIMESTAMP_WIDTH_FACTOR_BOTTOM,
} from './eChartsConstants';
import { useChartAlarms } from './hooks/useChartAlarms';
import { useChartPreferences } from './hooks/useChartPreferences';
import { useChartStoreDataStreamsSync } from './hooks/useChartStoreDataStreamsSync';
import useIsRefreshing from './hooks/useIsrefreshing';
import { useNormalizedDataStreams } from './hooks/useNormalizedDataStreams';
import { type DataStreamInformation } from './legend/table/types';
import { ChartPreferencesModal } from './preferences/dataQualityModal';
import { PreferencesModalToggle } from './preferences/toggle';

/**
 * Developer Notes:
 *
 * The general organization of the Chart follows this flow:
 *
 * 1. setup echarts instance using useECharts
 * 2. get datastreams using useVisualizedDataStreams
 * 3. use datastreams / chart options to compute datastructures
 *    needed to implement various features and adapt them to the echarts api
 * 4. set all  the options in echarts using useEChartOptions
 * 5. do not make use of setOptions in the individual feature, useEChartOptions should be the only place.
 *    Exception: when deleting an item or in general when removing some elements you may need to use setOptions
 *
 */

/**
 * Base chart to display Line, Scatter, and Bar charts.
 */
const BaseChart = ({
  viewport,
  queries,
  onChartOptionsChange,
  size = { width: 650, height: 400 },
  gestures = true,
  timeZone,
  ...options
}: ChartOptions) => {
  useEffect(() => {
    // Set timezone for use in sub components
    useDataStore.getState().setTimeZone(timeZone);
  }, [timeZone]);

  const {
    visible: dataQualityPreferencesVisible,
    onHide: onHideDataQualityPreferences,
    onShow: onShowDataQualityPreferences,
  } = useModalVisibility();
  const {
    showBadDataIcons,
    showUncertainDataIcons,
    showAlarmIcons,
    handleChangeBadDataIconsVisibility,
    handleChangeUncertainDataIconsVisibility,
    handleChangeAlarmIconsVisibility,
  } = useChartPreferences({ ...options.dataQuality, onChartOptionsChange });

  const { setContextByComponent, transformTimeseriesDataToAssistantContext } =
    useAssistantContext();
  const [selectedItems, setSelectedItems] = useState<DataStreamInformation[]>(
    []
  );

  const isLegendVisible = options.legend?.visible;
  const isLegendPositionLeft = options.legend?.position === 'left';
  const isLegendPositionBottom = options.legend?.position === 'bottom';

  // Setup instance of echarts
  const { ref, chartRef } = useECharts(options?.theme);

  const { group } = useViewport();

  const {
    handleAddTrendCursor,
    handleDeleteTrendCursor,
    handleCopyTrendCursor,
    trendCursors,
    trendCursorValues,
  } = useTrendCursors({ group, chartRef, id: options.id });

  // convert TimeSeriesDataQuery to TimeSeriesData
  const timeSeriesQueries = getTimeSeriesQueries(queries);
  const {
    isLoading,
    isRefreshing,
    dataStreams: visualizedDataStreams,
    thresholds,
    utilizedViewport,
    visibleData,
  } = useVisualizedDataStreams(timeSeriesQueries, viewport);

  const alarms = useChartAlarms({
    queries,
    viewport: utilizedViewport,
  });

  const dataStreams = useNormalizedDataStreams({
    dataStreams: visualizedDataStreams,
    alarms,
  });

  //handle dataZoom updates, which are dependent on user events and viewportInMS changes
  useDataZoom(chartRef, utilizedViewport);

  const isBottomAligned = options.legend?.position === 'bottom';

  // Setup resize container and calculate size for echarts
  const {
    chartWidth,
    chartHeight,
    rightLegendWidth,
    rightLegendHeight,
    leftLegendWidth,
    onResize,
    onResizeEnd,
    minConstraints,
    maxConstraints,
    leftLegendRef,
  } = useResizeableEChart(
    chartRef,
    size,
    options.legend,
    isBottomAligned,
    onChartOptionsChange
  );

  const adjustedChartHeight = getAdjustedChartHeight(
    !!options.titleText,
    chartHeight
  );
  const getTimeStampWidth = () => {
    const timestampWidth =
      chartWidth + leftLegendWidth - TIMESTAMP_WIDTH_FACTOR_BOTTOM;

    if (isLegendVisible) {
      return isLegendPositionBottom
        ? timestampWidth
        : chartWidth + leftLegendWidth - TIMESTAMP_WIDTH_FACTOR;
    }
    return timestampWidth;
  };

  const timestampStyle = {
    width: getTimeStampWidth(),
    ...(isLegendVisible &&
      isLegendPositionLeft && { marginLeft: spaceStaticL }),
    top: chartHeight - TIMESTAMP_HEIGHT_FACTOR_BOTTOM,
  };

  const { dataStreamMetaData } = useChartConfiguration(chartRef, {
    showBadDataIcons,
    showUncertainDataIcons,
    showAlarmIcons,
    group,
    isLoading,
    dataStreams,
    alarms,
    thresholds,
    visibleData,
    chartWidth,
    gestures,
    timeZone,
    ...options,
  });

  const delayLoading = useIsRefreshing(isRefreshing, REFRESHING_DELAY_MS);
  const isPropertiesRefreshing = !isLoading && delayLoading;

  useChartDataset(chartRef, dataStreams);

  useChartStoreDataStreamsSync(dataStreamMetaData);

  // handle chart event updates
  const { chartEventsKeyMap, chartEventsHandlers } =
    useHandleChartEvents(chartRef);

  const hotKeyMap = gestures
    ? {
        ...chartEventsKeyMap,
      }
    : {};

  const hotKeyHandlers = gestures
    ? {
        ...chartEventsHandlers,
      }
    : {};

  const handleMouseDown = (e: MouseEvent) => {
    const target = e.target;

    /* Condition to check localName of Canvas to stop onMouseDouwn event
      propagation to fix widget dragging or moving issue while panning on chart */
    if (target instanceof Element && target.localName === 'canvas') {
      e.stopPropagation();
    }
  };
  const setHandles = (position: string): ResizeHandle[] => {
    switch (position) {
      case 'left':
      case 'bottom':
        return ['sw'];
      default:
        return ['se'];
    }
  };

  const legendResizerStyle = () => {
    const borderThin = `1px solid ${colorBorderDividerSecondary}`;
    const borderThick = `2px solid ${colorBorderDividerSecondary}`;
    if (isLegendPositionBottom) {
      return {
        borderTop: borderThick,
        borderBottom: borderThin,
      };
    }
    if (isLegendPositionLeft) {
      return {
        borderLeft: borderThin,
        borderRight: borderThick,
      };
    }
    return {
      borderLeft: borderThick,
      borderRight: borderThin,
    };
  };

  const handleSelection = useCallback(
    (selectedItems: DataStreamInformation[]) => {
      if (options.id && options.assistant) {
        const contexts = [];

        selectedItems
          .filter((alarmItem) => !!alarmItem.assetId && !!alarmItem.alarmName)
          .forEach((alarmItem) => {
            contexts.push({
              timerange: convertToSupportedTimeRange(
                viewportStartDate(utilizedViewport),
                viewportEndDate(utilizedViewport)
              ),
              assetId: alarmItem.assetId,
              alarmName: alarmItem.alarmName,
            });
          });

        const selectedQueries = getSelectedQueriesAndProperties(
          timeSeriesQueries,
          selectedItems.map((item) => item.refId ?? '')
        );
        contexts.push(
          transformTimeseriesDataToAssistantContext({
            start: viewportStartDate(utilizedViewport),
            end: viewportEndDate(utilizedViewport),
            queries: selectedQueries,
          })
        );

        setContextByComponent(options.assistant.componentId, contexts);

        if (options.assistant.onAction) {
          options.assistant.onAction({
            type: 'selection',
            sourceComponentId: options.assistant.componentId,
            sourceComponentType: 'chart',
            selectedProperties: selectedItems.length,
          });
        }
      }
      setSelectedItems(selectedItems);
    },
    [
      options.id,
      options.assistant,
      setSelectedItems,
      setContextByComponent,
      transformTimeseriesDataToAssistantContext,
      timeSeriesQueries,
      utilizedViewport,
    ]
  );

  const assistantSelection = useMemo(() => {
    if (options.assistant && options.assistant?.enabled) {
      return {
        assistant: options.assistant,
        setSelectedItems: handleSelection,
        selectedItems,
        selectionType: 'multi' as TableProps.SelectionType,
      };
    } else {
      return {};
    }
  }, [options.assistant, selectedItems, handleSelection]);

  return (
    <div className='base-chart-wrapper'>
      <div
        className={`base-chart-container ${options.legend?.position}-position`}
        data-testid='base-chart-container'
      >
        <div className='base-chart-container-element'>
          <Resizable
            height={chartHeight}
            width={chartWidth}
            onResize={onResize}
            axis={`${isBottomAligned ? 'y' : 'x'}`}
            minConstraints={minConstraints}
            maxConstraints={maxConstraints}
            handle={
              <span
                className={
                  options.legend?.visible
                    ? 'react-resizable-handle react-resizable-handle-se'
                    : ''
                }
                style={options.legend?.visible ? legendResizerStyle() : {}}
                data-gesture='resize'
              />
            }
            onResizeStart={(e: React.SyntheticEvent) => e.stopPropagation()}
            onResizeStop={onResizeEnd}
            resizeHandles={[...setHandles(options.legend?.position || 'right')]}
          >
            <HotKeys
              keyMap={hotKeyMap}
              handlers={hotKeyHandlers}
              className='chart-rightlegend-container'
              style={{
                paddingBottom: isLegendPositionBottom ? `${spaceStaticM}` : 0,
              }}
            >
              <div className='base-chart-left-legend' ref={leftLegendRef}>
                <MultiYAxisLegend
                  datastreams={dataStreams}
                  height={adjustedChartHeight}
                />
              </div>
              <div>
                <Title
                  text={options.titleText}
                  style={{ paddingLeft: '0.5rem' }}
                />
                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                <div
                  ref={ref}
                  onMouseDown={handleMouseDown}
                  className='base-chart-element'
                  style={{
                    height: adjustedChartHeight,
                    width: chartWidth,
                  }}
                />
              </div>
              <PreferencesModalToggle onShow={onShowDataQualityPreferences} />
              <ChartPreferencesModal
                onHide={onHideDataQualityPreferences}
                visible={dataQualityPreferencesVisible}
                showBadDataIcons={showBadDataIcons}
                showUncertainDataIcons={showUncertainDataIcons}
                onChangeShowBadDataIcons={handleChangeBadDataIconsVisibility}
                onChangeShowUncertainDataIcons={
                  handleChangeUncertainDataIconsVisibility
                }
                showAlarmIcons={showAlarmIcons}
                onChangeShowAlarmIcons={handleChangeAlarmIconsVisibility}
              />
              {/*TODO: should not show when in dashboard */}
              <ChartContextMenu
                targetTrigger={ref}
                options={[
                  {
                    label: 'Add trend cursor',
                    action: (offsetX) => handleAddTrendCursor(offsetX),
                    disabled: trendCursors.length > 4,
                  },
                  {
                    label: 'Copy trend cursor',
                    action: (offsetX) => handleCopyTrendCursor(offsetX),
                    disabled: trendCursors.length === 0,
                  },
                  {
                    label: 'Delete trend cursor',
                    action: (offsetX) => handleDeleteTrendCursor(offsetX),
                    disabled: trendCursors.length === 0,
                  },
                ]}
              />
            </HotKeys>
          </Resizable>
          <Timestamp
            isLoading={isPropertiesRefreshing}
            showLoadingIndicator={true}
            styleProps={timestampStyle}
            viewport={utilizedViewport}
          />
        </div>
        {options.legend?.visible && (
          <div
            style={{
              height: rightLegendHeight,
              width: rightLegendWidth,
            }}
          >
            <Legend
              {...options.legend}
              chartId={options.id}
              datastreams={dataStreamMetaData}
              trendCursors={trendCursors}
              trendCursorValues={trendCursorValues}
              width={rightLegendWidth.toString()}
              significantDigits={options.significantDigits}
              {...assistantSelection}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BaseChart;

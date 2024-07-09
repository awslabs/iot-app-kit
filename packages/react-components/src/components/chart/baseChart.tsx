import React from 'react';
import type { MouseEvent } from 'react';
import {
  colorBorderDividerSecondary,
  spaceStaticL,
  spaceStaticM,
} from '@cloudscape-design/design-tokens';

import { useECharts, useResizeableEChart } from '../../hooks/useECharts';
import { ChartOptions } from './types';
import { useVisualizedDataStreams } from './hooks/useVisualizedDataStreams';
import { HotKeys } from 'react-hotkeys';
import { Resizable, ResizeHandle } from 'react-resizable';
import Legend from './legend/table';
import ChartContextMenu from './contextMenu/ChartContextMenu';
import { MultiYAxisLegend } from './multiYAxis/multiYAxis';
import { useDataZoom } from './hooks/useDataZoom';
import { useViewport } from '../../hooks/useViewport';
import { useHandleChartEvents } from './events/useHandleChartEvents';
import { useChartDataset } from './chartOptions/useChartDataset';
import { useChartConfiguration } from './chartOptions/useChartConfiguration';

import './chart.css';
import { useTrendCursors } from '../../echarts/extensions/trendCursors';
import { useChartStoreDataStreamsSync } from './hooks/useChartStoreDataStreamsSync';
import useIsRefreshing from './hooks/useIsrefreshing';
import {
  REFRESHING_DELAY_MS,
  TIMESTAMP_HEIGHT_FACTOR_BOTTOM,
  TIMESTAMP_WIDTH_FACTOR,
  TIMESTAMP_WIDTH_FACTOR_BOTTOM,
} from './eChartsConstants';
import { DataQualityPreferencesModal } from './preferences/dataQualityModal';
import { useModalVisibility } from '../../hooks/useModalVisibility/useModalVisibility';
import { PreferencesModalToggle } from './preferences/toggle';
import { useDataQuality } from './hooks/useDataQuality';
import { Timestamp } from '../timestampBar';

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
  ...options
}: ChartOptions) => {
  const {
    visible: dataQualityPreferencesVisible,
    onHide: onHideDataQualityPreferences,
    onShow: onShowDataQualityPreferences,
  } = useModalVisibility();
  const {
    showBadDataIcons,
    showUncertainDataIcons,
    handleChangeBadDataIconsVisibility,
    handleChangeUncertainDataIconsVisibility,
  } = useDataQuality({ ...options.dataQuality, onChartOptionsChange });

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
  const {
    isLoading,
    isRefreshing,
    dataStreams,
    thresholds,
    utilizedViewport,
    visibleData,
  } = useVisualizedDataStreams(queries, viewport);

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
    group,
    isLoading,
    dataStreams,
    thresholds,
    visibleData,
    chartWidth,
    gestures,
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

  return (
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
          onResizeStart={(e) => e.stopPropagation()}
          onResizeStop={(e) => e.stopPropagation()}
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
                height={chartHeight}
              />
            </div>
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div
              ref={ref}
              onMouseDown={handleMouseDown}
              className='base-chart-element'
              style={{
                height: chartHeight,
                width: chartWidth,
              }}
            />
            <PreferencesModalToggle onShow={onShowDataQualityPreferences} />
            <DataQualityPreferencesModal
              onHide={onHideDataQualityPreferences}
              visible={dataQualityPreferencesVisible}
              showBadDataIcons={showBadDataIcons}
              showUncertainDataIcons={showUncertainDataIcons}
              onChangeShowBadDataIcons={handleChangeBadDataIconsVisibility}
              onChangeShowUncertainDataIcons={
                handleChangeUncertainDataIconsVisibility
              }
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
          />
        </div>
      )}
    </div>
  );
};

export default BaseChart;

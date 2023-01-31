import {
  DataPoint,
  DataStream,
  Primitive,
  ProviderWithViewport,
  TimeSeriesData,
} from '../../utils/dataTypes';
import { streamPairs } from '../../utils/streamPairs';
import { WidgetGridProps } from './types';
import { parseDuration } from '../../utils/time';
import { useEffect, useState } from 'react';
import React from 'react';
import { DATA_ALIGNMENT } from '../common/constants';
import { ActivePoint, activePoints } from '../charts/webgl-base-chart/activePoints';
import { breachedThreshold } from '../charts/common/annotations/breachedThreshold';
import { getThresholds } from '../charts/common/annotations/utils';
import { isMinimalStaticViewport } from '../../utils/predicates';
import { Threshold } from '../charts/common/types';
import { viewportEndDate, viewportStartDate } from '@iot-app-kit/core';
import { buildProvider } from '../../utils/buildProvider';

/**
 * A generic parent container which can be utilized to construct a variety of 'grid-like' components.
 *
 * This component allows construction of widgets, by simply constructing the display cell via the `renderCell` method.gt
 */

export const WidgetGrid: React.FC<WidgetGridProps> = ({
  renderCell,
  queries,
  settings,
  collapseVertically,
  labelsConfig,
  viewport,
  dataStreams,
  annotations,
  isEditing,
  messageOverrides,
  widgetId,
}) => {


  /**
   * On view port date range change, this component emits a `dateRangeChange` event.
   * This allows other data visualization components to sync to the same date range.
   */

  const [start] = useState<Date>(viewportStartDate(viewport));
  const [end] = useState<Date>(viewportEndDate(viewport));
  const [duration] = useState<number | undefined>(

    !isMinimalStaticViewport(viewport) ? parseDuration(viewport.duration) : undefined
  );
  const [provider, setProvider] = useState<ProviderWithViewport<TimeSeriesData[]>>();


  const getBreachedThreshold = (point: DataPoint | undefined, dataStream: DataStream): Threshold | undefined =>
    breachedThreshold({
      value: point && point.y,
      date: isMinimalStaticViewport(viewport) ? new Date(viewport.end) : new Date(),
      dataStreams: dataStreams,
      dataStream,
      thresholds: getThresholds(annotations),
    });

  const getPoints = (): ActivePoint<Primitive>[] =>
    activePoints({
      viewport: {
        start: start,
        end: end,
      },
      dataStreams: dataStreams,
      selectedDate: end,
      allowMultipleDates: true,
      dataAlignment: DATA_ALIGNMENT.EITHER,
    });

  const isEnabled = duration != null;

  const points = getPoints();
  const pairs = streamPairs(dataStreams);

  const isMiniVersion = pairs.length > 1;

  useEffect(() => {
    console.info('widget effect', queries, provider)

    if (queries.length > 0) {
      const newProvider = buildProvider(queries, settings, viewport, widgetId);

      setProvider(newProvider);
    }

    return () => {
      console.info('STATUS UNMOUNT', provider);
      provider?.unsubscribe();
    }

  }, [queries, settings, viewport]);

  // console.info('WidgetGrid', dataStreams, pairs)
  return (
    <div className={ collapseVertically ? '' : 'tall' }>
      <div className="grid-wrapper">
        <div className="grid">
          {pairs.map(({ alarm, property }) => {
            const stream = alarm || property;
            if (stream == null) {
              return undefined;
            }

            const alarmPointWrapper = alarm && points.find(p => p.streamId === alarm.id);
            const propertyPointWrapper = property && points.find(p => p.streamId === property.id);
            const alarmPoint = alarmPointWrapper ? alarmPointWrapper.point : undefined;
            const propertyPoint = propertyPointWrapper ? propertyPointWrapper.point : undefined;

            const pointToEvaluateOn = alarmPoint || propertyPoint;
            const infoToEvaluateOn = alarm || property;
            const threshold =
              pointToEvaluateOn && infoToEvaluateOn && getBreachedThreshold(pointToEvaluateOn, infoToEvaluateOn);

            const alarmStream: DataStream<Primitive> | undefined = alarm && dataStreams.find(s => s.id === alarm.id);
            const primaryStream = alarm ? alarmStream : property;

            return (
              <>
                {renderCell({
                  isEnabled,
                  trendStream: property,
                  propertyStream: property,
                  propertyPoint,
                  alarmStream,
                  alarmPoint,
                  breachedThreshold: threshold,
                  isEditing: isEditing,
                  viewport: { start: start, end: end },
                  miniVersion: isMiniVersion,
                  messageOverrides: messageOverrides,
                  labelsConfig: labelsConfig,
                  icon: threshold ? threshold.icon : undefined,
                  valueColor: threshold ? threshold.color : undefined,
                  error: primaryStream ? primaryStream.error : undefined,
                  isLoading: primaryStream ? primaryStream.isLoading || false : false,
                  isRefreshing: primaryStream ? primaryStream.isRefreshing || false : false,
                })}
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}

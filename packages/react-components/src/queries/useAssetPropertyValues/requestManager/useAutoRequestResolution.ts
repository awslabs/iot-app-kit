import { parseDuration } from '@iot-app-kit/core';
import {
  IntervalTransformer,
  Viewport,
  getViewportType,
} from '../../useTimeSeriesData';
import {
  AssetPropertyAggregatesRequest,
  AssetPropertyValueHistoryRequest,
  AssetPropertyValuesRequest,
} from '../types';
import { AggregateType } from '@aws-sdk/client-iotsitewise';
import { useMemo } from 'react';

const hasResolution = (
  request: AssetPropertyValuesRequest
): request is AssetPropertyAggregatesRequest => {
  return 'resolution' in request && request.resolution != null;
};

const hasAggregates = (
  request: AssetPropertyValuesRequest
): request is AssetPropertyAggregatesRequest => {
  return 'aggregateTypes' in request && request.aggregateTypes != null;
};

type ResolutionConfiguration = {
  resolution: string;
  duration: number;
};

export const DEFAULT_RESOLUTION_CONFIGURATIONS: ResolutionConfiguration[] = [
  {
    resolution: '0',
    duration: parseDuration('15m'),
  },
  {
    resolution: '1m',
    duration: parseDuration('15h'),
  },
  {
    resolution: '1h',
    duration: parseDuration('60d'),
  },
  {
    resolution: '1d',
    duration: Infinity,
  },
];

type UseAutoRequestResolutionOptions = {
  requests: AssetPropertyValueHistoryRequest[];
  viewport: Viewport;
  resolutionConfigurations?: ResolutionConfiguration[];
};

export const useAutoRequestResolution = ({
  requests,
  viewport,
  resolutionConfigurations = DEFAULT_RESOLUTION_CONFIGURATIONS,
}: UseAutoRequestResolutionOptions) => {
  return useMemo(() => {
    const sortedResolutionConfgurations = resolutionConfigurations.sort(
      (a, b) => a.duration - b.duration
    );

    const intervalTransformer = new IntervalTransformer({
      now: Date.now(),
      viewportType: getViewportType(viewport),
    });
    const interval = intervalTransformer.toInterval(viewport);
    const intervalDuration = interval.end.getTime() - interval.start.getTime();

    return requests.map((request) => {
      if (hasResolution(request)) return request;

      const resolutionConfiguration = sortedResolutionConfgurations.find(
        (configuration) => {
          return intervalDuration <= configuration.duration;
        }
      );

      const resolution = resolutionConfiguration?.resolution;
      const aggregateTypes = hasAggregates(request)
        ? request.aggregateTypes
        : [AggregateType.AVERAGE];

      if (resolution === '0') return request;

      return {
        ...request,
        resolution,
        aggregateTypes,
      };
    });
  }, [requests, viewport, resolutionConfigurations]);
};

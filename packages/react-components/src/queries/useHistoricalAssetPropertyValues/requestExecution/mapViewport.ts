import {
  type Viewport,
  viewportEndDate,
  viewportStartDate,
} from '@iot-app-kit/core';
import { type FetchMode } from '../types';
import { SITEWISE_PREVIEW_DATE } from '../../useAssetPropertyValues/utils/timeConstants';

export const mapViewport = ({
  viewport,
  fetchMode,
}: {
  viewport?: Viewport;
  fetchMode?: FetchMode;
}) => {
  if (!viewport) {
    return {
      startDate: undefined,
      endDate: undefined,
    };
  }

  if (fetchMode === 'MOST_RECENT_BEFORE_START') {
    return {
      startDate: SITEWISE_PREVIEW_DATE,
      endDate: viewportStartDate(viewport),
    };
  } else if (fetchMode === 'MOST_RECENT_BEFORE_END') {
    return {
      startDate: SITEWISE_PREVIEW_DATE,
      endDate: viewportEndDate(viewport),
    };
  }

  return {
    startDate: viewportStartDate(viewport),
    endDate: viewportEndDate(viewport),
  };
};

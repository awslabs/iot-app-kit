import { DataStreamInfo } from '@synchro-charts/core';
import { DataStreamQuery } from '../../data-module/types';

/**
 * Learn more about AWS IoT SiteWise assets at https://docs.aws.amazon.com/iot-sitewise/latest/userguide/industrial-asset-models.html
 */

// Temporary query which matches the current query structure (DataStreamInfo) used within SiteWise Monitor.
/** @deprecated */
export interface SiteWiseLegacyDataStreamQuery extends DataStreamQuery {
  source: 'site-wise-legacy';
  dataStreamInfos: DataStreamInfo[];
}

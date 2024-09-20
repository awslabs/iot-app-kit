import React, { useState } from 'react';

import { Button, ButtonProps } from '@cloudscape-design/components';

import { unparse } from 'papaparse';
import { StyledSiteWiseQueryConfig } from '~/customization/widgets/types';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { useFetchTimeSeriesData } from '../dashboard/queryContext';
import { useViewport } from '@iot-app-kit/react-components';
import { assetModelQueryToSiteWiseAssetQuery } from '~/customization/widgets/utils/assetModelQueryToAssetQuery';
import { convertToCSVObject } from './convertToCSVObject';
import { useQueryClient } from '@tanstack/react-query';
import { fetchListAssetPropertiesMap } from '~/data/listAssetPropertiesMap/fetchListAssetPropertiesMap';
import {
  BAR_CHART_RESOLUTIONS,
  DEFAULT_VIEWPORT,
  EMPTY_DATA,
} from './constants';
import { convertViewportToHistoricalViewport } from '../util/dateTimeUtil';

export const canOnlyDownloadLiveMode: readonly string[] = [
  'table',
  'kpi',
  'gauge',
  'status',
  'text',
];

export const isQueryEmpty = (queryConfig: StyledSiteWiseQueryConfig) => {
  const query = queryConfig.query;
  return (
    !query?.assets?.length &&
    !query?.properties?.length &&
    !query?.assetModels?.length
  );
};

export const CSVDownloadButton = ({
  queryConfig,
  fileName,
  client,
  widgetType,
  ...rest
}: {
  queryConfig: StyledSiteWiseQueryConfig;
  client: IoTSiteWiseClient;
  widgetType: string;
  fileName?: string;
} & ButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const queryClient = useQueryClient();
  const fetchTimeSeriesData = useFetchTimeSeriesData();

  const { viewport: injectedViewport } = useViewport();
  const viewport = injectedViewport || DEFAULT_VIEWPORT;

  const onClickDownload = async () => {
    setIsDownloading(true);

    const requestDateMS = Date.now();

    // get asset properties for modeled data
    const listAssetPropertiesMap = await fetchListAssetPropertiesMap(
      queryConfig.query,
      queryClient,
      client
    );

    // calculate viewport to request data for
    const calculatedViewport = convertViewportToHistoricalViewport(
      viewport,
      requestDateMS
    );

    const isViewportInFuture =
      calculatedViewport.start.getTime() > requestDateMS &&
      calculatedViewport.end.getTime() > requestDateMS;

    // since fetchTimeSeriesData is async it'll wait for future viewports to be in cache
    // to avoid this, if viewport is in the future we dont request time series data
    const { assetModels = [], assets = [] } = queryConfig.query ?? {};
    const combinedAssets = assetModelQueryToSiteWiseAssetQuery({
      assetModels,
      assets,
    });
    const dataStreams = isViewportInFuture
      ? []
      : await fetchTimeSeriesData({
          query: {
            ...queryConfig.query,
            assets: combinedAssets,
          },
          viewport: calculatedViewport,
          // since bar chart doesnt do raw data we need to pass a custom resolution mapping to handle auto select resolution mode
          settings:
            widgetType === 'bar-chart'
              ? { resolution: BAR_CHART_RESOLUTIONS }
              : undefined,
        });

    // convert dataStreams into the CSV Objects we want in CSV file
    const { data, hasError } = await convertToCSVObject({
      dataStreams,
      client,
      queryConfig,
      viewport: calculatedViewport,
      listAssetPropertiesMap: listAssetPropertiesMap ?? {},
    });

    setIsDownloading(false);

    if (hasError) {
      hasError && console.error('Unable to download CSV data');
      setIsDownloading(false);
      return;
    }

    // create file with unparsed CSV data
    const stringCSVData =
      data.length === 0 ? unparse(EMPTY_DATA) : unparse(data);
    const file = new Blob([stringCSVData], { type: 'text/csv' });

    // create Anchor element with a download attribute, click on it, and then delete it
    const element = document.createElement('a');
    element.href = URL.createObjectURL(file);
    const requestDateString = new Date(requestDateMS).toISOString();
    element.download = `${fileName} ${requestDateString}.csv`.replace(
      / /g,
      '_'
    );
    document.body.appendChild(element); // required for this to work in firefox
    element.click();
    element.remove();
    setIsDownloading(false);
  };

  const isEmptyQuery = isQueryEmpty(queryConfig);
  const cannotDownload = canOnlyDownloadLiveMode.some((t) => t === widgetType);

  if (isEmptyQuery || cannotDownload) return <></>;

  return (
    <Button
      ariaLabel='download CSV'
      iconName='download'
      loading={isDownloading}
      variant='icon'
      onClick={onClickDownload}
      data-testid='csv-download-button'
      {...rest}
    />
  );
};

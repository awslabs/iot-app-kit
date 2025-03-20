import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import Button, { type ButtonProps } from '@cloudscape-design/components/button';
import { useViewport } from '@iot-app-kit/react-components';
import { unparse } from 'papaparse';
import { useState } from 'react';
import { fetchListAssetPropertiesMap } from '~/components/csvDownloadButton/fetchListAssetPropertiesMap';
import { queryClient } from '~/data/query-client';
import { useFetchTimeSeriesData } from '~/features/queries/query-context';
import { convertViewportToHistoricalViewport } from '~/helpers/dateTimeUtil';
import { convertToCSVObject } from './convertToCSVObject';
import {
  BAR_CHART_RESOLUTIONS,
  DEFAULT_VIEWPORT,
  EMPTY_DATA,
} from './constants';
import { assetModelQueryToSiteWiseAssetQuery } from '~/features/queries/transform-asset-model-query';
import { type SiteWiseQueryConfig } from '~/features/queries/queries';

export const canOnlyDownloadLiveMode: readonly string[] = [
  'table',
  'kpi',
  'gauge',
  'status',
];

export const isQueryEmpty = (query: SiteWiseQueryConfig['query']) => {
  return (
    !query?.assets?.length &&
    !query?.properties?.length &&
    !query?.assetModels?.length
  );
};

export interface CSVDownloadButtonProps extends ButtonProps {
  queryConfig: SiteWiseQueryConfig | undefined;
  client: IoTSiteWiseClient;
  widgetType: string;
  fileName?: string;
}

export const CSVDownloadButton = ({
  queryConfig,
  fileName,
  client,
  widgetType,
  ...rest
}: CSVDownloadButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const fetchTimeSeriesData = useFetchTimeSeriesData();

  const { viewport: injectedViewport } = useViewport();
  const viewport = injectedViewport || DEFAULT_VIEWPORT;

  const onClickDownload = async () => {
    setIsDownloading(true);

    const requestDateMS = Date.now();

    // get asset properties for modeled data
    const listAssetPropertiesMap = await fetchListAssetPropertiesMap(
      queryConfig,
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
    // to avoid this, if viewport is in the future we don't request time series data
    const { assetModels = [], assets = [] } = queryConfig?.query ?? {};
    const combinedAssets = assetModelQueryToSiteWiseAssetQuery({
      assetModels,
      assets,
    });
    const dataStreams = isViewportInFuture
      ? []
      : await fetchTimeSeriesData({
          query: {
            ...queryConfig?.query,
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

  const isEmptyQuery = isQueryEmpty(queryConfig?.query);
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

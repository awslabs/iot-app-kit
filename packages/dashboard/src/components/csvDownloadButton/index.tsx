import React, { useState } from 'react';

import { Button, ButtonProps } from '@cloudscape-design/components';

import { unparse } from 'papaparse';
import { StyledSiteWiseQueryConfig } from '~/customization/widgets/types';
import { useViewportData } from '~/components/csvDownloadButton/useViewportData';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

const EMPTY_DATA = [
  {
    timestamp: '',
    dataQuality: '',
    value: '',
    unit: '',
    aggregationType: '',
    resolution: '',
    propertyName: '',
    assetName: '',
    propertyAlias: '',
    assetId: '',
    dataType: '',
    dataTypeSpec: '',
    propertyId: '',
  },
];

const isQueryEmpty = (queryConfig: StyledSiteWiseQueryConfig) => {
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
  ...rest
}: {
  queryConfig: StyledSiteWiseQueryConfig;
  client: IoTSiteWiseClient;
  fileName: string;
} & ButtonProps) => {
  const { fetchViewportData } = useViewportData({ queryConfig, client });
  const [isDownloading, setIsDownloading] = useState(false);

  const onClickDownload = async () => {
    setIsDownloading(true);
    const requestDateMS = Date.now();
    const requestDateString = new Date(requestDateMS).toISOString();

    const { data, isError } = await fetchViewportData(requestDateMS);

    if (isError || !data) {
      isError && console.error('Unable to download CSV data');
      setIsDownloading(false);
      return;
    }

    const stringCSVData =
      data.length === 0 ? unparse(EMPTY_DATA) : unparse(data);
    const file = new Blob([stringCSVData], { type: 'text/csv' });

    // create Anchor element with download attribute, click on it, and then delete it
    const element = document.createElement('a');
    element.href = URL.createObjectURL(file);
    element.download = `${fileName} ${requestDateString}.csv`;
    document.body.appendChild(element); // required for this to work in firefox
    element.click();
    element.remove();
    setIsDownloading(false);
  };

  const isEmptyQuery = isQueryEmpty(queryConfig);

  if (isEmptyQuery) return <></>;

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

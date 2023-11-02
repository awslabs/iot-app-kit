import React from 'react';

import { Button, ButtonProps } from '@cloudscape-design/components';

import { unparse } from 'papaparse';
import { StyledSiteWiseQueryConfig } from '~/customization/widgets/types';
import { useViewportData } from '~/components/csvDownloadButton/useViewportData';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

const CSVDownloadButton = ({
  queryConfig,
  fileName,
  client,
  ...rest
}: { queryConfig: StyledSiteWiseQueryConfig; client: IoTSiteWiseClient; fileName: string } & ButtonProps) => {
  const { fetchViewportData } = useViewportData({ queryConfig, client });

  const onClickDownload = () => {
    const requestDateMS = Date.now();
    const requestDateString = new Date(requestDateMS).toISOString();

    const data = fetchViewportData(requestDateMS);
    const stringCSVData = unparse(data);

    const file = new Blob([stringCSVData], { type: 'text/csv' });

    // create Anchor element with download attribute, click on it, and then delete it
    const element = document.createElement('a');
    element.href = URL.createObjectURL(file);
    element.download = `${fileName} ${requestDateString}.csv`;
    document.body.appendChild(element); // required for this to work in firefox
    element.click();
    element.remove();
  };

  return (
    <Button iconName='download' variant='icon' onClick={onClickDownload} data-testid='custom-orange-button' {...rest} />
  );
};

export default CSVDownloadButton;

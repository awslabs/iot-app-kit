import React from 'react';

import { Button, ButtonProps } from '@cloudscape-design/components';

import { unparse } from 'papaparse';
import { StyledSiteWiseQueryConfig } from '~/customization/widgets/types';
import { useViewportData } from '~/components/csvDownloadButton/useViewportData';

const CSVDownloadButton = ({
  queryConfig,
  fileName,
  ...rest
}: { queryConfig: StyledSiteWiseQueryConfig; fileName: string } & ButtonProps) => {
  const { fetchViewportData } = useViewportData({ queryConfig });

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

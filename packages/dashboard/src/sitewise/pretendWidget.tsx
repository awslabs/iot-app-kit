import React from 'react';

import { useClients } from '~/components/dashboard/clientContext';
import { useLiveDataStreams } from './useDataStreams';
import { useTimeSeriesData } from './initialize';

/*
const assetIds = [
  '08941c16-7ec0-4844-bd7b-a87a2b392c3e',
  '0f926ba0-6474-43f5-9ec5-5728d90be0a7',
  '7d84d7fe-f63b-488e-9ced-3052985090d0',
  '517b74db-5824-4c62-83bb-dd59b9f5bf44',
];
const propertyIds = [
  '1623e766-781b-496a-a44c-502fea19e6a3',
  'c8b4a92e-4f55-4441-927c-1e655ad86aca',
  '0b4fa649-3015-480a-a7c4-a3c8a332e02f',
  '66c38b09-792b-4e8b-bfb2-8c5a8bb59b38',
  '217bdd91-290e-4296-8663-9d96360d4bb9',
  'd0a334fd-f16b-4c34-a8fa-c623903e1102',
];
*/

export function PretendWidget() {
  const { iotSiteWiseClient } = useClients();

  if (!iotSiteWiseClient) {
    return null;
  }

  return (
    <div>
      <PretendDashboard />
    </div>
  );
}

function PretendDashboard() {
  const { iotSiteWiseClient } = useClients();

  if (!iotSiteWiseClient) {
    return null;
  }

  useLiveDataStreams({
    dataStreams: [],
    client: iotSiteWiseClient,
  });

  return (
    <>
      <WidgetOne />
      <WidgetTwo />
      <WidgetThree />
      <WidgetFour />
    </>
  );
}

function WidgetOne() {
  const { dataStreams } = useTimeSeriesData({
    query: {
      assets: [
        {
          assetId: '08941c16-7ec0-4844-bd7b-a87a2b392c3e',
          properties: [
            { propertyId: '1623e766-781b-496a-a44c-502fea19e6a3' },
            { propertyId: 'c8b4a92e-4f55-4441-927c-1e655ad86aca' },
          ],
        },
      ],
    },
  });

  console.log(dataStreams);
}

function WidgetTwo() {
  const { dataStreams } = useTimeSeriesData({
    query: {
      assets: [
        {
          assetId: '0f926ba0-6474-43f5-9ec5-5728d90be0a7',
          properties: [
            { propertyId: '1623e766-781b-496a-a44c-502fea19e6a3' },
            { propertyId: 'c8b4a92e-4f55-4441-927c-1e655ad86aca' },
          ],
        },
      ],
    },
  });
}

function WidgetThree() {
  const { dataStreams } = useTimeSeriesData({
    query: {
      assets: [
        {
          assetId: '7d84d7fe-f63b-488e-9ced-3052985090d0',
          properties: [
            { propertyId: '1623e766-781b-496a-a44c-502fea19e6a3' },
            { propertyId: 'c8b4a92e-4f55-4441-927c-1e655ad86aca' },
          ],
        },
      ],
    },
  });
}

function WidgetFour() {
  const { dataStreams } = useTimeSeriesData({
    query: {
      assets: [
        {
          assetId: '517b74db-5824-4c62-83bb-dd59b9f5bf44',
          properties: [
            { propertyId: '1623e766-781b-496a-a44c-502fea19e6a3' },
            { propertyId: 'c8b4a92e-4f55-4441-927c-1e655ad86aca' },
          ],
        },
      ],
    },
  });
}

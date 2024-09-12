import React, { useEffect, useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import type { FC } from 'react';
import { getIotEventsClient, getSiteWiseClient } from '@iot-app-kit/core-util';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  queryClient,
  useDescribeAssetModelCompositeModel,
  useDescribeAssetProperty,
  useGetAssetPropertyValueHistory,
} from '../../src/queries';
import { getEnvCredentials, getRegion } from '../utils/query';
import { Viewport } from '@iot-app-kit/core';
import { sub } from 'date-fns';
import { useSiteWiseAnomalyDataSource } from '../../src/queries/useSiteWiseAnomalyDataSource';
import { TimeSelection, TimeSync, useViewport } from '../../src';
import { isDurationViewport } from '../../src/utils/isDurationViewport';
import { useLatestAssetPropertyValues } from '../../src/queries/useLatestAssetPropertyValues/useLatestAssetPropertyValues';
import { useHistoricalAssetPropertyValues } from '../../src/queries/useHistoricalAssetPropertyValues/useHistoricalAssetPropertyValues';
import { useAlarms } from '../../src/hooks/useAlarms';

const ASSET_MODEL_ID = '4c8e3da0-d3ec-4818-86b3-44a1e6b98531';
const ASSET_MODEL_COMPOSITE_MODEL_ID = 'a85b0fb2-b259-441c-aacc-d7d7495214f5';

const ASSET_ID = 'b1267cc2-feec-489a-a738-52b06f8777db';
const ASSET_COMPOSITE_MODEL_ID = 'a0bdbad9-a7ea-49c4-a2f4-c9e3bb3afb18';
const PROPERTY_ID = '3a985085-ea71-4ae6-9395-b65990f58a05';

const PREDICTION_DEFINITION_ID = 'a85b0fb2-b259-441c-aacc-d7d7495214f5';

const VIEWPORT: Viewport = {
  start: sub(Date.now(), { days: 7 }),
  end: new Date(),
};

const client = getSiteWiseClient({
  awsCredentials: getEnvCredentials(),
  awsRegion: getRegion(),
});

const iotEventsClient = getIotEventsClient({
  awsCredentials: getEnvCredentials(),
  awsRegion: getRegion(),
});

const RenderQueries = ({ json }: { json: unknown }) => {
  return (
    <div>
      <pre>{JSON.stringify(json, null, 2)}</pre>
    </div>
  );
};

export default {
  title: 'Queries',
  component: RenderQueries,
  argTypes: {},
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <ReactQueryDevtools client={queryClient} initialIsOpen={true} />
      </>
    ),
  ],
} as ComponentMeta<typeof RenderQueries>;

export const UseAlarms: ComponentStory<FC> = () => {
  const alarmDataList = useAlarms({
    iotSiteWiseClient: client,
    iotEventsClient,
    requests: [
      {
        assetId: ASSET_ID,
        assetCompositeModelId: ASSET_COMPOSITE_MODEL_ID,
      },
    ],
  });
  console.log(alarmDataList);

  return <RenderQueries json={alarmDataList} />;
};

export const HistoricalAssetPropertyValues: ComponentStory<FC> = () => {
  /**
   * Demo component to illustrate that batching works
   * across multiple hook usage no matter when
   * the hooks actually mount.
   */
  const [e2, setE2] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setE2(true);
    }, 6000);
  });

  const responses1 = useHistoricalAssetPropertyValues({
    iotSiteWiseClient: client,
    viewport: { duration: '10m' },
    requests: [
      {
        assetId: '8ca28842-687c-45ac-ac74-6db7cf61a80a',
        propertyId: 'b306e0cd-548d-4857-8c6d-9ec773420c6c',
      },
      {
        assetId: '8ca28842-687c-45ac-ac74-6db7cf61a80a',
        propertyId: 'b565acbd-bf96-4ce7-b5d3-d6822758619b',
      },
    ],
  });

  const responses2 = useHistoricalAssetPropertyValues({
    enabled: e2,
    iotSiteWiseClient: client,
    viewport: { duration: '10m' },
    requests: [
      {
        assetId: '8ca28842-687c-45ac-ac74-6db7cf61a80a',
        propertyId: '585838b3-d755-4dd5-89ed-2abfd0d0feca',
      },
      {
        assetId: '8ca28842-687c-45ac-ac74-6db7cf61a80a',
        propertyId: 'f7117764-6c45-447b-9caf-0876bb211e2f',
      },
    ],
  });

  console.log([...responses1, ...responses2].map((r) => r.data));

  return (
    <RenderQueries json={[...responses1, ...responses2].map((r) => r.data)} />
  );
};

export const LatestAssetPropertyValues: ComponentStory<FC> = () => {
  /**
   * Demo component to illustrate that batching works
   * across multiple hook usage no matter when
   * the hooks actually mount.
   */
  const [e2, setE2] = useState(false);
  const [e3, setE3] = useState(false);
  const [e4, setE4] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setE2(true);
    }, 6000);

    setTimeout(() => {
      setE3(true);
    }, 7500);

    setTimeout(() => {
      setE4(true);
    }, 9000);
  });

  const responses1 = useLatestAssetPropertyValues({
    iotSiteWiseClient: client,
    requests: [
      {
        assetId: '8ca28842-687c-45ac-ac74-6db7cf61a80a',
        propertyId: 'b306e0cd-548d-4857-8c6d-9ec773420c6c',
      },
      {
        assetId: '8ca28842-687c-45ac-ac74-6db7cf61a80a',
        propertyId: 'b565acbd-bf96-4ce7-b5d3-d6822758619b',
      },
    ],
  });

  const responses2 = useLatestAssetPropertyValues({
    enabled: e2,
    iotSiteWiseClient: client,
    requests: [
      {
        assetId: '8ca28842-687c-45ac-ac74-6db7cf61a80a',
        propertyId: '585838b3-d755-4dd5-89ed-2abfd0d0feca',
      },
      {
        assetId: '8ca28842-687c-45ac-ac74-6db7cf61a80a',
        propertyId: 'f7117764-6c45-447b-9caf-0876bb211e2f',
      },
    ],
  });

  const responses3 = useLatestAssetPropertyValues({
    enabled: e3,
    iotSiteWiseClient: client,
    requests: [
      {
        assetId: 'b97d68e1-dd8f-40e7-9ba5-cebe7168e27e',
        propertyId: 'b306e0cd-548d-4857-8c6d-9ec773420c6c',
      },
      {
        assetId: 'b97d68e1-dd8f-40e7-9ba5-cebe7168e27e',
        propertyId: 'b565acbd-bf96-4ce7-b5d3-d6822758619b',
      },
    ],
  });

  const responses4 = useLatestAssetPropertyValues({
    enabled: e4,
    refreshRate: 6000,
    iotSiteWiseClient: client,
    requests: [
      {
        assetId: 'b97d68e1-dd8f-40e7-9ba5-cebe7168e27e',
        propertyId: '585838b3-d755-4dd5-89ed-2abfd0d0feca',
      },
      {
        assetId: 'b97d68e1-dd8f-40e7-9ba5-cebe7168e27e',
        propertyId: 'f7117764-6c45-447b-9caf-0876bb211e2f',
      },
    ],
  });

  console.log(
    [...responses1, ...responses2, ...responses3, ...responses4].map(
      (r) => r.data
    )
  );

  return (
    <RenderQueries
      json={[...responses1, ...responses2, ...responses3, ...responses4].map(
        (r) => r.data
      )}
    />
  );
};

export const DescribeAssetModelCompositeModel: ComponentStory<FC> = () => {
  const { data } = useDescribeAssetModelCompositeModel({
    client,
    assetModelId: ASSET_MODEL_ID,
    assetModelCompositeModelId: ASSET_MODEL_COMPOSITE_MODEL_ID,
  });
  console.log(data);

  return <RenderQueries json={data} />;
};

export const GetAssetPropertyValueHistory: ComponentStory<FC> = () => {
  const { data } = useGetAssetPropertyValueHistory({
    client,
    assetId: ASSET_ID,
    propertyId: PROPERTY_ID,
    startDate: VIEWPORT.start,
    endDate: VIEWPORT.end,
    fetchAll: true,
  });
  console.log(data);

  return <RenderQueries json={data} />;
};

export const DescribeAssetProperty: ComponentStory<FC> = () => {
  // [\"49ed36c7-0b36-4151-bc45-f034a800cfea\",\"190e76b7-b4f9-4039-9522-2ef7952f1acc\"]
  const { data } = useDescribeAssetProperty({
    client,
    assetId: ASSET_ID,
    propertyId: '190e76b7-b4f9-4039-9522-2ef7952f1acc',
  });
  console.log(data);

  return <RenderQueries json={data} />;
};

const RenderL4EAnomalyQuery = () => {
  const { viewport: passedInViewport } = useViewport();
  const viewport =
    passedInViewport && isDurationViewport(passedInViewport)
      ? VIEWPORT
      : passedInViewport;

  const res = useSiteWiseAnomalyDataSource({
    client,
    viewport,
    assetId: ASSET_ID,
    predictionDefinitionId: PREDICTION_DEFINITION_ID,
  });

  console.log(res);
  return (
    <TimeSync>
      <RenderQueries json={res} />
    </TimeSync>
  );
};

export const SiteWiseL4EAnomaly: ComponentStory<FC> = () => {
  return (
    <TimeSync initialViewport={VIEWPORT}>
      <TimeSelection />
      <RenderL4EAnomalyQuery />
    </TimeSync>
  );
};

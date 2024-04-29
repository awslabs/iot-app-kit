import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import type { FC } from 'react';
import { getSiteWiseClient } from '@iot-app-kit/core-util';
import { QueryClientProvider } from '@tanstack/react-query';
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

const ASSET_MODEL_ID = '4c8e3da0-d3ec-4818-86b3-44a1e6b98531';
const ASSET_MODEL_COMPOSITE_MODEL_ID = 'a85b0fb2-b259-441c-aacc-d7d7495214f5';

const ASSET_ID = '4a89a6b3-4a85-4ece-a598-a1ca4661d466';
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
      <QueryClientProvider client={queryClient}>
        <Story />
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    ),
  ],
} as ComponentMeta<typeof RenderQueries>;

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

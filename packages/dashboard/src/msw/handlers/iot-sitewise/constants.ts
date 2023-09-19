import { AssetSummary, DescribeAssetResponse, AssetProperty, TimeSeriesSummary } from '@aws-sdk/client-iotsitewise';
import { v4 as uuid } from 'uuid';
import { DEFAULT_REGION } from '~/msw/constants';

export const SITEWISE_CONTROL_PLANE_API_BASE_URL = `https://api.iotsitewise.${DEFAULT_REGION}.amazonaws.com`;
export const SITEWISE_DATA_PLANE_API_BASE_URL = `https://data.iotsitewise.${DEFAULT_REGION}.amazonaws.com`;

function createUnmodeledTimeSeriesSummary(timeSeriesSummary: Partial<TimeSeriesSummary> = {}): TimeSeriesSummary {
  const timeSeriesId = uuid();

  return {
    timeSeriesArn:
      timeSeriesSummary.timeSeriesArn ?? `arn:aws:iotsitewise:us-west-2:000000000000:time-series/${timeSeriesId}`,
    timeSeriesId: timeSeriesSummary.timeSeriesId ?? timeSeriesId,
    alias: timeSeriesSummary.alias ?? 'Fake Time Series',
    dataType: timeSeriesSummary.dataType ?? 'DOUBLE',
    timeSeriesCreationDate: timeSeriesSummary.timeSeriesCreationDate ?? new Date(0),
    timeSeriesLastUpdateDate: timeSeriesSummary.timeSeriesLastUpdateDate ?? new Date(0),
  };
}

export const VIDEO_FEED_UNMODELED_TIME_SERIES_SUMMARY = createUnmodeledTimeSeriesSummary({
  alias: 'Video Feed',
  dataType: 'STRING',
});

export const AMBIENT_TEMPERATURE_UNMODELED_TIME_SERIES_SUMMARY = createUnmodeledTimeSeriesSummary({
  alias: 'Ambient Temperature',
  dataType: 'DOUBLE',
});

export const HUMIDITY_UNMODELED_TIME_SERIES_SUMMARY = createUnmodeledTimeSeriesSummary({
  alias: 'Humidity',
  dataType: 'DOUBLE',
});

export type AssetDescription = DescribeAssetResponse;

export function createAssetDescription(assetDescription: Partial<AssetDescription> = {}) {
  const assetId = uuid();

  return {
    assetModelId: assetDescription.assetModelId ?? uuid(),
    assetName: assetDescription.assetName ?? 'Fake Asset',
    assetId: assetDescription.assetId ?? assetId,
    assetProperties: assetDescription.assetProperties ?? [],
    assetCompositeModels: assetDescription.assetCompositeModels ?? [],
    assetArn:
      assetDescription.assetArn ??
      `arn:aws:iotsitewise:us-west-2:000000000000:asset/${assetDescription.assetId ?? assetId}`,
    assetHierarchies: assetDescription.assetHierarchies ?? [],
    assetCreationDate: assetDescription.assetCreationDate ?? (0 as unknown as Date),
    assetLastUpdateDate: assetDescription.assetLastUpdateDate ?? (0 as unknown as Date),
    assetStatus: assetDescription.assetStatus ?? {
      state: 'ACTIVE',
    },
  } as const satisfies AssetDescription;
}

function summarizeAssetDescription(assetDescription: AssetDescription) {
  return {
    assetModelId: assetDescription.assetModelId,
    id: assetDescription.assetId,
    name: assetDescription.assetName,
    arn: assetDescription.assetArn,
    status: assetDescription.assetStatus,
    hierarchies: assetDescription.assetHierarchies,
    creationDate: assetDescription.assetCreationDate,
    lastUpdateDate: assetDescription.assetLastUpdateDate,
  } as const satisfies AssetSummary;
}

const SITE_ASSET_MODEL_ID = uuid();
const REACTOR_ASSET_MODEL_ID = uuid();
const PRODUCTION_LINE_ASSET_MODEL_ID = uuid();
const STORAGE_TANK_ASSET_MODEL_ID = uuid();

export const AFRICA_SITE_ASSET_ID = uuid();
export const ANTARCTICA_SITE_ASSET_ID = uuid();
export const ASIA_SITE_ASSET_ID = uuid();
export const AUSTRALIA_SITE_ASSET_ID = uuid();
export const EUROPE_SITE_ASSET_ID = uuid();
export const NORTH_AMERICA_SITE_ASSET_ID = uuid();
export const SOUTH_AMERICA_SITE_ASSET_ID = uuid();

export const PRODUCTION_LINE_HIERARCHY = {
  id: uuid(),
  name: 'Production Line',
} as const;

export const REACTOR_HIERARCHY = {
  id: uuid(),
  name: 'Reactor',
} as const;

export const STORAGE_TANK_HIERARCHY = {
  id: uuid(),
  name: 'Storage Tank',
} as const;

export const COORDINATES_ASSET_PROPERTY = {
  name: 'Coordinates',
  id: uuid(),
  dataType: 'STRING',
} as const satisfies AssetProperty;

export const PRODUCTION_RATE_ASSET_PROPERTY = {
  name: 'Production Rate',
  id: uuid(),
  dataType: 'DOUBLE',
} as const;

function createSiteAssetDescription({ assetName, assetId }: Partial<AssetDescription>): AssetDescription {
  return createAssetDescription({
    assetName,
    assetId,
    assetModelId: SITE_ASSET_MODEL_ID,
    assetProperties: [COORDINATES_ASSET_PROPERTY, PRODUCTION_RATE_ASSET_PROPERTY],
    assetHierarchies: [PRODUCTION_LINE_HIERARCHY],
  });
}

export const AFRICA_SITE_ASSET_DESCRIPTION = createSiteAssetDescription({
  assetName: 'Africa Site',
  assetId: AFRICA_SITE_ASSET_ID,
});
export const AFRICA_SITE_ASSET_SUMMARY = summarizeAssetDescription(AFRICA_SITE_ASSET_DESCRIPTION);

export const AFRICA_PRODUCTION_LINE_1_ASSET_ID = uuid();
export const AFRICA_PRODUCTION_LINE_1_ASSET_DESCRIPTION = createAssetDescription({
  assetName: 'Africa Production Line 1',
  assetModelId: PRODUCTION_LINE_ASSET_MODEL_ID,
  assetId: AFRICA_PRODUCTION_LINE_1_ASSET_ID,
  assetHierarchies: [REACTOR_HIERARCHY, STORAGE_TANK_HIERARCHY],
});
export const AFRICA_PRODUCTION_LINE_1_ASSET_SUMMARY = summarizeAssetDescription(
  AFRICA_PRODUCTION_LINE_1_ASSET_DESCRIPTION
);

export const TEMPERATURE_ASSET_PROPERTY = {
  name: 'Temperature',
  id: uuid(),
  dataType: 'DOUBLE',
} as const;

export const MAX_TEMPERATURE_ASSET_PROPERTY = {
  name: 'Max Temperature',
  id: uuid(),
  dataType: 'DOUBLE',
} as const;

export const MIN_TEMPERATURE_ASSET_PROPERTY = {
  name: 'Min Temperature',
  id: uuid(),
  dataType: 'DOUBLE',
} as const;

export const PRESSURE_ASSET_PROPERTY = {
  name: 'Pressure',
  id: uuid(),
  dataType: 'DOUBLE',
} as const;

export const MAX_PRESSURE_ASSET_PROPERTY = {
  name: 'Max Pressure',
  id: uuid(),
  dataType: 'DOUBLE',
} as const;

export const MIN_PRESSURE_ASSET_PROPERTY = {
  name: 'Min Pressure',
  id: uuid(),
  dataType: 'DOUBLE',
} as const;

function createReactorAssetDescription({ assetName, assetId }: Partial<AssetDescription>): AssetDescription {
  return createAssetDescription({
    assetName,
    assetId,
    assetModelId: REACTOR_ASSET_MODEL_ID,
    assetProperties: [
      TEMPERATURE_ASSET_PROPERTY,
      MAX_TEMPERATURE_ASSET_PROPERTY,
      MIN_TEMPERATURE_ASSET_PROPERTY,
      PRESSURE_ASSET_PROPERTY,
      MAX_PRESSURE_ASSET_PROPERTY,
      MIN_PRESSURE_ASSET_PROPERTY,
    ],
  });
}

export const AFRICA_PRODUCTION_LINE_1_REACTOR_1_ASSET_ID = uuid();
export const AFRICA_PRODUCTION_LINE_1_REACTOR_1_ASSET_DESCRIPTION = createReactorAssetDescription({
  assetName: 'Reactor 1',
  assetId: AFRICA_PRODUCTION_LINE_1_REACTOR_1_ASSET_ID,
});
export const AFRICA_PRODUCTION_LINE_1_REACTOR_1_ASSET_SUMMARY = summarizeAssetDescription(
  AFRICA_PRODUCTION_LINE_1_REACTOR_1_ASSET_DESCRIPTION
);

export const AFRICA_PRODUCTION_LINE_1_REACTOR_2_ASSET_ID = uuid();
export const AFRICA_PRODUCTION_LINE_1_REACTOR_2_ASSET_DESCRIPTION = createReactorAssetDescription({
  assetName: 'Reactor 2',
  assetId: AFRICA_PRODUCTION_LINE_1_REACTOR_2_ASSET_ID,
});
export const AFRICA_PRODUCTION_LINE_1_REACTOR_2_ASSET_SUMMARY = summarizeAssetDescription(
  AFRICA_PRODUCTION_LINE_1_REACTOR_2_ASSET_DESCRIPTION
);

export const AFRICA_PRODUCTION_LINE_1_REACTOR_3_ASSET_ID = uuid();
export const AFRICA_PRODUCTION_LINE_1_REACTOR_3_ASSET_DESCRIPTION = createReactorAssetDescription({
  assetName: 'Reactor 3',
  assetId: AFRICA_PRODUCTION_LINE_1_REACTOR_3_ASSET_ID,
});
export const AFRICA_PRODUCTION_LINE_1_REACTOR_3_ASSET_SUMMARY = summarizeAssetDescription(
  AFRICA_PRODUCTION_LINE_1_REACTOR_3_ASSET_DESCRIPTION
);

export const AFRICA_PRODUCTION_LINE_1_REACTOR_4_ASSET_ID = uuid();
export const AFRICA_PRODUCTION_LINE_1_REACTOR_4_ASSET_DESCRIPTION = createReactorAssetDescription({
  assetName: 'Reactor 4',
  assetId: AFRICA_PRODUCTION_LINE_1_REACTOR_4_ASSET_ID,
});
export const AFRICA_PRODUCTION_LINE_1_REACTOR_4_ASSET_SUMMARY = summarizeAssetDescription(
  AFRICA_PRODUCTION_LINE_1_REACTOR_4_ASSET_DESCRIPTION
);

export const AFRICA_PRODUCTION_LINE_1_REACTOR_5_ASSET_ID = uuid();
export const AFRICA_PRODUCTION_LINE_1_REACTOR_5_ASSET_DESCRIPTION = createReactorAssetDescription({
  assetName: 'Reactor 5',
  assetId: AFRICA_PRODUCTION_LINE_1_REACTOR_5_ASSET_ID,
});
export const AFRICA_PRODUCTION_LINE_1_REACTOR_5_ASSET_SUMMARY = summarizeAssetDescription(
  AFRICA_PRODUCTION_LINE_1_REACTOR_5_ASSET_DESCRIPTION
);

const CAPACITY_ASSET_PROPERTY = {
  name: 'Capacity',
  id: uuid(),
  dataType: 'INTEGER',
} as const;

const VOLUME_ASSET_PROPERTY = {
  name: 'Volume',
  id: uuid(),
  dataType: 'INTEGER',
} as const;

export const AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_1_ASSET_ID = uuid();
export const AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_1_ASSET_DESCRIPTION = createAssetDescription({
  assetName: 'Storage Tank 1',
  assetModelId: STORAGE_TANK_ASSET_MODEL_ID,
  assetId: AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_1_ASSET_ID,
  assetProperties: [CAPACITY_ASSET_PROPERTY, VOLUME_ASSET_PROPERTY],
});
export const AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_1_ASSET_SUMMARY = summarizeAssetDescription(
  AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_1_ASSET_DESCRIPTION
);

export const AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_2_ASSET_ID = uuid();
export const AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_2_ASSET_DESCRIPTION = createAssetDescription({
  assetName: 'Storage Tank 2',
  assetModelId: STORAGE_TANK_ASSET_MODEL_ID,
  assetId: AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_2_ASSET_ID,
  assetProperties: [CAPACITY_ASSET_PROPERTY, VOLUME_ASSET_PROPERTY],
});
export const AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_2_ASSET_SUMMARY = summarizeAssetDescription(
  AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_2_ASSET_DESCRIPTION
);

export const AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_3_ASSET_ID = uuid();
export const AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_3_ASSET_DESCRIPTION = createAssetDescription({
  assetName: 'Storage Tank 3',
  assetModelId: STORAGE_TANK_ASSET_MODEL_ID,
  assetId: AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_3_ASSET_ID,
  assetProperties: [CAPACITY_ASSET_PROPERTY, VOLUME_ASSET_PROPERTY],
});
export const AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_3_ASSET_SUMMARY = summarizeAssetDescription(
  AFRICA_PRODUCTION_LINE_1_STORAGE_TANK_3_ASSET_DESCRIPTION
);

export const AFRICA_PRODUCTION_LINE_2_ASSET_ID = uuid();
export const AFRICA_PRODUCTION_LINE_2_ASSET_DESCRIPTION = createAssetDescription({
  assetName: 'Africa Production Line 2',
  assetModelId: PRODUCTION_LINE_ASSET_MODEL_ID,
  assetId: AFRICA_PRODUCTION_LINE_2_ASSET_ID,
  assetHierarchies: [REACTOR_HIERARCHY, STORAGE_TANK_HIERARCHY],
});
export const AFRICA_PRODUCTION_LINE_2_ASSET_SUMMARY = summarizeAssetDescription(
  AFRICA_PRODUCTION_LINE_2_ASSET_DESCRIPTION
);

export const AFRICA_PRODUCTION_LINE_3_ASSET_ID = uuid();
export const AFRICA_PRODUCTION_LINE_3_ASSET_DESCRIPTION = createAssetDescription({
  assetName: 'Africa Production Line 3',
  assetModelId: PRODUCTION_LINE_ASSET_MODEL_ID,
  assetId: AFRICA_PRODUCTION_LINE_3_ASSET_ID,
  assetHierarchies: [REACTOR_HIERARCHY, STORAGE_TANK_HIERARCHY],
});
export const AFRICA_PRODUCTION_LINE_3_ASSET_SUMMARY = summarizeAssetDescription(
  AFRICA_PRODUCTION_LINE_3_ASSET_DESCRIPTION
);

export const AFRICA_PRODUCTION_LINE_4_ASSET_ID = uuid();
export const AFRICA_PRODUCTION_LINE_4_ASSET_DESCRIPTION = createAssetDescription({
  assetName: 'Africa Production Line 4',
  assetModelId: PRODUCTION_LINE_ASSET_MODEL_ID,
  assetId: AFRICA_PRODUCTION_LINE_4_ASSET_ID,
  assetHierarchies: [REACTOR_HIERARCHY, STORAGE_TANK_HIERARCHY],
});
export const AFRICA_PRODUCTION_LINE_4_ASSET_SUMMARY = summarizeAssetDescription(
  AFRICA_PRODUCTION_LINE_4_ASSET_DESCRIPTION
);

export const ANTARCTICA_SITE_ASSET_DESCRIPTION = createSiteAssetDescription({
  assetName: 'Antarctica Site',
  assetId: ANTARCTICA_SITE_ASSET_ID,
});
export const ANTARCTICA_SITE_ASSET_SUMMARY = summarizeAssetDescription(ANTARCTICA_SITE_ASSET_DESCRIPTION);

export const ASIA_SITE_ASSET_DESCRIPTION = createSiteAssetDescription({
  assetName: 'Asia Site',
  assetId: ASIA_SITE_ASSET_ID,
});
export const ASIA_SITE_ASSET_SUMMARY = summarizeAssetDescription(ASIA_SITE_ASSET_DESCRIPTION);

export const AUSTRALIA_SITE_ASSET_DESCRIPTION = createSiteAssetDescription({
  assetName: 'Australia Site',
  assetId: AUSTRALIA_SITE_ASSET_ID,
});
export const AUSTRALIA_SITE_ASSET_SUMMARY = summarizeAssetDescription(AUSTRALIA_SITE_ASSET_DESCRIPTION);

export const EUROPE_SITE_ASSET_DESCRIPTION = createSiteAssetDescription({
  assetName: 'Europe Site',
  assetId: EUROPE_SITE_ASSET_ID,
});
export const EUROPE_SITE_ASSET_SUMMARY = summarizeAssetDescription(EUROPE_SITE_ASSET_DESCRIPTION);

export const NORTH_AMERICA_SITE_ASSET_DESCRIPTION = createSiteAssetDescription({
  assetName: 'North America Site',
  assetId: NORTH_AMERICA_SITE_ASSET_ID,
});
export const NORTH_AMERICA_SITE_ASSET_SUMMARY = summarizeAssetDescription(NORTH_AMERICA_SITE_ASSET_DESCRIPTION);

export const SOUTH_AMERICA_SITE_ASSET_DESCRIPTION = createSiteAssetDescription({
  assetName: 'South America Site',
  assetId: SOUTH_AMERICA_SITE_ASSET_ID,
});
export const SOUTH_AMERICA_SITE_ASSET_SUMMARY = summarizeAssetDescription(SOUTH_AMERICA_SITE_ASSET_DESCRIPTION);

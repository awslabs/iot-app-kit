import { v4 as uuid } from 'uuid';
import { AssetModelFactory } from './AssetModelFactory';

const reactorAssetModelId = uuid();
const reactorAssetModelTemperatureId = uuid();
const reactorAssetModelMaxTemperatureId = uuid();
const reactorAssetModelMinTemperatureId = uuid();
const reactorAssetModelPressureId = uuid();
const reactorAssetModelMaxPressureId = uuid();
const reactorAssetModelMinPressureId = uuid();

const assetModelFactory = new AssetModelFactory();
export const REACTOR_ASSET_MODEL = assetModelFactory.create({
  assetModelId: reactorAssetModelId,
  assetModelName: 'Reactor',
  assetModelDescription: 'Reactor Asset Model',
  assetModelProperties: [
    {
      name: 'Temperature',
      id: reactorAssetModelTemperatureId,
      dataType: 'DOUBLE',
      type: { measurement: {} },
      externalId: 'temp',
      unit: 'Celcius',
      path: [
        { id: reactorAssetModelId, name: 'Reactor' },
        { id: reactorAssetModelTemperatureId, name: 'Temperature' },
      ],
    },
    {
      name: 'Max Temperature',
      id: reactorAssetModelMaxTemperatureId,
      dataType: 'DOUBLE',
      type: { attribute: {} },
      externalId: 'maxTemp',
      unit: 'Celcius',
      path: [
        { id: reactorAssetModelId, name: 'Reactor' },
        { id: reactorAssetModelMaxTemperatureId, name: 'Max Temperature' },
      ],
    },
    {
      name: 'Min Temperature',
      id: reactorAssetModelMinTemperatureId,
      dataType: 'DOUBLE',
      type: { attribute: {} },
      externalId: 'minTemp',
      unit: 'Celcius',
      path: [
        { id: reactorAssetModelId, name: 'Reactor' },
        { id: reactorAssetModelMinTemperatureId, name: 'Min Temperature' },
      ],
    },
    {
      name: 'Pressure',
      id: reactorAssetModelPressureId,
      dataType: 'DOUBLE',
      type: { measurement: {} },
      unit: 'Pascal',
      path: [
        { id: reactorAssetModelId, name: 'Reactor' },
        { id: reactorAssetModelPressureId, name: 'Pressure' },
      ],
    },
    {
      name: 'Max Pressure',
      id: reactorAssetModelMaxPressureId,
      dataType: 'DOUBLE',
      type: { attribute: {} },
      externalId: 'maxP',
      unit: 'Pascal',
      path: [
        { id: reactorAssetModelId, name: 'Reactor' },
        { id: reactorAssetModelMaxPressureId, name: 'Max Pressure' },
      ],
    },
    {
      name: 'Min Pressure',
      id: reactorAssetModelMinPressureId,
      dataType: 'DOUBLE',
      type: { attribute: {} },
      externalId: 'minP',
      unit: 'Pascal',
      path: [
        { id: reactorAssetModelId, name: 'Reactor' },
        { id: reactorAssetModelMinPressureId, name: 'Min Pressure' },
      ],
    },
  ],
});

const storageTankAssetModelId = uuid();
const storageTankAssetModelCapacityId = uuid();
const storageTankAssetModelVolumeId = uuid();

export const STORAGE_TANK_ASSET_MODEL = assetModelFactory.create({
  assetModelId: storageTankAssetModelId,
  assetModelName: 'Storage Tank',
  assetModelDescription: 'Storage Tank Asset Model',
  assetModelProperties: [
    {
      name: 'Capacity',
      id: storageTankAssetModelCapacityId,
      dataType: 'INTEGER',
      type: { attribute: {} },
      externalId: 'f',
      unit: 'Liters',
      path: [
        { id: storageTankAssetModelId, name: 'Storage Tank' },
        { id: storageTankAssetModelCapacityId, name: 'Capacity' },
      ],
    },
    {
      name: 'Volume',
      id: storageTankAssetModelVolumeId,
      dataType: 'INTEGER',
      type: { measurement: {} },
      externalId: 'g',
      unit: 'Liters/Sqft',
      path: [
        { id: storageTankAssetModelId, name: 'Storage Tank' },
        { id: storageTankAssetModelVolumeId, name: 'Volume' },
      ],
    },
  ],
});

const reactorAssetModelHeirarchyId = uuid();

export const REACTOR_ASSET_MODEL_HIERARCHY = {
  id: reactorAssetModelHeirarchyId,
  name: 'Reactor',
  childAssetModelId: REACTOR_ASSET_MODEL.assetModelId,
};

const storageTankAssetModelHeirarchyId = uuid();

export const STORAGE_TANK_ASSET_MODEL_HIERARCHY = {
  id: storageTankAssetModelHeirarchyId,
  name: 'Storage Tank',
  childAssetModelId: STORAGE_TANK_ASSET_MODEL.assetModelId,
};

export const PRODUCTION_LINE_ASSET_MODEL = assetModelFactory.create({
  assetModelName: 'Production Line',
  assetModelDescription: 'Production Line Asset Model',
  assetModelHierarchies: [
    REACTOR_ASSET_MODEL_HIERARCHY,
    STORAGE_TANK_ASSET_MODEL_HIERARCHY,
  ],
});

const productionLineAssetModelHierarchyId = uuid();

export const PRODUCTION_LINE_ASSET_MODEL_HIERARCHY = {
  id: productionLineAssetModelHierarchyId,
  name: 'Production Line',
  childAssetModelId: PRODUCTION_LINE_ASSET_MODEL.assetModelId,
};

const siteAssetModelId = uuid();
const siteAssetModelCoordinatesId = uuid();

const siteAssetModelProductionRateId = uuid();

export const SITE_ASSET_MODEL = assetModelFactory.create({
  assetModelId: siteAssetModelId,
  assetModelName: 'Site',
  assetModelDescription: 'Production Site Asset Model',
  assetModelProperties: [
    {
      name: 'Coordinates',
      id: siteAssetModelCoordinatesId,
      dataType: 'STRING',
      type: {
        measurement: {},
      },
      externalId: 'h',
      path: [
        { id: siteAssetModelId, name: 'Site' },
        { id: siteAssetModelCoordinatesId, name: 'Coordinates' },
      ],
    },
    {
      name: 'Production Rate',
      id: siteAssetModelProductionRateId,
      dataType: 'DOUBLE',
      type: { measurement: {} },
      externalId: 'i',
      path: [
        { id: siteAssetModelId, name: 'Site' },
        { id: siteAssetModelProductionRateId, name: 'Production Rate' },
      ],
      unit: 'rate',
    },
  ],
  assetModelHierarchies: [PRODUCTION_LINE_ASSET_MODEL_HIERARCHY],
});

export const ASSET_MODELS = {
  models: [
    SITE_ASSET_MODEL,
    PRODUCTION_LINE_ASSET_MODEL,
    REACTOR_ASSET_MODEL,
    STORAGE_TANK_ASSET_MODEL,
  ],
  getAll: function () {
    return this.models;
  },
  findByAssetModelId: function (assetModelId: string) {
    return this.models.find((model) => model.assetModelId === assetModelId);
  },
};

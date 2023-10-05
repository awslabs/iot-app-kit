import { v4 as uuid } from 'uuid';
import { AssetModelFactory } from './AssetModelFactory';

const assetModelFactory = new AssetModelFactory();

export const REACTOR_ASSET_MODEL = assetModelFactory.create({
  assetModelName: 'Reactor',
  assetModelDescription: 'Reactor Asset Model',
  assetModelProperties: [
    { name: 'Temperature', id: uuid(), dataType: 'DOUBLE', type: { measurement: {} } },
    { name: 'Max Temperature', id: uuid(), dataType: 'DOUBLE', type: { attribute: {} } },
    { name: 'Min Temperature', id: uuid(), dataType: 'DOUBLE', type: { attribute: {} } },
    { name: 'Pressure', id: uuid(), dataType: 'DOUBLE', type: { measurement: {} } },
    { name: 'Max Pressure', id: uuid(), dataType: 'DOUBLE', type: { attribute: {} } },
    { name: 'Min Pressure', id: uuid(), dataType: 'DOUBLE', type: { attribute: {} } },
  ],
});

export const STORAGE_TANK_ASSET_MODEL = assetModelFactory.create({
  assetModelName: 'Storage Tank',
  assetModelDescription: 'Storage Tank Asset Model',
  assetModelProperties: [
    { name: 'Capacity', id: uuid(), dataType: 'INTEGER', type: { attribute: {} } },
    { name: 'Volume', id: uuid(), dataType: 'INTEGER', type: { measurement: {} } },
  ],
});

export const REACTOR_ASSET_MODEL_HIERARCHY = {
  id: uuid(),
  name: 'Reactor',
  childAssetModelId: REACTOR_ASSET_MODEL.assetModelId,
};

export const STORAGE_TANK_ASSET_MODEL_HIERARCHY = {
  id: uuid(),
  name: 'Storage Tank',
  childAssetModelId: STORAGE_TANK_ASSET_MODEL.assetModelId,
};

export const PRODUCTION_LINE_ASSET_MODEL = assetModelFactory.create({
  assetModelName: 'Production Line',
  assetModelDescription: 'Production Line Asset Model',
  assetModelHierarchies: [REACTOR_ASSET_MODEL_HIERARCHY, STORAGE_TANK_ASSET_MODEL_HIERARCHY],
});

export const PRODUCTION_LINE_ASSET_MODEL_HIERARCHY = {
  id: uuid(),
  name: 'Production Line',
  childAssetModelId: PRODUCTION_LINE_ASSET_MODEL.assetModelId,
};

export const SITE_ASSET_MODEL = assetModelFactory.create({
  assetModelName: 'Site',
  assetModelDescription: 'Production Site Asset Model',
  assetModelProperties: [
    {
      name: 'Coordinates',
      id: uuid(),
      dataType: 'STRING',
      type: {
        measurement: {},
      },
    },
    { name: 'Production Rate', id: uuid(), dataType: 'DOUBLE', type: { measurement: {} } },
  ],
  assetModelHierarchies: [PRODUCTION_LINE_ASSET_MODEL_HIERARCHY],
});

export const ASSET_MODELS = [
  SITE_ASSET_MODEL,
  PRODUCTION_LINE_ASSET_MODEL,
  REACTOR_ASSET_MODEL,
  STORAGE_TANK_ASSET_MODEL,
];

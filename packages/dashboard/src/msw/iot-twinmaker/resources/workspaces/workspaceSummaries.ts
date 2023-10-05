import { WorkspaceSummaryFactory } from './WorkspaceSummaryFactory';

const factory = new WorkspaceSummaryFactory();

export const SITEWISE_ASSET_SYNC_WORKSPACE = factory.create({
  workspaceId: 'SiteWise Asset Sync Workspace',
  description: 'Workspace for synchronizing SiteWise assets to TwinMaker',
});

export const AFRICA_SITE_WORKSPACE = factory.create({
  workspaceId: 'Africa Site Workspace',
  description: 'Workspace for Africa Site',
});

export const ANTARCTICA_SITE_WORKSPACE = factory.create({
  workspaceId: 'Antarctica Site Workspace',
  description: 'Workspace for Antarctica Site',
});

export const ASIA_SITE_WORKSPACE = factory.create({
  workspaceId: 'Asia Site Workspace',
  description: 'Workspace for Asia Site',
});

export const AUSTRALIA_SITE_WORKSPACE = factory.create({
  workspaceId: 'Australia Site Workspace',
  description: 'Workspace for Australia Site',
});

export const EUROPE_SITE_WORKSPACE = factory.create({
  workspaceId: 'Europe Site Workspace',
  description: 'Workspace for Europe Site',
});

export const NORTH_AMERICA_SITE_WORKSPACE = factory.create({
  workspaceId: 'North America Site Workspace',
  description: 'Workspace for North America Site',
});

export const SOUTH_AMERICA_SITE_WORKSPACE = factory.create({
  workspaceId: 'South America Site Workspace',
  description: 'Workspace for South America Site',
});

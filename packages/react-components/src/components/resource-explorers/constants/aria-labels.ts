import type {
  AssetModelResource,
  AssetResource,
  AssetPropertyResource,
  TimeSeriesResource,
} from '../types/resources';

interface ResourceExplorerAriaLabels<Resource> {
  tableAriaLabels: ResourceTableAriaLabels<Resource>;
}

interface ResourceTableAriaLabels<Resource> {
  allResourcesSelectionLabel: (
    selectedResources: readonly Resource[]
  ) => string;
  resourceSelectionLabel: (resource: Resource) => string;
  selectionGroupLabel: string;
}

export const DEFAULT_ASSET_MODEL_ARIA_LABELS: ResourceExplorerAriaLabels<AssetModelResource> =
  {
    tableAriaLabels: {
      selectionGroupLabel: 'Asset models selection',
      allResourcesSelectionLabel: (selectedResources) =>
        `${selectedResources.length} ${
          selectedResources.length === 1 ? 'asset model' : 'asset models'
        } selected`,
      resourceSelectionLabel: (resource) => resource.name,
    },
  };

export const DEFAULT_ASSET_ARIA_LABELS: ResourceExplorerAriaLabels<AssetResource> =
  {
    tableAriaLabels: {
      selectionGroupLabel: 'Assets selection',
      allResourcesSelectionLabel: (selectedResources) =>
        `${selectedResources.length} ${
          selectedResources.length === 1 ? 'asset' : 'assets'
        } selected`,
      resourceSelectionLabel: (resource) => resource.name,
    },
  };

export const DEFAULT_ASSET_PROPERTY_ARIA_LABELS: ResourceExplorerAriaLabels<AssetPropertyResource> =
  {
    tableAriaLabels: {
      selectionGroupLabel: 'Asset properties selection',
      allResourcesSelectionLabel: (selectedResources) =>
        `${selectedResources.length} ${
          selectedResources.length === 1 ? 'asset property' : 'asset properties'
        } selected`,
      resourceSelectionLabel: (resource) => resource.name,
    },
  };

export const DEFAULT_TIME_SERIES_ARIA_LABELS: ResourceExplorerAriaLabels<TimeSeriesResource> =
  {
    tableAriaLabels: {
      selectionGroupLabel: 'Time series selection',
      allResourcesSelectionLabel: (selectedResources) =>
        `${selectedResources.length} time series selected`,
      resourceSelectionLabel: (resource) =>
        resource.alias ?? resource.timeSeriesId,
    },
  };

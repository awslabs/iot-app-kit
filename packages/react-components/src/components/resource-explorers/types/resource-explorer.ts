export interface ResourceExplorerProps<Resource = unknown> {
  /** Specify a callback to be called when resource selection state changes. */
  onSelectionChange?: (resources: Resource[]) => void;

  /** Specify the selection types. Default - no selection. */
  selectionType?: 'single' | 'multi';

  /** Specify the selected resources. Default - select state handled internally. */
  selectedResources?: Resource[];

  /** Specify to disable selection of a given resource. */
  isResourceDisabled?: (resource: Resource) => boolean;

  /** Specify to hide a given resource. */
  isResourceHidden?: (resource: Resource) => boolean;

  /** Allow for user client-side filtering of the resources. Default - false. */
  filterEnabled?: boolean;

  /** Allow for user customization of the table. Default - false. */
  preferencesEnabled?: boolean;
}

// Can be used for assets and asset properties at this time.
export interface SearchableResourceExplorerProps {
  /** Optionally specify a valid IoT SiteWise ExecuteQuery query statement. */
  // queryStatement?: string;

  /** Enable a simple search bar foor the resource. Default - false. */
  searchEnabled?: boolean;

  // dataSource: { executeQuery }
}

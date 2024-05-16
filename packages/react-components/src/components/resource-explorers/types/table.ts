import type {
  ResourceName,
  PluralResourceName,
  ResourceFieldFilterOperator,
  IsResourceDisabled,
  SelectedResources,
  HasNextPage,
  RequestIsLoading,
  SelectionMode,
  IsTableFilterEnabled,
  IsTableUserSettingsEnabled,
  NextPage,
  OnSelectResource,
  ResourceFieldName,
  ResourceFieldId,
  RenderTableResourceField,
  IsTableSearchEnabled,
  IsTableTitleless,
  OnClickSearch,
  RequestError,
  PluralResourceFieldName,
  Resources,
} from './common';

export type TableResourceDefinition<Resource> = TableResourceField<Resource>[];

export interface TableResourceField<Resource> {
  id: ResourceFieldId;

  /** Human-readable name for the resource field.  */
  name: ResourceFieldName;

  /** Plural human-readable name for the resource field. */
  pluralName: PluralResourceFieldName;

  /**
   * Callback for rendering table cell content.
   *
   * @defaultValue `undefined` (the property is rendered as a string)
   */
  render: RenderTableResourceField<Resource>;

  /**
   * Specify filters operators usable with the property. Filter operators are
   * only utilized when the table filter is enabled.
   *
   * @defaultValue `undefined`
   */
  filterOperators?: readonly ResourceFieldFilterOperator[];
}

export interface ResourceTableProps<Resource> {
  resourceName: ResourceName;
  pluralResourceName: PluralResourceName;
  ariaLabels: {
    allResourcesSelectionLabel: (
      selectedResources: readonly Resource[]
    ) => string;
    resourceSelectionLabel: (resource: Resource) => string;
    selectionGroupLabel: string;
  };

  resourceDefinition: TableResourceDefinition<Resource>;
  resources: Resources<Resource>;
  createResourceKey: (resource: Resource) => string;
  isResourceDisabled: IsResourceDisabled<Resource>;

  isLoading?: RequestIsLoading;
  error?: RequestError;

  selectionMode: SelectionMode;
  selectedResources: SelectedResources<Resource>;
  onSelectResource?: OnSelectResource<Resource>;

  hasNextPage?: HasNextPage;
  onClickNextPage: NextPage;

  userCustomization: UserCustomization;
  onUpdateUserCustomization: OnUpdateTableUserCustomization;

  onClickSearch?: OnClickSearch;

  isTitleless?: IsTableTitleless;
  isSearchEnabled?: IsTableSearchEnabled;
  isFilterEnabled?: IsTableFilterEnabled;
  isUserSettingsEnabled?: IsTableUserSettingsEnabled;
  titleExtension?: React.ReactNode;
}

export type OnUpdateTableUserCustomization = (
  tableUserCustomization: UserCustomization
) => void;

export interface UserCustomization extends ResourceTableUserSettings {
  pageSize: number;
}

export interface ResourceTableSettings {
  /**
   * Specify whether or not the header should be hidden.
   *
   * @defaultValue `false`
   */
  isTitleless?: IsTableTitleless;

  /**
   * Allow for user client-side filtering of the resources.
   *
   * @defaultValue `false`
   */
  isFilterEnabled?: IsTableFilterEnabled;

  /**
   * Allow for user customization of the table.
   *
   * @defaultValue `false`
   */
  isUserSettingsEnabled?: IsTableUserSettingsEnabled;

  isSearchEnabled?: IsTableSearchEnabled;
}

export interface ResourceTableUserSettings {
  /**
   * Specify the order and visibility of table columns.
   *
   * @defaultValue Dependent on resource type.
   */
  columnDisplay: {
    /** Specify the ID of the column. */
    id?: string;

    /**
     * Specify the visibility of the column.
     */
    isVisible?: boolean;
  }[];

  /**
   * Specify content density setting.
   *
   * @defaultValue {@link DEFAULT_TABLE_USER_SETTINGS.contentDensity}
   */
  contentDensity: 'comfortable' | 'compact';

  /**
   * Specify sticky columns setting.
   *
   * @defaultValue {@link DEFAULT_TABLE_USER_SETTINGS.stickyColumns}
   */
  stickyColumns: {
    /**
     * Specify number of columns from start to stick in place.
     *
     * @defaultValue `undefined` (no columns)
     */
    first?: number;

    /**
     * Specify number of columns from end to stick in place.
     *
     * @defaultValue `undefined` (no columns)
     */
    last?: number;
  };

  /**
   * Specify striped rows setting.
   *
   * @defaultValue `false`
   */
  stripedRows: boolean;

  /**
   * Specify wrap lines setting.
   *
   * @defaultValue `false`
   */
  wrapLines: boolean;
}

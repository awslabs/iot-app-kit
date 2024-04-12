import { StringKey } from './helpers';

export interface ResourceTableSettings {
  /**
   * Allow for user client-side filtering of the resources.
   *
   * @defaultValue `false`
   */
  isFilterEnabled?: boolean;

  /**
   * Allow for user customization of the table.
   *
   * @defaultValue `false`
   */
  isUserSettingsEnabled?: boolean;
}

export interface ResourceTableUserSettings<Resource> {
  /**
   * Specify the order and visibility of table columns.
   *
   * @defaultValue Dependent on resource type.
   */
  columnDisplay: {
    /** Specify the ID of the column. */
    id?: StringKey<Resource>;

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
   */
  stripedRows: boolean;

  /**
   * Specify wrap lines setting.
   *
   */
  wrapLines: boolean;
}

export type ResourceTableSchema<Resource> = {
  name: string;
  pluralName: string;
  properties: ResourceTablePropertySchema<Resource>[];
};

export interface ResourceTablePropertySchema<Resource> {
  id: string;

  /** Human-readable name for the resource. */
  name: string;

  /** Plural human-readable name for the resource. */
  pluralName: string;

  /**
   * Specify filters operators usable with the property. Filter operators are
   * only utilized when the table filter is enabled.
   *
   * @defaultValue `undefined`
   */
  filterOperators?: FilterOperator[];

  /**
   * Callback for rendering table cell content.
   *
   * @defaultValue `undefined` (the property is rendered as a string)
   */
  render?: (resource: Resource) => string | React.ReactNode;
}

export type FilterOperator = '=' | '!=' | '>' | '>=' | '<' | '<=' | ':' | '!:';

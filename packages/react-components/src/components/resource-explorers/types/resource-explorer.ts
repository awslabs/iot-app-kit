import type {
  ResourceTableSettings,
  ResourceTableUserSettings,
  TableResourceDefinition,
} from './table';
import {
  type PageSize,
  type PluralResourceName,
  type ResourceExplorerVariant,
  type ResourceName,
  type SelectionMode,
  type ShouldPersistUserCustomization,
} from './common';
import {
  type DropDownResourceDefinition,
  type ResourceDropDownSettings,
} from './drop-down';

/** Props common to all resource explorers. */
export type CommonResourceExplorerProps<Resource = unknown> = {
  /** TODO */
  iotSiteWiseClient?: unknown;

  /**
   * Specify the resource explorer variant to render.
   *
   * @defaultValue `table` - The table variant is rendered.
   */
  variant?: ResourceExplorerVariant;

  /**
   * Specify the selection types.
   *
   * @defaultValue `undefined` (selection is disabled by default)
   */
  selectionMode?: SelectionMode;

  /**
   * Specify a human-readable name for the resource.
   *
   * @defaultValue Default resource name will be used (dependent on resource
   * type).
   *
   * @example `'Asset'`
   */
  resourceName?: ResourceName;

  /**
   * Specify a plural human-readable name for the resource.
   *
   * @defaultValue Default plural resource name will be used (dependent on
   * resource type).
   *
   * @example `'Assets'`
   */
  pluralResourceName?: PluralResourceName;

  /**
   * Set the default page size. Page size may be overridden by users.
   *
   * @defaultValue `10`
   */
  defaultPageSize?: PageSize;

  /**
   * Persist user customization in local storage when true.
   *
   * @defaultValue `false`
   */
  shouldPersistUserCustomization?: ShouldPersistUserCustomization;

  /**
   * Specify table settings.
   *
   * @defaultValue `undefined`.
   */
  tableSettings?: ResourceTableSettings;

  /**
   * Set the default table user settings. Settings may be overriden by users.
   *
   * @remarks
   *
   * Only utilized when {@link TableSettings.isUserSettingsEnabled} is set
   * to true.
   *
   * @defaultValue {@link DEFAULT_TABLE_USER_SETTINGS}
   */
  defaultTableUserSettings?: ResourceTableUserSettings;

  tableResourceDefinition?: TableResourceDefinition<Resource>;

  dropDownSettings?: ResourceDropDownSettings;

  dropDownResourceDefinition?: DropDownResourceDefinition<Resource>;
};

import type { DefaultResourceName, ResourceProps } from './resource';
import type {
  ResourceTableSettings,
  ResourceTableUserSettings,
} from './resource-table';
import { DEFAULT_DEFAULT_PAGE_SIZE } from '../constants/defaults/misc';

/** Props common to all resource explorers. */
export type ResourceExplorerProps<
  Resource = unknown,
  ResourceName extends string = DefaultResourceName
> = ResourceProps<Resource, ResourceName> & {
  /**
   * Specify the selection types.
   *
   * @defaultValue `undefined` (selection is disabled by default)
   */
  selectionType?: 'single' | 'multi';

  /**
   * Set the default page size. Page size may be overridden by users.
   *
   * @defaultValue {@link DEFAULT_DEFAULT_PAGE_SIZE}
   */
  defaultPageSize?: number;

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
  defaultTableUserSettings?: ResourceTableUserSettings<Resource>;

  /**
   * Store user settings in local storage when true.
   *
   * @defaultValue `false`
   */
  shouldStoreUserSettings?: boolean;
};

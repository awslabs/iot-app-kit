import { type TableProps } from './table';
import type {
  DefaultResourceName,
  ResourceProps,
  ResourcesProp,
} from '../types/resource';
import type { UserSettings } from '../use-settings';

export type ConcreteResourceTableProps<
  Resource,
  ResourceName extends string = DefaultResourceName
> = ResourceProps<Resource, ResourceName> &
  ResourcesProp<Resource, ResourceName> &
  Pick<
    TableProps<Resource>,
    'selectionType' | 'hasNextPage' | 'isLoading' | 'error' | 'onClickNextPage'
  > & {
    userSettings: Required<UserSettings<Resource>>;
    onUserSettingsChange: (userSettings: UserSettings<Resource>) => void;
  };

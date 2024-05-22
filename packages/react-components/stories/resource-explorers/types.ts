import type { CommonResourceExplorerProps } from '../../src/components/resource-explorers/types/resource-explorer';

export type ResourceExplorerStoryControls<Resource> = Pick<
  CommonResourceExplorerProps<Resource>,
  | 'variant'
  | 'defaultPageSize'
  | 'shouldPersistUserCustomization'
  | 'selectionMode'
> &
  CommonResourceExplorerProps<Resource>['tableSettings'];

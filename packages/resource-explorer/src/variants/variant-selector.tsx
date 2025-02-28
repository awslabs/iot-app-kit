import type { ReactElement } from 'react';

import {
  RESOURCE_DROP_DOWN_VARIANT,
  RESOURCE_TABLE_VARIANT,
} from '../constants/defaults';
import type { ResourceExplorerVariant } from '../types/common';
import { type ResourceDropDown } from './resource-drop-down';
import { type ResourceTable } from './resource-table';

export interface ResourceExplorerVariantProps {
  variant: ResourceExplorerVariant;
  table: ReactElement<typeof ResourceTable>;
  dropDown: ReactElement<typeof ResourceDropDown>;
}

export function ResourceExplorerVariant({
  variant,
  table,
  dropDown,
}: ResourceExplorerVariantProps) {
  if (variant === RESOURCE_TABLE_VARIANT) {
    return <>{table}</>;
  }

  if (variant === RESOURCE_DROP_DOWN_VARIANT) {
    return <>{dropDown}</>;
  }

  throw new Error('Unexpected variant');
}

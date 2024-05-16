import React, { type ReactElement } from 'react';

import type { ResourceExplorerVariant } from '../types/common';
import { ResourceTable } from '../resource-table';
import { ResourceDropDown } from '../resource-drop-down';
import {
  RESOURCE_DROP_DOWN_VARIANT,
  RESOURCE_TABLE_VARIANT,
} from '../constants/defaults';
import { handleUnexpectedVariant } from '../helpers/errors';

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

  handleUnexpectedVariant(variant);
}

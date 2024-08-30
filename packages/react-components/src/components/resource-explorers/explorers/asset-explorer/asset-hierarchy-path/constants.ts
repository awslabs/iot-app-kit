import type { ListAssociatedAssets } from '@iot-app-kit/core';

export const PARENT_TRAVERSAL_DIRECTION =
  'PARENT' satisfies Parameters<ListAssociatedAssets>[0]['traversalDirection'];

export const SINGLE_PARENT_MAX_RESULTS =
  1 satisfies Parameters<ListAssociatedAssets>[0]['maxResults'];

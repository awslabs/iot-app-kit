import { NonCancelableCustomEvent } from '@cloudscape-design/components';
import { BaseChangeDetail } from '@cloudscape-design/components/input/interfaces';

// Should never return NaN
export const numberFromDetail = (
  event: NonCancelableCustomEvent<BaseChangeDetail>
) => parseInt(event.detail.value) || 0;

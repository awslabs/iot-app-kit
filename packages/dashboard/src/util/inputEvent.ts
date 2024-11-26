import type { InputProps } from '@cloudscape-design/components/input';

// Should never return NaN
export const numberFromDetail = (
  event: Parameters<NonNullable<InputProps['onChange']>>[0]
) => parseInt(event.detail.value) || 0;

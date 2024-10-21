import { type SyntheticEvent } from 'react';

export function stopPropagation(event: SyntheticEvent<HTMLElement>) {
  event.stopPropagation();
}

export const LEFT_MOUSE_BUTTON_EVENT_CODE = 0;
export const RIGHT_MOUSE_BUTTON_EVENT_CODE = 2;

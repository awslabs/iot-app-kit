import type { ActionCreatorWithPayload } from '@reduxjs/toolkit';

export type PayloadFromActionCreator<AC> = AC extends ActionCreatorWithPayload<
  infer Payload
>
  ? Payload
  : never;

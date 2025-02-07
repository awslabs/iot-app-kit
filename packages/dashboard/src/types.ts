import type {
  DescribeDashboardRequest,
  DescribeDashboardResponse,
} from '@aws-sdk/client-iotsitewise';
import type { Viewport } from '@iot-app-kit/core';
import type { ReactElement } from 'react';
import type { DashboardConfiguration } from './features/dashboard-configuration/dashboard-configuration';
import { type SetNonNullable } from 'type-fest';

export type AssistantStateTypes = 'DISABLED' | 'PASSIVE';

export type AssistantConfiguration = {
  state?: AssistantStateTypes;
};

export interface Position {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export enum MouseClick {
  Left = 0,
  Right = 2,
}

/** First-class function used to send requests to AWS. */
export type RequestFunction<Request, Response> = (
  request: SetNonNullable<Request>,
  options?: {
    abortSignal?: AbortSignal;
    requestTimeout?: number;
  }
) => PromiseLike<SetNonNullable<Response>>;

/** Utility type for extracting the response of a request function. */
export type RequestFunctionResponse<F> = F extends RequestFunction<
  infer _Request,
  infer Response
>
  ? SetNonNullable<Response>
  : never;

/**
 * First-class function for requesting IoT SiteWise dashboard descriptions
 * from AWS.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_DescribeDashboard.html}
 */
export type DescribeDashboard = RequestFunction<
  DescribeDashboardRequest,
  DescribeDashboardResponse
>;

export type MigrateDashboard = (options: {
  parameters: { dashboardId: string };
  iotSiteWiseClient: { describeDashboard: DescribeDashboard };
}) => Promise<DashboardConfiguration>;

export type DashboardToolbar = ({
  viewmode,
  viewport,
  dashboardConfiguration,
}: {
  viewmode: 'preview' | 'edit';
  dashboardConfiguration: DashboardConfiguration;
  viewport?: Viewport;
}) => ReactElement;

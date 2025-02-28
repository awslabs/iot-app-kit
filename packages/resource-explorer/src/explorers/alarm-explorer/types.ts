import { type TableProps } from '@cloudscape-design/components';
import {
  type IoTSiteWise,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import {
  type IoTEvents,
  type IoTEventsClient,
} from '@aws-sdk/client-iot-events';
import type {
  IsResourceDisabled,
  OnSelectResource,
  SelectedResources,
} from '../../types/common';
import type { CommonResourceExplorerProps } from '../../types/resource-explorer';
import type {
  AlarmResource,
  AlarmResourceWithLatestValue,
} from '../../types/resources';

export interface AlarmExplorerProps
  extends CommonResourceExplorerProps<AlarmResourceWithLatestValue> {
  iotSiteWiseClient?: IoTSiteWiseClient | IoTSiteWise;
  iotEventsClient?: IoTEventsClient | IoTEvents;
  parameters?: AlarmResourcesRequestParameters;
  onSelectAlarm?: OnSelectResource<AlarmResource>;
  selectedAlarms?: SelectedResources<AlarmResource>;
  isAlarmDisabled?: IsResourceDisabled<AlarmResource>;
  ariaLabels?: TableProps.AriaLabels<AlarmResource>;
  description?: string;
  timeZone?: string;
  significantDigits?: number;
}

export type AlarmResourcesRequestParameters =
  | readonly AlarmByAssetRequestParameters[]
  | readonly AlarmByAssetModelRequestParameters[];

export type AlarmByAssetRequestParameters = {
  assetId: string;
};

export type AlarmByAssetModelRequestParameters = {
  assetModelId: string;
};

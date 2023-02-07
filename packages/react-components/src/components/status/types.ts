import { WidgetSettings } from '../../common/dataTypes';

export type StatusProperties = WidgetSettings & {
  settings: StatusSettings;
};

export type StatusSettings = {
  color?: string; // hex string
  showTimestamp?: boolean;
  showName?: boolean;
  showIcon?: boolean;
  showValue?: boolean;
  showUnit?: boolean;
  fontSize?: number; // pixels
  secondaryFontSize?: number; // pixels
};

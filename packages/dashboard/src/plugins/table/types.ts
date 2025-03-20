import type {
  AssistantProperty,
  TableColumnDefinition,
  TableItem,
} from '@iot-app-kit/react-components';
import type { ComplexFontSettings } from '~/features/widget-customization/settings';
import type { QueryProperties } from '~/features/queries/queries';
import { type Threshold } from '@iot-app-kit/core';

export interface TableWidgetProperties extends QueryProperties {
  title?: string;
  thresholds?: Threshold[];
  fontSettings?: ComplexFontSettings;
  items?: TableItem[];
  columnDefinitions?: TableColumnDefinition[];
  significantDigits?: number;
  pageSize?: number;
  assistant?: AssistantProperty;
}

import type {
  AssistantProperty,
  TableColumnDefinition,
  TableItem,
} from '@iot-app-kit/react-components';
import type {
  ComplexFontSettings,
  ThresholdWithId,
} from '~/features/widget-customization/settings';
import type { QueryProperties } from '~/features/queries/queries';

export interface TableWidgetProperties extends QueryProperties {
  title?: string;
  thresholds?: ThresholdWithId[];
  fontSettings?: ComplexFontSettings;
  items?: TableItem[];
  columnDefinitions?: TableColumnDefinition[];
  significantDigits?: number;
  pageSize?: number;
  assistant?: AssistantProperty;
}

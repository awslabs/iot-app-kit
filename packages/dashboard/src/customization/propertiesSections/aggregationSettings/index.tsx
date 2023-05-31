import React from 'react';

import { PropertiesSection } from '~/customization/propertiesSectionComponent';
import { QueryWidget } from '~/customization/widgets/types';
import { DashboardWidget } from '~/types';
import AggregationSettings from './section';
import { FilterPredicate } from '~/customization/propertiesSection';

const supportsRawData: readonly string[] = ['line-chart', 'scatter-chart', 'status-timeline', 'table', 'kpi', 'status'];
const doesNotSupportRawData: readonly string[] = ['bar-chart'];

export const isRawDataAggregationsSupported = (widget: DashboardWidget): widget is QueryWidget =>
  supportsRawData.some((t) => t === widget.type);

export const isAggregationsSupportedWithoutRawData = (widget: DashboardWidget): widget is QueryWidget =>
  doesNotSupportRawData.some((t) => t === widget.type);

const AggregationsPropertiesSection = ({
  isVisible,
  supportsRawData,
}: {
  isVisible: FilterPredicate<QueryWidget>;
  supportsRawData: boolean;
}) => (
  <PropertiesSection
    isVisible={isVisible}
    render={({ useProperty }) => {
      const [query, updateQuery] = useProperty(
        (properties) => properties.queryConfig.query,
        (properties, updatedQuery) => ({
          ...properties,
          queryConfig: { ...properties.queryConfig, query: updatedQuery },
        })
      );
      return <AggregationSettings supportsRawData={supportsRawData} queryConfig={query} updateQuery={updateQuery} />;
    }}
  />
);

export const AggregationsSettingsConfiguration: React.FC = () => (
  <>
    <AggregationsPropertiesSection isVisible={isRawDataAggregationsSupported} supportsRawData={true} />
    <AggregationsPropertiesSection isVisible={isAggregationsSupportedWithoutRawData} supportsRawData={false} />
  </>
);

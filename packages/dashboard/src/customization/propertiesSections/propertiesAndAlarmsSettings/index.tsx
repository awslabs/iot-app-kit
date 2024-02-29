import React from 'react';

import { PropertiesSection } from '~/customization/propertiesSectionComponent';
import {
  LineScatterChartWidget,
  QueryWidget,
  TableWidget,
} from '~/customization/widgets/types';
import { DashboardWidget } from '~/types';
import { GeneralPropertiesAlarmsSection } from './section';
import { StyledPropertiesAlarmsSection } from './styledSection';
import { PropertyLens } from '~/customization/propertiesSection';
import { useClients } from '~/components/dashboard/clientContext';
import { spaceScaledXs } from '@cloudscape-design/design-tokens';
import { Maybe, maybeWithDefault } from '~/util/maybe';

// exclude table because it is handled specially
const isQueryWidgetExcludesTable = (w: DashboardWidget): w is QueryWidget =>
  'queryConfig' in w.properties && w.type !== 'table' && w.type !== 'xy-plot';
const isTableWidget = (w: DashboardWidget): w is TableWidget =>
  w.type === 'table';
const isStyledWidget = (w: DashboardWidget): w is LineScatterChartWidget =>
  w.type === 'xy-plot';

const RenderPropertiesSectionWithStyledQuery = ({
  useProperty,
}: {
  useProperty: PropertyLens<LineScatterChartWidget>;
}) => {
  const { iotSiteWiseClient } = useClients();

  const [queryConfig, updateQueryConfig] = useProperty(
    (properties) => properties.queryConfig,
    (properties, updatedQueryConfig) => ({
      ...properties,
      queryConfig: updatedQueryConfig,
    })
  );

  if (!iotSiteWiseClient) return null;

  return (
    <StyledPropertiesAlarmsSection
      queryConfig={queryConfig}
      updateQueryConfig={updateQueryConfig}
      client={iotSiteWiseClient}
    />
  );
};

const RenderPropertiesSectionWithoutTable = ({
  useProperty,
  maybeType,
}: {
  useProperty: PropertyLens<QueryWidget>;
  maybeType: Maybe<string>;
}) => {
  const { iotSiteWiseClient } = useClients();

  const [queryConfig, updateQueryConfig] = useProperty(
    (properties) => properties.queryConfig,
    (properties, updatedQueryConfig) => ({
      ...properties,
      queryConfig: updatedQueryConfig,
    })
  );
  const [styleSettings, updateStyleSettings] = useProperty(
    (properties) => properties.styleSettings,
    (properties, updatedStyleSettings) => ({
      ...properties,
      styleSettings: updatedStyleSettings,
    })
  );

  const type = maybeWithDefault(undefined, maybeType);
  const canColorProperty = !(type === 'kpi' || type === 'status');

  if (!iotSiteWiseClient) return null;

  return (
    <GeneralPropertiesAlarmsSection
      queryConfig={queryConfig}
      updateQueryConfig={updateQueryConfig}
      styleSettings={styleSettings}
      updateStyleSettings={updateStyleSettings}
      client={iotSiteWiseClient}
      colorable={canColorProperty}
    />
  );
};

const RenderPropertiesSectionForTables = ({
  useProperty,
}: {
  useProperty: PropertyLens<TableWidget>;
}) => {
  const { iotSiteWiseClient } = useClients();

  const [queryConfig, updateQueryConfig] = useProperty(
    (properties) => properties.queryConfig,
    (properties, updatedQueryConfig) => ({
      ...properties,
      queryConfig: updatedQueryConfig,
    })
  );
  const [styleSettings, updateStyleSettings] = useProperty(
    (properties) => properties.styleSettings,
    (properties, updatedStyleSettings) => ({
      ...properties,
      styleSettings: updatedStyleSettings,
    })
  );

  if (!iotSiteWiseClient) return null;

  return (
    <GeneralPropertiesAlarmsSection
      queryConfig={queryConfig}
      updateQueryConfig={updateQueryConfig}
      styleSettings={styleSettings}
      updateStyleSettings={updateStyleSettings}
      colorable={false}
      client={iotSiteWiseClient}
    />
  );
};

const propertiesAndAlarmSettingstyle = {
  padding: spaceScaledXs,
};

export const PropertiesAndAlarmsSettingsConfiguration: React.FC = () => (
  <div style={propertiesAndAlarmSettingstyle}>
    <PropertiesSection
      isVisible={isStyledWidget}
      render={({ useProperty }) => (
        <RenderPropertiesSectionWithStyledQuery useProperty={useProperty} />
      )}
    />
    <PropertiesSection
      isVisible={isQueryWidgetExcludesTable}
      render={({ useProperty, type }) => (
        <RenderPropertiesSectionWithoutTable
          maybeType={type}
          useProperty={useProperty}
        />
      )}
    />
    <PropertiesSection
      isVisible={isTableWidget}
      render={({ useProperty }) => (
        <RenderPropertiesSectionForTables useProperty={useProperty} />
      )}
    />
  </div>
);

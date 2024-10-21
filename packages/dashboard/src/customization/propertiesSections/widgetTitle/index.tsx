import React from 'react';

import SpaceBetween from '@cloudscape-design/components/space-between';
import { PropertyLens } from '~/customization/propertiesSection';
import { PropertiesSection } from '~/customization/propertiesSectionComponent';
import { CommonChartProperties } from '~/customization/widgets/types';
import { maybeWithDefault } from '~/helpers/maybe';
import { DashboardWidget } from '~/types';
import { TitleSection } from './titleSection';

const isWidgetTitle = (
  w: DashboardWidget
): w is DashboardWidget<CommonChartProperties> =>
  'queryConfig' in w.properties &&
  !(
    w.type === 'kpi' ||
    w.type === 'status' ||
    w.type === 'table' ||
    w.type === 'text'
  );

const RenderWidgetTitleSection = ({
  useProperty,
}: {
  useProperty: PropertyLens<DashboardWidget<CommonChartProperties>>;
}) => {
  const [titleMaybe, updateTitle] = useProperty(
    (properties) => properties.title,
    (properties, updatedTitle) => ({
      ...properties,
      title: updatedTitle,
    })
  );

  const title = maybeWithDefault(undefined, titleMaybe);

  return (
    <SpaceBetween size='s' direction='vertical'>
      <TitleSection title={title} updateTitle={updateTitle} />
    </SpaceBetween>
  );
};

export const WidgetTitle: React.FC = () => (
  <PropertiesSection
    isVisible={isWidgetTitle}
    render={({ useProperty }) => (
      <RenderWidgetTitleSection useProperty={useProperty} />
    )}
  />
);

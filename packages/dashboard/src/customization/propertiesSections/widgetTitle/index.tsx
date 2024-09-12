import React from 'react';

import SpaceBetween from '@cloudscape-design/components/space-between';
import { PropertiesSection } from '~/customization/propertiesSectionComponent';
import { DashboardWidget } from '~/types';
import { TitleSection } from './titleSection';
import { maybeWithDefault } from '~/util/maybe';
import { PropertyLens } from '~/customization/propertiesSection';

const RenderWidgetTitleSection = ({
  useProperty,
}: {
  useProperty: PropertyLens<DashboardWidget>;
}) => {
  const [titleMaybe, updateTitle] = useProperty(
    (properties) => properties.title,
    (properties, updatedTitle) => ({
      ...properties,
      title: updatedTitle,
    })
  );

  const title = maybeWithDefault('', titleMaybe) as string;

  return (
    <SpaceBetween size='s' direction='vertical'>
      <TitleSection title={title} updateTitle={updateTitle} />
    </SpaceBetween>
  );
};

export const WidgetTitle: React.FC = () => (
  <PropertiesSection
    render={({ useProperty }) => (
      <RenderWidgetTitleSection useProperty={useProperty} />
    )}
  />
);

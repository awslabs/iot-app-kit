import React, { FC } from 'react';
import { ExpandableSection, SpaceBetween } from '@cloudscape-design/components';
import ExpandableSectionHeader from '../../shared/expandableSectionHeader';
import { AssetQuery } from '@iot-app-kit/core';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardState } from '../../../../store/state';
import { useInput } from '../../utils';
import { onUpdateAssetQueryAction } from '../../../../store/actions/updateAssetQuery';
import { AppKitWidget, Widget } from '../../../../types';
import { PropertyComponent } from './propertyComponent';

const PropertiesAlarmsSection: FC = () => {
  const [assetQueries] = useInput<AssetQuery[]>('assets');

  const selectedWidget = useSelector<DashboardState, Widget>((state) => state.selectedWidgets[0]);
  const dispatch = useDispatch();
  const onDeleteAssetQuery = (assetId: string, propertyId: string) => {
    const newAssetQueries = assetQueries
      .map<AssetQuery>((query) => {
        if (assetId === query.assetId) {
          const { properties } = query;
          return {
            assetId,
            properties: properties.filter((p) => p.propertyId !== propertyId),
          };
        }
        return query;
      })
      .filter((assetQuery) => assetQuery.properties.length > 0);

    dispatch(
      onUpdateAssetQueryAction({
        assetQuery: newAssetQueries,
        widget: selectedWidget as AppKitWidget,
      })
    );
  };

  const components = assetQueries?.flatMap(({ assetId, properties }) =>
    properties.map(({ propertyId, refId = propertyId }) => (
      <PropertyComponent
        key={`${assetId}-${propertyId}`}
        propertyId={propertyId}
        assetId={assetId}
        refId={refId}
        onDeleteAssetQuery={() => onDeleteAssetQuery(assetId, propertyId)}
      />
    ))
  );

  return (
    <ExpandableSection
      headerText={<ExpandableSectionHeader>Properties & Alarms</ExpandableSectionHeader>}
      defaultExpanded
    >
      <SpaceBetween size="s" direction={'vertical'}>
        {components}
      </SpaceBetween>
    </ExpandableSection>
  );
};

export default PropertiesAlarmsSection;

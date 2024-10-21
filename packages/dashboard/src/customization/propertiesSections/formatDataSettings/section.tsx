import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { spaceScaledS } from '@cloudscape-design/design-tokens';
import { isNumeric } from '@iot-app-kit/core/dist/es/common/number';
import React from 'react';
import { DecimalPlacesField } from '~/features/decimal-places';
import { useSelectedWidgetIds } from '~/features/widget-selection/use-selected-widget-ids';
import {
  FormLabel,
  StyledExpandableSection,
} from '../components/styledComponents';
import './section.css';

export const DecimalPlacesSection = ({
  significantDigits,
  updateSignificantDigits,
}: {
  significantDigits: number | undefined;
  updateSignificantDigits: (newValue: number | undefined) => void;
}) => {
  const selectedWidgetIds = useSelectedWidgetIds();
  const selectedWidgetId = selectedWidgetIds[0];

  const onSignificantDigitsChange = (value: string) => {
    const newValue = isNumeric(value) ? parseInt(value) || 0 : undefined;
    if (newValue === undefined || newValue <= 100) {
      updateSignificantDigits(newValue);
    }
  };

  return (
    <StyledExpandableSection
      className='accordian-header'
      headerText='Format data'
      defaultExpanded
      variant='footer'
    >
      <Box padding='s'>
        <SpaceBetween size='m' direction='vertical'>
          <div
            className='settings-property-label'
            style={{ gap: spaceScaledS }}
          >
            <FormLabel htmlFor='decimal-places'> Decimal places</FormLabel>
            <div className='settings-property-label-control'>
              <DecimalPlacesField
                onChange={onSignificantDigitsChange}
                decimalPlaces={significantDigits}
                shouldClearErrors={selectedWidgetId}
              />
            </div>
          </div>
        </SpaceBetween>
      </Box>
    </StyledExpandableSection>
  );
};

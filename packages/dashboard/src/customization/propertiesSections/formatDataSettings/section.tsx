import { Box, SpaceBetween } from '@cloudscape-design/components';

import './section.css';

import { spaceScaledS } from '@cloudscape-design/design-tokens';
import { isNumeric } from '@iot-app-kit/core';
import DecimalPlaces from '~/components/decimalPlaces';
import { useSelectedWidgetIds } from '~/hooks/useSelectedWidget';
import {
  FormLabel,
  StyledExpandableSection,
} from '../components/styledComponents';

export const DecimalPlacesSection = ({
  significantDigits,
  updateSignificantDigits,
}: {
  significantDigits: number | undefined;
  updateSignificantDigits: (newValue: number | undefined) => void;
}) => {
  const selectedWidgets = useSelectedWidgetIds();
  const selectedWidgetId = selectedWidgets.at(0);

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
              <DecimalPlaces
                onSignificantDigitsChange={onSignificantDigitsChange}
                significantDigits={significantDigits}
                shouldClearErrors={Boolean(selectedWidgetId)}
              />
            </div>
          </div>
        </SpaceBetween>
      </Box>
    </StyledExpandableSection>
  );
};

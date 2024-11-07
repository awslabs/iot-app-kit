import { Box, SpaceBetween } from '@cloudscape-design/components';

import './section.css';

import { isNumeric } from '@iot-app-kit/core/dist/es/common/number';
import { useSelectedWidgets } from '~/hooks/useSelectedWidgets';
import { spaceScaledS } from '@cloudscape-design/design-tokens';
import {
  FormLabel,
  StyledExpandableSection,
} from '../components/styledComponents';
import DecimalPlaces from '~/components/decimalPlaces';

export const DecimalPlacesSection = ({
  significantDigits,
  updateSignificantDigits,
}: {
  significantDigits: number | undefined;
  updateSignificantDigits: (newValue: number | undefined) => void;
}) => {
  const selectedWidgets = useSelectedWidgets();
  const selectedWidgetId = selectedWidgets[0]?.id;

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
                shouldClearErrors={selectedWidgetId}
              />
            </div>
          </div>
        </SpaceBetween>
      </Box>
    </StyledExpandableSection>
  );
};

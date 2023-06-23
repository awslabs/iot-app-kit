import React from 'react';

import { ExpandableSection, Input, InputProps, SpaceBetween } from '@cloudscape-design/components';
import { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';

import * as awsui from '@cloudscape-design/design-tokens';
import { numberFromDetail } from '~/util/inputEvent';

import './section.css';
import { isNumeric } from '@iot-app-kit/core/dist/es/common/number';

export const SettingsSection = ({
  significantDigits,
  updateSignificantDigits,
}: {
  significantDigits: number | undefined;
  updateSignificantDigits: (newValue: number | undefined) => void;
}) => {
  const onSignificantDigitsChange: NonCancelableEventHandler<InputProps.ChangeDetail> = (event) => {
    updateSignificantDigits(isNumeric(event.detail.value) ? numberFromDetail(event) : undefined);
  };
  return (
    <ExpandableSection headerText='Settings' defaultExpanded>
      <SpaceBetween size='m' direction='vertical'>
        <div className='settings-property-label' style={{ gap: awsui.spaceScaledS }}>
          <label htmlFor='decimal-places'>Decimal places</label>
          <div className='settings-property-label-control'>
            <Input
              type='number'
              controlId='decimal-places'
              ariaLabel='decimal places'
              value={significantDigits?.toFixed() ?? ''}
              onChange={onSignificantDigitsChange}
            />
          </div>
        </div>
      </SpaceBetween>
    </ExpandableSection>
  );
};

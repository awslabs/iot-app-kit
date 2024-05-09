import React from 'react';
import { Value } from '../../shared-components';
import Box from '@cloudscape-design/components/box';
import { spaceScaledS } from '@cloudscape-design/design-tokens';

export type TooltipDiagnosticOptions = {
  id: string;
  name?: string;
  color?: string;
  value?: number;
  decimalPlaces?: number;
};

export const TooltipDiagnostic = ({
  name,
  color: backgroundColor,
  value,
  decimalPlaces,
}: TooltipDiagnosticOptions) => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'center',
          gap: spaceScaledS,
        }}
      >
        <div
          style={{
            height: 15,
            width: 15,
            borderRadius: 3,
            backgroundColor,
          }}
        />
        <Box variant='span'>{name}</Box>
      </div>
      <div style={{ alignSelf: 'end' }}>
        <Box>
          <Value
            value={value ? value * 100 : undefined}
            unit='%'
            precision={decimalPlaces}
          />
        </Box>
      </div>
    </>
  );
};

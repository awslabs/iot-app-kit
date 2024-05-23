import { Box, Container, ProgressBar } from '@cloudscape-design/components';
import React from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import * as awsui from '@cloudscape-design/design-tokens';

const ConvertingProgressContainer = styled(Container)`
  width: 100%;
`;

const ConvertingProgressDescriptionBox = styled(Box)`
  color: ${awsui.colorTextBodySecondary}!important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ConvertingProgress: React.FC<{ total: number; converted: number }> = ({ total, converted }) => {
  const { formatMessage } = useIntl();

  return (
    total > 0 && (
      <ConvertingProgressContainer data-testid='progress-container'>
        <ProgressBar
          status='in-progress'
          value={(converted / total) * 100}
          additionalInfo={
            <ConvertingProgressDescriptionBox>
              {formatMessage(
                {
                  defaultMessage: '{convertedNumber} out of {totalNumber} converted',
                  description: 'Progress Bar description',
                },
                { convertedNumber: converted, totalNumber: total },
              )}
            </ConvertingProgressDescriptionBox>
          }
          label={formatMessage({ defaultMessage: 'Converting nodes', description: 'Progress Bar label' })}
        />
      </ConvertingProgressContainer>
    )
  );
};

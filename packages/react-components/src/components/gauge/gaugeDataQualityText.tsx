// eslint-disable-next-line import/default
import React from 'react';
import { Quality } from '@aws-sdk/client-iotsitewise';
import { DataQualityText } from '../data-quality/data-quality-text';

export const GaugeDataQualityText = ({
  error,
  quality,
  showName,
}: {
  error?: string;
  quality?: Quality;
  showName?: boolean;
}) => {
  if (error || !quality) {
    return null;
  }
  return (
    <div
      className='gauge-data-quality'
      style={{ bottom: showName ? '36%' : '40%' }}
    >
      <div className='gauge-info-text'>
        <DataQualityText quality={quality} />
      </div>
    </div>
  );
};

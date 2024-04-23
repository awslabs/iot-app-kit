// eslint-disable-next-line import/default
import React from 'react';
import { Quality } from '@aws-sdk/client-iotsitewise';
import { DataQualityText } from '../data-quality/data-quality-text';

export const GaugeDataQualityText = ({
  error,
  quality,
}: {
  error?: string;
  quality?: Quality;
}) => {
  if (error || !quality) {
    return null;
  }
  return (
    <div className='gauge-data-quality'>
      <div className='gauge-info-text'>
        <DataQualityText quality={quality} />
      </div>
    </div>
  );
};

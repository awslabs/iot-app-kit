// eslint-disable-next-line import/default
import React from 'react';
import { Quality } from '@aws-sdk/client-iotsitewise';
import { DataQualityText } from '../data-quality/data-quality-text';
import { GaugeSettings } from './types';
import { colorTextHeadingDefault } from '@cloudscape-design/design-tokens';

export const GaugeText = ({
  error,
  quality,
  name,
  settings,
}: {
  error?: string;
  quality?: Quality;
  name?: string;
  settings?: GaugeSettings;
}) => {
  if (error || (!quality && !name)) {
    return null;
  }

  const hasVisibleName = settings?.showName && name;
  const hasVisibleQuality = quality && quality !== 'GOOD';

  return (
    <div
      className='gauge-text-container'
      style={{ bottom: hasVisibleName && hasVisibleQuality ? '12%' : '20%' }}
    >
      <div
        className='gauge-info-text'
        style={{
          color: colorTextHeadingDefault,
          fontSize: settings?.labelFontSize,
        }}
      >
        {settings?.showName && (
          <div className='gauge-property-name'>{name}</div>
        )}
        <DataQualityText quality={quality} />
      </div>
    </div>
  );
};

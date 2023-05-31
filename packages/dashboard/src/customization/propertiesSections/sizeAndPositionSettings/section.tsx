import type { FC } from 'react';
import React from 'react';
import { ExpandableSection, Input } from '@cloudscape-design/components';

import { trimRectPosition } from '~/util/trimRectPosition';
import type { BaseChangeDetail } from '@cloudscape-design/components/input/interfaces';
import type { DashboardWidget } from '~/types';

import * as awsui from '@cloudscape-design/design-tokens';

import { DashboardSelection } from '~/customization/propertiesSectionComponent';

import './section.css';

const defaultMessages = {
  x: 'X',
  y: 'Y',
  width: 'Width',
  height: 'Height',
  title: 'Size and position',
};
const parseNumber = (value: string) => {
  const parsedValue = parseInt(value);
  return isNaN(parsedValue) ? 0 : parsedValue;
};

type SizeAndPositionSectionProps = {
  size: ReturnType<DashboardSelection['useSize']>[0];
  updateSize: ReturnType<DashboardSelection['useSize']>[1];
  position: ReturnType<DashboardSelection['usePosition']>[0];
  updatePosition: ReturnType<DashboardSelection['usePosition']>[1];
};

export const SizeAndPositionSection: FC<SizeAndPositionSectionProps> = ({
  size,
  updateSize,
  position,
  updatePosition,
}) => {
  const { x, y, height, width } = { ...size, ...position };

  const onXChange: (event: { detail: BaseChangeDetail }) => void = ({ detail: { value } }) =>
    updatePosition({ x: parseNumber(value) - x, y: 0 });
  const onYChange: (event: { detail: BaseChangeDetail }) => void = ({ detail: { value } }) =>
    updatePosition({ y: parseNumber(value) - y, x: 0 });
  const onWidthChange: (event: { detail: BaseChangeDetail }) => void = ({ detail: { value } }) =>
    updateSize({
      x: parseNumber(value) - width,
      y: 0,
    });
  const onHeightChange: (event: { detail: BaseChangeDetail }) => void = ({ detail: { value } }) =>
    updateSize({
      y: parseNumber(value) - height,
      x: 0,
    });

  const formattedValue = trimRectPosition({ x, y, width, height } as DashboardWidget);
  return (
    <ExpandableSection headerText={defaultMessages.title} defaultExpanded>
      <div className='base-settings-grid' style={{ gap: awsui.spaceScaledS }}>
        <label htmlFor='base-settings-x' className='section-item-label'>
          {defaultMessages.x}
        </label>
        <Input
          controlId='base-settings-x'
          value={`${formattedValue.x}`}
          type='number'
          onChange={onXChange}
          data-test-id='base-setting-x-input'
        />

        <label htmlFor='base-settings-y' className='section-item-label'>
          {defaultMessages.y}
        </label>
        <Input
          controlId='base-settings-y'
          value={`${formattedValue.y}`}
          type='number'
          onChange={onYChange}
          data-test-id='base-setting-y-input'
        />

        <label htmlFor='base-settings-width' className='section-item-label'>
          {defaultMessages.width}
        </label>
        <Input
          controlId='base-settings-width'
          value={`${formattedValue.width}`}
          type='number'
          onChange={onWidthChange}
          data-test-id='base-setting-width-input'
        />

        <label htmlFor='base-settings-height' className='section-item-label'>
          {defaultMessages.height}
        </label>
        <Input
          controlId='base-settings-height'
          value={`${formattedValue.height}`}
          type='number'
          onChange={onHeightChange}
          data-test-id='base-setting-height-input'
        />
      </div>
    </ExpandableSection>
  );
};

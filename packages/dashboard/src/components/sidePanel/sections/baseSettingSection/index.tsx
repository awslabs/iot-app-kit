import type { FC } from 'react';
import React from 'react';
import { ExpandableSection, Input } from '@cloudscape-design/components';

import { trimRectPosition } from '~/util/trimRectPosition';
import type { BaseChangeDetail } from '@cloudscape-design/components/input/interfaces';
import type { Position, DashboardWidget } from '~/types';

import * as awsui from '@cloudscape-design/design-tokens';

import './index.css';
import { useDispatch } from 'react-redux';
import { onMoveWidgetsAction, onResizeWidgetsAction } from '~/store/actions';

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
export const BaseSettings: FC<DashboardWidget> = (widget) => {
  const { x, y, height, width } = widget;
  const dispatch = useDispatch();
  const moveWidget = (vector: Position) => {
    dispatch(
      onMoveWidgetsAction({
        widgets: [widget],
        vector,
        complete: true,
      })
    );
  };
  const onXChange: (event: { detail: BaseChangeDetail }) => void = ({ detail: { value } }) =>
    moveWidget({ x: parseNumber(value) - x, y: 0 });
  const onYChange: (event: { detail: BaseChangeDetail }) => void = ({ detail: { value } }) =>
    moveWidget({ y: parseNumber(value) - y, x: 0 });
  const onWidthChange: (event: { detail: BaseChangeDetail }) => void = ({ detail: { value } }) =>
    dispatch(
      onResizeWidgetsAction({
        anchor: 'right',
        widgets: [widget],
        vector: {
          x: parseNumber(value) - width,
          y: 0,
        },
      })
    );
  const onHeightChange: (event: { detail: BaseChangeDetail }) => void = ({ detail: { value } }) =>
    dispatch(
      onResizeWidgetsAction({
        anchor: 'bottom',
        widgets: [widget],
        vector: {
          y: parseNumber(value) - height,
          x: 0,
        },
      })
    );

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
      {/* </Grid> */}
    </ExpandableSection>
  );
};

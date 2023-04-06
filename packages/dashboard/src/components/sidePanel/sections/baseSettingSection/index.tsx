import type { FC } from 'react';
import * as React from 'react';
import { ExpandableSection, Input } from '@cloudscape-design/components';
import { trimRectPosition } from '~/util/trimRectPosition';
import type { BaseChangeDetail } from '@cloudscape-design/components/input/interfaces';
import type { Position, DashboardWidget } from '~/types';

import * as awsui from '@cloudscape-design/design-tokens';
import './index.css';
import { useDispatch } from 'react-redux';
import { onMoveWidgetsAction, onResizeWidgetsAction } from '~/store/actions';
import { Controller, useForm } from 'react-hook-form';
import { isValidWidgetDimension, safeParseInt } from './utils';

export const BaseSettings: FC<DashboardWidget> = (widget) => {
  const { x, y, height, width } = widget;
  const formattedValue = trimRectPosition({ x, y, width, height } as DashboardWidget);

  const {
    control,
    formState: { errors },
    setValue,
    trigger,
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    values: {
      width: formattedValue.width,
      height: formattedValue.height,
    },
  });

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
    moveWidget({ x: safeParseInt(value) - x, y: 0 });

  const onYChange: (event: { detail: BaseChangeDetail }) => void = ({ detail: { value } }) =>
    moveWidget({ y: safeParseInt(value) - y, x: 0 });

  const onWidthChange: (event: { detail: BaseChangeDetail }) => void = ({ detail: { value } }) => {
    if (isValidWidgetDimension(Number(value))) {
      dispatch(
        onResizeWidgetsAction({
          anchor: 'right',
          widgets: [widget],
          vector: {
            x: safeParseInt(value) - width,
            y: 0,
          },
        })
      );
    }

    setValue('width', Number(value));
  };

  const onHeightChange: (event: { detail: BaseChangeDetail }) => void = ({ detail: { value } }) => {
    if (isValidWidgetDimension(Number(value))) {
      dispatch(
        onResizeWidgetsAction({
          anchor: 'bottom',
          widgets: [widget],
          vector: {
            y: safeParseInt(value) - height,
            x: 0,
          },
        })
      );
    }

    setValue('height', Number(value));
  };

  return (
    <ExpandableSection headerText='Size and position' defaultExpanded>
      <div className='base-settings-grid' style={{ gap: awsui.spaceScaledS }}>
        <label htmlFor='base-settings-x' className='section-item-label'>
          X
        </label>
        <Input
          controlId='base-settings-x'
          value={`${formattedValue.x}`}
          type='number'
          onChange={onXChange}
          data-test-id='base-setting-x-input'
        />

        <label htmlFor='base-settings-y' className='section-item-label'>
          Y
        </label>
        <Input
          controlId='base-settings-y'
          value={`${formattedValue.y}`}
          type='number'
          onChange={onYChange}
          data-test-id='base-setting-y-input'
        />

        <label htmlFor='base-settings-width' className='section-item-label'>
          Width
        </label>

        <Controller
          name='width'
          control={control}
          render={({ field: { value } }) => (
            <Input
              controlId='base-settings-width'
              data-test-id='base-setting-width-input'
              invalid={Boolean(errors.width)}
              onBlur={() => trigger('width')}
              onChange={onWidthChange}
              type='number'
              value={String(value)}
            />
          )}
          rules={{ required: true, min: 2, max: 100 }}
        />

        <label htmlFor='base-settings-height' className='section-item-label'>
          Height
        </label>

        <Controller
          name='height'
          control={control}
          render={({ field: { value } }) => (
            <Input
              controlId='base-settings-height'
              data-test-id='base-setting-height-input'
              invalid={Boolean(errors.height)}
              onBlur={() => trigger('height')}
              onChange={onHeightChange}
              type='number'
              value={String(value)}
            />
          )}
          rules={{ required: true, min: 2, max: 100 }}
        />
      </div>
    </ExpandableSection>
  );
};

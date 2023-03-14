import React from 'react';
import { ExpandableSection, Input } from '@cloudscape-design/components';

import { trimWidgetPosition } from '~/util/trimWidgetPosition';
import { useWidgetLense } from '../../utils/useWidgetLense';
import type { FC } from 'react';
import type { BaseChangeDetail } from '@cloudscape-design/components/input/interfaces';
import type { Widget } from '~/types';

import * as awsui from '@cloudscape-design/design-tokens';

import './index.css';

const defaultMessages = {
  x: 'X',
  y: 'Y',
  width: 'Width',
  height: 'Height',
  title: 'Size and position',
};

export const BaseSettings: FC<Widget> = (widget) => {
  const [x, updateX] = useWidgetLense<Widget, number>(
    widget,
    (w) => w.x,
    (w, x) => ({ ...w, x })
  );
  const [y, updateY] = useWidgetLense<Widget, number>(
    widget,
    (w) => w.y,
    (w, y) => ({ ...w, y })
  );
  const [width, updateWidth] = useWidgetLense<Widget, number>(
    widget,
    (w) => w.width,
    (w, width) => ({ ...w, width })
  );
  const [height, updateHeight] = useWidgetLense<Widget, number>(
    widget,
    (w) => w.height,
    (w, height) => ({ ...w, height })
  );

  const onXChange: (event: { detail: BaseChangeDetail }) => void = ({ detail: { value } }) =>
    updateX(Math.round(parseFloat(value)));
  const onYChange: (event: { detail: BaseChangeDetail }) => void = ({ detail: { value } }) =>
    updateY(Math.round(parseFloat(value)));
  const onWidthChange: (event: { detail: BaseChangeDetail }) => void = ({ detail: { value } }) =>
    updateWidth(Math.round(parseFloat(value)));
  const onHeightChange: (event: { detail: BaseChangeDetail }) => void = ({ detail: { value } }) =>
    updateHeight(Math.round(parseFloat(value)));

  const formattedValue = trimWidgetPosition({ x, y, width, height } as Widget);
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

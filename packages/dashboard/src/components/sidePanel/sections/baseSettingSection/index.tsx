import React, { FC } from 'react';
import { BaseChangeDetail } from '@cloudscape-design/components/input/interfaces';
import { ExpandableSection, Grid, Input } from '@cloudscape-design/components';

import { trimWidgetPosition } from '~/util/trimWidgetPosition';
import { Widget } from '~/types';
import { useWidgetLense } from '../../utils/useWidgetLense';

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
  const gridDefinition = [{ colspan: 2 }, { colspan: 4 }, { colspan: 2 }, { colspan: 4 }];

  const formattedValue = trimWidgetPosition({ x, y, width, height } as Widget);
  return (
    <ExpandableSection headerText={defaultMessages.title} defaultExpanded>
      <Grid gridDefinition={gridDefinition}>
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
        <div className='section-item-label'>{defaultMessages.y}</div>
        <Input value={`${formattedValue.y}`} type='number' onChange={onYChange} data-test-id='base-setting-y-input' />
      </Grid>
      <Grid gridDefinition={gridDefinition}>
        <div className='section-item-label'>{defaultMessages.width}</div>
        <Input
          value={`${formattedValue.width}`}
          type='number'
          onChange={onWidthChange}
          data-test-id='base-setting-width-input'
        />
        <div className='section-item-label'>{defaultMessages.height}</div>
        <Input
          value={`${formattedValue.height}`}
          type='number'
          onChange={onHeightChange}
          data-test-id='base-setting-height-input'
        />
      </Grid>
    </ExpandableSection>
  );
};

import React, { FC } from 'react';
import { DashboardMessages } from '~/messages';
import { useInput } from '../../utils';
import { BaseChangeDetail } from '@cloudscape-design/components/input/interfaces';
import { ExpandableSection, Grid, Input } from '@cloudscape-design/components';
import { trimWidgetPosition } from '~/util/trimWidgetPosition';
import { Widget } from '~/types';

export const BaseSettings: FC<{ messageOverrides: DashboardMessages }> = ({
  messageOverrides: {
    sidePanel: { baseSettings },
  },
}) => {
  const [x, updateX] = useInput('x');
  const [y, updateY] = useInput('y');
  const onXChange: (event: { detail: BaseChangeDetail }) => void = ({ detail: { value } }) => updateX(parseInt(value));
  const onYChange: (event: { detail: BaseChangeDetail }) => void = ({ detail: { value } }) => updateY(parseInt(value));

  const [width, updateWidth] = useInput('width');
  const [height, updateHeight] = useInput('height');
  const onWidthChange: (event: { detail: BaseChangeDetail }) => void = ({ detail: { value } }) =>
    updateWidth(parseInt(value));
  const onHeightChange: (event: { detail: BaseChangeDetail }) => void = ({ detail: { value } }) =>
    updateHeight(parseInt(value));
  const gridDefinition = [{ colspan: 2 }, { colspan: 4 }, { colspan: 2 }, { colspan: 4 }];

  const formattedValue = trimWidgetPosition({ x, y, width, height } as Widget);
  return (
    <ExpandableSection headerText={baseSettings.title} defaultExpanded>
      <Grid gridDefinition={gridDefinition}>
        <div className='section-item-label'>{baseSettings.x}</div>
        <Input value={`${formattedValue.x}`} type='number' onChange={onXChange} data-test-id='base-setting-x-input' />
        <div className='section-item-label'>{baseSettings.y}</div>
        <Input value={`${formattedValue.y}`} type='number' onChange={onYChange} data-test-id='base-setting-y-input' />
      </Grid>
      <Grid gridDefinition={gridDefinition}>
        <div className='section-item-label'>{baseSettings.width}</div>
        <Input
          value={`${formattedValue.width}`}
          type='number'
          onChange={onWidthChange}
          data-test-id='base-setting-width-input'
        />
        <div className='section-item-label'>{baseSettings.height}</div>
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

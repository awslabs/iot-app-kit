import React, { FC } from 'react';
import { useMessage } from '../../../../messages';
import { useInput } from '../../utils';
import { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';
import { BaseChangeDetail } from '@cloudscape-design/components/input/interfaces';
import { ExpandableSection, Grid, Input } from '@cloudscape-design/components';

export const BaseSettings: FC = () => {
  const baseSettings = useMessage((message) => message.sidePanel.baseSettings);
  const [x, updateX] = useInput('x');
  const [y, updateY] = useInput('y');
  const onXChange: NonCancelableEventHandler<BaseChangeDetail> = ({ detail: { value } }) => updateX(parseInt(value));
  const onYChange: NonCancelableEventHandler<BaseChangeDetail> = ({ detail: { value } }) => updateY(parseInt(value));

  const [width, updateWidth] = useInput('width');
  const [height, updateHeight] = useInput('height');
  const onWidthChange: NonCancelableEventHandler<BaseChangeDetail> = ({ detail: { value } }) =>
    updateWidth(parseInt(value));
  const onHeightChange: NonCancelableEventHandler<BaseChangeDetail> = ({ detail: { value } }) =>
    updateHeight(parseInt(value));
  const gridDefinition = [{ colspan: 2 }, { colspan: 4 }, { colspan: 2 }, { colspan: 4 }];
  return (
    <ExpandableSection headerText={baseSettings.title} defaultExpanded>
      <Grid gridDefinition={gridDefinition}>
        <div className="section-item-label">{baseSettings.x}</div>
        <Input value={`${x}`} type="number" onChange={onXChange} data-test-id="base-setting-x-input" />
        <div className="section-item-label">{baseSettings.y}</div>
        <Input value={`${y}`} type="number" onChange={onYChange} data-test-id="base-setting-y-input" />
      </Grid>
      <Grid gridDefinition={gridDefinition}>
        <div className="section-item-label">{baseSettings.width}</div>
        <Input value={`${width}`} type="number" onChange={onWidthChange} data-test-id="base-setting-width-input" />
        <div className="section-item-label">{baseSettings.height}</div>
        <Input value={`${height}`} type="number" onChange={onHeightChange} data-test-id="base-setting-height-input" />
      </Grid>
    </ExpandableSection>
  );
};

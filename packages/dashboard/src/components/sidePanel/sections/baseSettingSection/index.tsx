import React, { FC } from 'react';
import { DashboardMessages } from '../../../../messages';
import { useInput } from '../../utils';
import { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';
import { BaseChangeDetail } from '@cloudscape-design/components/input/interfaces';
import { ExpandableSection, Grid, Input, SpaceBetween } from '@cloudscape-design/components';
import '../index.scss';

export const BaseSettings: FC<{ messageOverrides: DashboardMessages }> = ({
  messageOverrides: {
    sidePanel: { baseSettings },
  },
}) => {
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
      <SpaceBetween size={'xs'} direction={'vertical'}>
        <Grid gridDefinition={gridDefinition} disableGutters>
          <div className="side-panel-input">
            <span>{baseSettings.x}</span>
          </div>
          <div className="side-panel-input with-gutter">
            <Input value={`${x}`} type="number" onChange={onXChange} data-test-id="base-setting-x-input" />
          </div>
          <div className="side-panel-input">
            <span>{baseSettings.y}</span>
          </div>
          <div className="side-panel-input">
            <Input value={`${y}`} type="number" onChange={onYChange} data-test-id="base-setting-y-input" />
          </div>
        </Grid>
        <Grid gridDefinition={gridDefinition} disableGutters>
          <div className="side-panel-input grow with-gutter">
            <span>{baseSettings.width}</span>
          </div>
          <div className="side-panel-input with-gutter">
            <Input value={`${width}`} type="number" onChange={onWidthChange} data-test-id="base-setting-width-input" />
          </div>
          <div className="side-panel-input">
            <span>{baseSettings.height}</span>
          </div>
          <div className="side-panel-input">
            <Input
              value={`${height}`}
              type="number"
              onChange={onHeightChange}
              data-test-id="base-setting-height-input"
            />
          </div>
        </Grid>
      </SpaceBetween>
    </ExpandableSection>
  );
};

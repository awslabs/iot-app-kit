import React from 'react';
import {
  Checkbox,
  CheckboxProps,
  ExpandableSection,
  Input,
  Select,
  SelectProps,
  SpaceBetween,
} from '@cloudscape-design/components';
import ExpandableSectionHeader from '../shared/expandableSectionHeader';
import { capitalizeFirstLetter, useInput } from '../utils';
import SettingTile from '../shared/settingTile';
import { LEGEND_POSITION } from '@synchro-charts/core';
import { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';
import { BaseChangeDetail } from '@cloudscape-design/components/input/interfaces';

const ChartTitleSetting = () => {
  const [title, updateTitle] = useInput<string>('title');
  return (
    <SettingTile label={'Widget title'} gridDefinition={[{ colspan: 12 }]}>
      <div className="section-item-content">
        <Input value={title} onChange={({ detail: { value } }) => updateTitle(value)} />
      </div>
    </SettingTile>
  );
};

const SizeSettings = () => {
  const [width, updateWidth] = useInput<number>('width');
  const [height, updateHeight] = useInput<number>('height');
  const onWidthChange: NonCancelableEventHandler<BaseChangeDetail> = ({ detail: { value } }) =>
    updateWidth(parseInt(value));
  const onHeightChange: NonCancelableEventHandler<BaseChangeDetail> = ({ detail: { value } }) =>
    updateHeight(parseInt(value));
  return (
    <SettingTile label={'Size'} gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
      <div className="section-item-content">
        <div className="section-item-label">Width</div>
        <Input value={`${width}`} type="number" onChange={onWidthChange} />
      </div>
      <div className="section-item-content">
        <div className="section-item-label">Height</div>
        <Input value={`${height}`} type="number" onChange={onHeightChange} />
      </div>
    </SettingTile>
  );
};

const PositionSettings = () => {
  const [x, updateX] = useInput<number>('x');
  const [y, updateY] = useInput<number>('y');
  const onXChange: NonCancelableEventHandler<BaseChangeDetail> = ({ detail: { value } }) => updateX(parseInt(value));
  const onYChange: NonCancelableEventHandler<BaseChangeDetail> = ({ detail: { value } }) => updateY(parseInt(value));
  return (
    <SettingTile label={'Position'} gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
      <div className="section-item-content">
        <div className="section-item-label">X</div>
        <Input value={`${x}`} type="number" onChange={onXChange} />
      </div>
      <div className="section-item-content">
        <div className="section-item-label">Y</div>
        <Input value={`${y}`} type="number" onChange={onYChange} />
      </div>
    </SettingTile>
  );
};

const YAxisSettings = () => {
  const [title, updateTitle] = useInput<string>('properties.axis.labels.yAxis.content');
  const [showAxis = false, updateShowAxis] = useInput<boolean>('properties.axis.showY');
  const onTitleChange: NonCancelableEventHandler<BaseChangeDetail> = ({ detail: { value } }) => updateTitle(value);
  const onToggleShowAxis: NonCancelableEventHandler<CheckboxProps.ChangeDetail> = ({ detail: { checked } }) => {
    updateShowAxis(checked);
  };
  return (
    <SettingTile label={'Y-axis'} gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
      <div className="section-item-content">
        <div className="section-item-label">Title</div>
        <Input value={title} onChange={onTitleChange} />
      </div>
      <div className="section-item-content">
        <div className="section-item-label">Show</div>
        <Checkbox checked={showAxis} onChange={onToggleShowAxis} />
      </div>
    </SettingTile>
  );
};
const LegendSettings = () => {
  const [width = 0, updateWidth] = useInput<number>('properties.legend.width');
  const [position = 'Right', updatePosition] = useInput<LEGEND_POSITION>('properties.legend.position');
  const [title = '', updateTitle] = useInput<string>('properties.legend.legendLabels.title');
  const onWidthChange: NonCancelableEventHandler<BaseChangeDetail> = ({ detail: { value } }) =>
    updateWidth(parseInt(value));
  const onTitleChange: NonCancelableEventHandler<BaseChangeDetail> = ({ detail: { value } }) => updateTitle(value);
  const onPositionChange: NonCancelableEventHandler<SelectProps.ChangeDetail> = ({ detail: { selectedOption } }) => {
    updatePosition(selectedOption.value as LEGEND_POSITION);
  };
  return (
    <SettingTile label="Legend" gridDefinition={[{ colspan: 6 }, { colspan: 6 }, { colspan: 6 }]}>
      <div className="section-item-content">
        <div className="section-item-label">Width</div>
        <Input value={`${width}`} onChange={onWidthChange} />
      </div>
      <div className="section-item-content">
        <div className="section-item-label">Title</div>
        <Input value={title} onChange={onTitleChange} />
      </div>
      <div className="section-item-content">
        <div className="section-item-label">Position</div>
        <Select
          selectedOption={{ label: capitalizeFirstLetter(position), value: position }}
          onChange={onPositionChange}
          options={[
            {
              label: 'Right',
              value: LEGEND_POSITION.RIGHT,
            },
            {
              label: 'Bottom',
              value: LEGEND_POSITION.BOTTOM,
            },
          ]}
        />
      </div>
    </SettingTile>
  );
};

const ChartSettings = () => {
  return (
    <ExpandableSection headerText={<ExpandableSectionHeader>Chart Setting</ExpandableSectionHeader>} defaultExpanded>
      <SpaceBetween size="l" direction="vertical">
        <SizeSettings />
        <PositionSettings />
        <ChartTitleSetting />
        <YAxisSettings />
        <LegendSettings />
      </SpaceBetween>
    </ExpandableSection>
  );
};

export default ChartSettings;

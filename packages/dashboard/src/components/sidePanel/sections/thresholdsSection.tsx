import React, { FC, MouseEventHandler } from 'react';
import {
  Button,
  Checkbox,
  CheckboxProps,
  ExpandableSection,
  Input,
  InputProps,
  Select,
  SelectProps,
  SpaceBetween,
} from '@cloudscape-design/components';
import ExpandableSectionHeader from '../shared/expandableSectionHeader';
import { useInput } from '../utils';
import { COMPARISON_OPERATOR, ThresholdValue } from '@synchro-charts/core';
import { YAnnotation } from '@synchro-charts/core/dist/types/components/charts/common/types';
import './index.css';
import { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';
import SettingTile from '../shared/settingTile';

const ComparisonOperatorOptions: { label: string; value: COMPARISON_OPERATOR }[] = [
  { label: '>', value: COMPARISON_OPERATOR.GREATER_THAN },
  { label: '<', value: COMPARISON_OPERATOR.LESS_THAN },
  { label: '=', value: COMPARISON_OPERATOR.EQUAL },
  { label: '>=', value: COMPARISON_OPERATOR.GREATER_THAN_EQUAL },
  { label: '<=', value: COMPARISON_OPERATOR.LESS_THAN_EQUAL },
  // TECHDEBT: support new comparator `contains`
];
const DEFAULT_THRESHOLD_COLOR = '#000000';
const getRandomColor = () => `#` + Math.floor(Math.random() * 16777215).toString(16);

const ThresholdComponent: FC<{ path: string; deleteSelf: () => void }> = ({ path, deleteSelf }) => {
  const [color = DEFAULT_THRESHOLD_COLOR, updateThresholdColor] = useInput<string>(path + '.color');
  const [comparisonOperator, updateComparator] = useInput<string>(path + '.comparisonOperator');
  const [value = '', updateValue] = useInput<ThresholdValue>(path + '.value');
  const [description] = useInput(path + '.description');
  const [id = ''] = useInput(path + '.id');
  const selectedOption =
    ComparisonOperatorOptions.find(({ value }) => value === comparisonOperator) || ComparisonOperatorOptions[0];

  const onUpdateComparator: NonCancelableEventHandler<SelectProps.ChangeDetail> = ({ detail }) => {
    updateComparator(detail.selectedOption.value || comparisonOperator);
  };

  const onUpdateThresholdValue: NonCancelableEventHandler<InputProps.ChangeDetail> = ({ detail }) => {
    updateValue(detail.value);
  };

  const onUpdateThresholdColor = () => {
    // TODO: add color picker
    updateThresholdColor(getRandomColor());
  };

  return (
    <SettingTile label={`Threshold ${id}`} description={description}>
      <div className="threshold-container">
        <SpaceBetween size="xs" direction={'horizontal'}>
          if
          <Select
            className="threshold-content-select-label"
            options={ComparisonOperatorOptions}
            selectedOption={selectedOption}
            onChange={onUpdateComparator}
          />
          <Input value={`${value}`} placeholder="Threshold value" onChange={onUpdateThresholdValue} />
          <div
            className="threshold-content-color-picker"
            style={{ backgroundColor: color }}
            onClick={onUpdateThresholdColor}
          ></div>
          <div>
            <Button iconName="close" variant="icon" onClick={deleteSelf} />
          </div>
        </SpaceBetween>
      </div>
    </SettingTile>
  );
};

const ThresholdsSection = () => {
  const [thresholdList = [], updateThresholdList] = useInput<YAnnotation[]>('annotations.y');
  const [colorDataAcrossThresholds, updateColorDataAcrossThresholds] =
    useInput<boolean>('annotations.thresholdOptions');
  const [showThresholds, updateShowThresholds] = useInput<boolean>('annotations.show');
  const onCheckShowThresholds: NonCancelableEventHandler<CheckboxProps.ChangeDetail> = ({ detail: { checked } }) => {
    updateShowThresholds(checked);
  };
  const addNewThreshold: MouseEventHandler = (e) => {
    e.stopPropagation();
    const newThreshold: YAnnotation = {
      color: DEFAULT_THRESHOLD_COLOR,
      comparisonOperator: COMPARISON_OPERATOR.EQUAL,
      value: 10,
    };
    updateThresholdList([...thresholdList, newThreshold]);
  };
  const onCheckColorData: NonCancelableEventHandler<CheckboxProps.ChangeDetail> = ({ detail: { checked } }) => {
    updateColorDataAcrossThresholds(checked);
  };

  const deleteThresholdWithIndex = (index: number) => {
    updateThresholdList([...thresholdList.slice(0, index), ...thresholdList.slice(index + 1)]);
  };

  const thresholdComponents = thresholdList.map((threshold, index) => {
    return (
      <ThresholdComponent
        path={`annotations.y.${index}`}
        key={threshold.id || index}
        deleteSelf={() => deleteThresholdWithIndex(index)}
      />
    );
  });
  return (
    <ExpandableSection
      headerText={<ExpandableSectionHeader onClickButton={addNewThreshold}>Thresholds</ExpandableSectionHeader>}
      defaultExpanded
    >
      {thresholdComponents}
      <Checkbox checked={colorDataAcrossThresholds} onChange={onCheckColorData}>
        Color Data Across Thresholds
      </Checkbox>
      <Checkbox checked={showThresholds} onChange={onCheckShowThresholds}>
        Show Thresholds
      </Checkbox>
    </ExpandableSection>
  );
};

export default ThresholdsSection;

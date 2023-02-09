import React, { FC, MouseEventHandler } from 'react';
import { ExpandableSection, SpaceBetween, Toggle, ToggleProps } from '@cloudscape-design/components';
import ExpandableSectionHeader from '../../shared/expandableSectionHeader';
import { useInput } from '../../utils';
import { COMPARISON_OPERATOR, YAnnotation } from '@synchro-charts/core';
import { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';
import { DashboardMessages } from '../../../../messages';
import './index.scss';
import { DEFAULT_THRESHOLD_COLOR } from './defaultValues';
import { ThresholdComponent } from './thresholdComponent';

export type ThresholdsSectionProps = {
  messageOverrides: DashboardMessages;
};
const ThresholdsSection: FC<ThresholdsSectionProps> = ({ messageOverrides }) => {
  const [thresholdList = [], updateThresholdList] = useInput<YAnnotation[]>('annotations.y');
  const [colorDataAcrossThresholds = true, updateColorDataAcrossThresholds] =
    useInput<boolean>('annotations.thresholdOptions');

  const addNewThreshold: MouseEventHandler = (e) => {
    e.stopPropagation();
    const newThreshold: YAnnotation = {
      color: DEFAULT_THRESHOLD_COLOR,
      comparisonOperator: COMPARISON_OPERATOR.EQUAL,
      value: '',
    };
    updateThresholdList([...thresholdList, newThreshold]);
  };

  const onCheckColorData: NonCancelableEventHandler<ToggleProps.ChangeDetail> = ({ detail: { checked } }) => {
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
        messageOverrides={messageOverrides}
      />
    );
  });
  return (
    <ExpandableSection
      headerText={<ExpandableSectionHeader onClickButton={addNewThreshold}>Thresholds</ExpandableSectionHeader>}
      defaultExpanded
    >
      <SpaceBetween size={'xs'}>
        <Toggle checked={colorDataAcrossThresholds} onChange={onCheckColorData}>
          {messageOverrides.sidePanel.thresholdSettings.colorDataToggle}
        </Toggle>
        {thresholdComponents}
      </SpaceBetween>
    </ExpandableSection>
  );
};

export default ThresholdsSection;

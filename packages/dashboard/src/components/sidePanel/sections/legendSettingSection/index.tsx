import React, { FC, useEffect, useState } from 'react';
import { DashboardMessages } from '../../../../messages';
import {
  ExpandableSection,
  Grid,
  Input,
  InputProps,
  Select,
  SpaceBetween,
  Toggle,
} from '@cloudscape-design/components';
import { useAppKitWidgetInput } from '../../utils';
import { LEGEND_POSITION, LegendConfig } from '@synchro-charts/core';
import ExpandableSectionHeader from '../../shared/expandableSectionHeader';
import { SelectProps } from '@cloudscape-design/components/select/interfaces';

const defaultLegendSettings: LegendConfig = {
  legendLabels: { title: '' },
  position: LEGEND_POSITION.BOTTOM,
  showDataStreamColor: true,
  width: 150,
};
const LegendSettings: FC<{ messageOverrides: DashboardMessages }> = ({
  messageOverrides: {
    sidePanel: { legendSettingMessages },
  },
}) => {
  const [legendSettings, setLegendSettings] = useAppKitWidgetInput('legend');
  const onWidthChange = ({ detail }: { detail: InputProps.ChangeDetail }) => {
    setLegendSettings({ ...defaultLegendSettings, ...legendSettings, width: parseInt(detail.value) });
  };
  const [showLegend, setShowLegend] = useState<boolean>(!!legendSettings);
  const [recentLegendSettings, setRecentLegendSettings] = useState<LegendConfig>();

  useEffect(() => {
    if (!showLegend) {
      setRecentLegendSettings(legendSettings);
      setLegendSettings(undefined);
    } else {
      setLegendSettings(recentLegendSettings || defaultLegendSettings);
    }
  }, [showLegend]);

  const header = (
    <ExpandableSectionHeader>
      <div className="expandable-section-header">
        {legendSettingMessages.header}
        <div className="expandable-section-header-icon" onClick={(e) => e.stopPropagation()}>
          <Toggle
            checked={showLegend}
            onChange={({ detail }) => setShowLegend(detail.checked)}
            data-test-id="legend-setting-view-toggle"
          >
            {legendSettingMessages.showLegend}
          </Toggle>
        </div>
      </div>
    </ExpandableSectionHeader>
  );

  const positionOptions: SelectProps.Option[] = [
    { label: legendSettingMessages.position.right, value: LEGEND_POSITION.RIGHT },
    { label: legendSettingMessages.position.bottom, value: LEGEND_POSITION.BOTTOM },
  ];
  const selectedOption = positionOptions.find((option) => option.value === legendSettings?.position) || null;

  const onSelectChange = ({ detail }: { detail: SelectProps.ChangeDetail }) => {
    setLegendSettings({
      ...defaultLegendSettings,
      ...legendSettings,
      position: detail.selectedOption.value as LEGEND_POSITION,
    });
  };

  return (
    <ExpandableSection headerText={header} defaultExpanded>
      <SpaceBetween size={'xs'} direction={'vertical'}>
        <Grid gridDefinition={[{ colspan: 2 }, { colspan: 4 }, { colspan: 2 }, { colspan: 4 }]} disableGutters>
          <div className="side-panel-input">
            <span>{legendSettingMessages.position.label}</span>
          </div>
          <div className="side-panel-input grow with-gutter">
            <Select
              disabled={!showLegend}
              options={positionOptions}
              selectedOption={selectedOption}
              onChange={onSelectChange}
              data-test-id="legend-setting-position-select"
            />
          </div>
          <div className="side-panel-input">
            <span>{legendSettingMessages.width} </span>
          </div>
          <div className="side-panel-input grow">
            <Input
              disabled={!showLegend || legendSettings?.position === LEGEND_POSITION.BOTTOM}
              value={`${legendSettings?.width}`}
              onChange={onWidthChange}
              data-test-id="legend-setting-width-input"
            />
          </div>
        </Grid>

        <div className="side-panel-input grow">
          <Toggle
            disabled={!showLegend}
            checked={legendSettings?.showDataStreamColor || false}
            onChange={({ detail }) =>
              setLegendSettings({
                ...defaultLegendSettings,
                ...legendSettings,
                showDataStreamColor: detail.checked,
              })
            }
            data-test-id="legend-setting-color-data-toggle"
          >
            {legendSettingMessages.showColor}
          </Toggle>
        </div>
      </SpaceBetween>
    </ExpandableSection>
  );
};

export default LegendSettings;

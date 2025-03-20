import Tabs, { type TabsProps } from '@cloudscape-design/components/tabs';
import { useCallback, useMemo, useState } from 'react';
import {
  type RegisteredWidgetType,
  Registry,
} from '../widget-plugins/registry';
import { type WidgetInstance } from '~/features/widget-instance/instance';

const STYLE_SETTINGS_TAB_ID = 'style-settings-tab';
const DATA_STREAM_SETTINGS_TAB_ID = 'data-stream-settings-tab';
const THRESHOLD_SETTINGS_TAB_ID = 'threshold-settings-tab';

type SettingsTabId =
  | typeof STYLE_SETTINGS_TAB_ID
  | typeof DATA_STREAM_SETTINGS_TAB_ID
  | typeof THRESHOLD_SETTINGS_TAB_ID;

export interface SettingsPanelProps<Type extends RegisteredWidgetType> {
  widget: WidgetInstance<Type>;
}

export const SettingsPanel = <Type extends RegisteredWidgetType>({
  widget,
}: SettingsPanelProps<Type>) => {
  const [activeTabId, setActiveTabId] = useState<SettingsTabId>(
    STYLE_SETTINGS_TAB_ID
  );

  const handleSelectTab = useCallback(
    ({
      detail: { activeTabId: updatedActiveTabId },
    }: Parameters<NonNullable<TabsProps['onChange']>>[0]) => {
      setActiveTabId(updatedActiveTabId as SettingsTabId);
    },
    []
  );

  const tabs = useMemo(() => {
    const {
      StyleSettingsComponent,
      DataStreamSettingsComponent,
      ThresholdSettingsComponent,
    } = Registry.get(widget.type);

    return [
      {
        label: 'Style',
        id: STYLE_SETTINGS_TAB_ID,
        content: StyleSettingsComponent ? (
          <StyleSettingsComponent widget={widget} />
        ) : null,
        disabled: !StyleSettingsComponent,
      },
      {
        label: 'Properties',
        id: DATA_STREAM_SETTINGS_TAB_ID,
        content: DataStreamSettingsComponent ? (
          <DataStreamSettingsComponent widget={widget} />
        ) : null,
        disabled: !DataStreamSettingsComponent,
      },
      {
        label: 'Thresholds',
        id: THRESHOLD_SETTINGS_TAB_ID,
        content: ThresholdSettingsComponent ? (
          <ThresholdSettingsComponent widget={widget} />
        ) : null,
        disabled: !ThresholdSettingsComponent,
      },
    ];
  }, [widget]);

  return (
    <Tabs
      tabs={tabs as TabsProps['tabs']}
      activeTabId={activeTabId}
      onChange={handleSelectTab}
    />
  );
};

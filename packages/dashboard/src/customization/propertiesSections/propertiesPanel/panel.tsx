import Box from '@cloudscape-design/components/box';
import Tabs, { type TabsProps } from '@cloudscape-design/components/tabs';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { PropertiesPanelEmpty } from './emptyPanel';
import { StylesSection } from './styleTab';
import { PropertiesAndAlarmsSettingsConfiguration } from '../propertiesAndAlarmsSettings';
import { ThresholdSettingsConfiguration } from '../thresholdSettings';
import { useSelectedWidgets } from '~/hooks/useSelectedWidget';
import { useCallback, useEffect, useState } from 'react';

const STYLE_TAB_ID = 'style';
const PROPERTIES_TAB_ID = 'properties';
const THRESHOLDS_TAB_ID = 'thresholds';
type SelectedTabId =
  | typeof STYLE_TAB_ID
  | typeof PROPERTIES_TAB_ID
  | typeof THRESHOLDS_TAB_ID;

/** Panel element responsible for rendering chart configuration sections. */
export const PropertiesPanel = () => {
  const [selectedTabId, setSelectedTabId] = useState<SelectedTabId>('style');
  const selectedWidgets = useSelectedWidgets();
  const firstSelectedWidget = selectedWidgets.at(0);

  useEffect(() => {
    setSelectedTabId('style');
  }, [firstSelectedWidget?.id]);

  const handleSelectTab = useCallback(
    (e: Parameters<NonNullable<TabsProps['onChange']>>[0]) => {
      setSelectedTabId(e.detail.activeTabId as SelectedTabId);
    },
    []
  );

  return selectedWidgets.length > 0 ? (
    <Box>
      <Tabs
        disableContentPaddings
        activeTabId={selectedTabId}
        onChange={handleSelectTab}
        tabs={[
          {
            label: 'Style',
            id: STYLE_TAB_ID,
            content: <StylesSection />,
          },
          {
            label: 'Properties',
            id: PROPERTIES_TAB_ID,
            // FIXME: Remove widget specific code
            disabled: firstSelectedWidget?.type === 'text',
            content: (
              <SpaceBetween size='xs' direction='vertical'>
                <PropertiesAndAlarmsSettingsConfiguration />
              </SpaceBetween>
            ),
          },
          {
            label: 'Thresholds',
            id: THRESHOLDS_TAB_ID,
            // FIXME: Remove widget specific code
            disabled: firstSelectedWidget?.type === 'text',
            content: (
              <SpaceBetween size='xs' direction='vertical'>
                <ThresholdSettingsConfiguration />
              </SpaceBetween>
            ),
          },
        ]}
      />
    </Box>
  ) : (
    <PropertiesPanelEmpty />
  );
};

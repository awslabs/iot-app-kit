import React from 'react';
import { I18nProvider } from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.all';

import { InternalAlarmExplorer } from './internal-alarm-explorer';
import type { AlarmExplorerProps } from './types';

/**
 * Explore and select IoT SiteWise alarm resources.
 * This explorer will be able to handle displaying
 * alarm resources by assetModel paramater or by
 * assetId parameters
 *
 * @experimental Do not use in production.
 */
export function AlarmExplorer(alarmExplorerProps: AlarmExplorerProps) {
  return (
    <I18nProvider locale='en' messages={[messages]}>
      <InternalAlarmExplorer {...alarmExplorerProps} />
    </I18nProvider>
  );
}

import React from 'react';

import { IoTSiteWiseQueryEditor } from './iotSiteWiseQueryEditor';
import { QueryEditorErrorBoundary } from './queryEditorErrorBoundary';
import { useQuery } from './useQuery';
import { type IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import { type DashboardWidget } from '~/types';
import { useIsAddButtonDisabled } from './helpers/useIsAddButtonDisabled';
import { getCorrectSelectionMode } from './helpers/getCorrectSelectionMode';

export function QueryEditor({
  iotSiteWiseClient,
  selectedWidgets,
}: {
  iotSiteWiseClient: IoTSiteWise;
  selectedWidgets: DashboardWidget[];
}) {
  const [_query, setQuery] = useQuery();
  const addButtonDisabled = useIsAddButtonDisabled(selectedWidgets);
  const correctSelectionMode = getCorrectSelectionMode(selectedWidgets);

  return (
    <QueryEditorErrorBoundary>
      <IoTSiteWiseQueryEditor
        onUpdateQuery={setQuery}
        iotSiteWiseClient={iotSiteWiseClient}
        selectedWidgets={selectedWidgets}
        addButtonDisabled={addButtonDisabled}
        correctSelectionMode={correctSelectionMode}
      />
    </QueryEditorErrorBoundary>
  );
}

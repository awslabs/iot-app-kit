import React from 'react';

import { IoTSiteWiseQueryEditor } from './iotSiteWiseQueryEditor';
import { QueryEditorErrorBoundary } from './queryEditorErrorBoundary';
import { useQuery } from './useQuery';
import { IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import { DashboardWidget } from '~/types';
import { useIsAddButtonDisabled } from './helpers/useIsAddButtonDisabled';
import { getCorrectSelectionMode } from './helpers/getCorrectSelectionMode';

export function QueryEditor({
  iotSiteWise,
  selectedWidgets,
}: {
  iotSiteWise: IoTSiteWise;
  selectedWidgets: DashboardWidget[];
}) {
  const [_query, setQuery] = useQuery();
  const addButtonDisabled = useIsAddButtonDisabled(selectedWidgets);
  const correctSelectionMode = getCorrectSelectionMode(selectedWidgets);

  return (
    <QueryEditorErrorBoundary>
      <IoTSiteWiseQueryEditor
        onUpdateQuery={setQuery}
        iotSiteWise={iotSiteWise}
        selectedWidgets={selectedWidgets}
        addButtonDisabled={addButtonDisabled}
        correctSelectionMode={correctSelectionMode}
      />
    </QueryEditorErrorBoundary>
  );
}

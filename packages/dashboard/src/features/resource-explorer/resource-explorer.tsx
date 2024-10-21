import React, { memo } from 'react';
import { IoTSiteWiseQueryEditor } from './iotSiteWiseQueryEditor';
import { QueryEditorErrorBoundary } from './queryEditorErrorBoundary';

export const ResourceExplorer = memo(function () {
  return (
    <QueryEditorErrorBoundary>
      <IoTSiteWiseQueryEditor />
    </QueryEditorErrorBoundary>
  );
});

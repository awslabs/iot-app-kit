import React from 'react';

import { IoTSiteWiseQueryEditor } from './iotSiteWiseQueryEditor';
import { QueryEditorErrorBoundary } from './queryEditorErrorBoundary';
import { useQuery } from './useQuery';
import { IoTSiteWise, IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';

export function QueryEditor({
  iotSiteWiseClient,
  iotTwinMakerClient,
  iotSiteWise,
}: {
  iotSiteWiseClient: IoTSiteWiseClient;
  iotTwinMakerClient: IoTTwinMakerClient;
  iotSiteWise: IoTSiteWise;
}) {
  const [_query, setQuery] = useQuery();

  return (
    <QueryEditorErrorBoundary>
      <IoTSiteWiseQueryEditor
        onUpdateQuery={setQuery}
        iotSiteWiseClient={iotSiteWiseClient}
        iotTwinMakerClient={iotTwinMakerClient}
        iotSiteWise={iotSiteWise}
      />
    </QueryEditorErrorBoundary>
  );
}

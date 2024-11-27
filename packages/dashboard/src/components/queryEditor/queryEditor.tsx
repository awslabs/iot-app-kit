import { type IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import { type DashboardWidget } from '../../types';
import { getCorrectSelectionMode } from './helpers/getCorrectSelectionMode';
import { useIsAddButtonDisabled } from './helpers/useIsAddButtonDisabled';
import { IoTSiteWiseQueryEditor } from './iotSiteWiseQueryEditor';
import { useAssetsForAssetModel } from './iotSiteWiseQueryEditor/assetModelDataStreamExplorer/assetsForAssetModelSelect/useAssetsForAssetModel/useAssetsForAssetModel';
import { useModelBasedQuery } from './iotSiteWiseQueryEditor/assetModelDataStreamExplorer/modelBasedQuery/useModelBasedQuery';
import { QueryEditorErrorBoundary } from './queryEditorErrorBoundary';
import { useQuery } from './useQuery';

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
  const { assetModelId, assetIds } = useModelBasedQuery();
  const { assetSummaries } = useAssetsForAssetModel({
    assetModelId,
    iotSiteWiseClient,
    fetchAll: true,
  });

  const currentSelectedAsset = assetSummaries.find(
    ({ id }) => id === assetIds?.at(0)
  );

  return (
    <QueryEditorErrorBoundary>
      <IoTSiteWiseQueryEditor
        onUpdateQuery={setQuery}
        iotSiteWiseClient={iotSiteWiseClient}
        selectedWidgets={selectedWidgets}
        addButtonDisabled={addButtonDisabled}
        correctSelectionMode={correctSelectionMode}
        currentSelectedAsset={currentSelectedAsset}
      />
    </QueryEditorErrorBoundary>
  );
}

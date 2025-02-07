import { IoTSiteWiseQueryEditor } from './iotSiteWiseQueryEditor';
import { QueryEditorErrorBoundary } from './queryEditorErrorBoundary';
import { useQuery } from './iotSiteWiseQueryEditor/useQuery/useQuery';
import { type IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import { useIsAddButtonDisabled } from './helpers/useIsAddButtonDisabled';
import { getCorrectSelectionMode } from './helpers/getCorrectSelectionMode';
import { useAssetsForAssetModel } from './iotSiteWiseQueryEditor/assetModelDataStreamExplorer/assetsForAssetModelSelect/useAssetsForAssetModel/useAssetsForAssetModel';
import { useModelBasedQuery } from './iotSiteWiseQueryEditor/useQuery/useModelBasedQuery';
import { type WidgetInstance } from '~/features/widget-instance/instance';

export function QueryEditor({
  iotSiteWiseClient,
  selectedWidgets,
}: {
  iotSiteWiseClient: IoTSiteWise;
  selectedWidgets: WidgetInstance[];
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

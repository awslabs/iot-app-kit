import { IoTSiteWiseQueryEditor } from './iotSiteWiseQueryEditor';
import { QueryEditorErrorBoundary } from './queryEditorErrorBoundary';
import { useQuery } from './useQuery';
import { type IoTSiteWise } from '@aws-sdk/client-iotsitewise';
import { useIsAddButtonDisabled } from './helpers/useIsAddButtonDisabled';
import { getCorrectSelectionMode } from './helpers/getCorrectSelectionMode';
import { useAssetsForAssetModel } from './iotSiteWiseQueryEditor/assetModelDataStreamExplorer/assetsForAssetModelSelect/useAssetsForAssetModel/useAssetsForAssetModel';
import { useModelBasedQuery } from './iotSiteWiseQueryEditor/assetModelDataStreamExplorer/modelBasedQuery/useModelBasedQuery';
import { useSelectedWidgets } from '~/hooks/useSelectedWidget';

export interface QueryEditorProps {
  iotSiteWiseClient: IoTSiteWise;
}

export function QueryEditor({ iotSiteWiseClient }: QueryEditorProps) {
  const selectedWidgets = useSelectedWidgets();
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

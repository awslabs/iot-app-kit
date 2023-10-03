import { rest } from 'msw';
import { listWorkspacesRequestStub } from './handlers/iot-twinmaker/list-workspaces-request-stub';
import { executeQueryRequestStub } from './handlers/iot-twinmaker/execute-query-request-stub';
import { defaultDescribeAssetHandler } from './handlers/iot-sitewise/describeAsset/defaultDescribeAssetHandler';
import { defaultListAssetsHandler } from './handlers/iot-sitewise/listAssets/defaultListAssetsHandler';
import { listAssociatedAssetsHandler } from './handlers/iot-sitewise/listAssociatedAssets/listAssociatedAssetsHandler';
import { batchGetAssetPropertyValueHandler } from './handlers/iot-sitewise/batchGetAssetPropertyValue/batchGetAssetPropertyValue';

export const handlers = [
  // https://docs.aws.amazon.com/iot-twinmaker/latest/apireference/API_ListWorkspaces.html#API_ListWorkspaces_RequestSyntax
  rest.post('https://api.iottwinmaker.us-east-1.amazonaws.com/workspaces-list', listWorkspacesRequestStub),
  // https://docs.aws.amazon.com/iot-twinmaker/latest/apireference/API_ExecuteQuery.html
  rest.post('https://api.iottwinmaker.us-east-1.amazonaws.com/queries/execution', executeQueryRequestStub),

  defaultDescribeAssetHandler(),
  defaultListAssetsHandler(),
  listAssociatedAssetsHandler(),
  batchGetAssetPropertyValueHandler(),
];

import React from 'react';
import { StencilResourceExplorer } from './stencil';
import type { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import Box from '@cloudscape-design/components/box';

const defaultMessages = {
  explorerEmptyLabel: 'No resources found. Please provide an asset tree query from source-iotsitewise.',
};

export const ResourceExplorer = ({ treeQuery }: { treeQuery: SiteWiseQuery | undefined }) =>
  treeQuery?.assetTree?.fromRoot ? (
    <StencilResourceExplorer treeQuery={treeQuery.assetTree.fromRoot} />
  ) : (
    <Box>{defaultMessages.explorerEmptyLabel}</Box>
  );

export default React.memo(
  ResourceExplorer,
  (p, n) => p.treeQuery?.assetTree.fromRoot().toQueryString() === n.treeQuery?.assetTree.fromRoot().toQueryString()
);

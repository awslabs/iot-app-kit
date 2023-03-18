import React, { memo } from 'react';
import { StencilResourceExplorer } from './stencil';
import Box from '@cloudscape-design/components/box';
import { useQueries } from '../dashboard/queryContext';

const defaultMessages = {
  explorerEmptyLabel: 'No resources found. Please provide an asset tree query from source-iotsitewise.',
};

export const ResourceExplorer = () => {
  const { iotSiteWiseQuery } = useQueries();

  const treeQuery = iotSiteWiseQuery?.assetTree.fromRoot;

  return treeQuery ? (
    <StencilResourceExplorer treeQuery={treeQuery} />
  ) : (
    <Box>{defaultMessages.explorerEmptyLabel}</Box>
  );
};

export default memo(ResourceExplorer);

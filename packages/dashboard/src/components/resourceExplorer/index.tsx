import React from 'react';
import { StencilResourceExplorer } from './stencil';
import { SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';

export const ResourceExplorer = ({ treeQuery }: { treeQuery: SiteWiseQuery }) => (
  <StencilResourceExplorer treeQuery={treeQuery} />
);

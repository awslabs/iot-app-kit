import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ErrorDetails, TreeQuery } from '@iot-app-kit/core';
import { BranchReference, SiteWiseAssetTreeNode } from '@iot-app-kit/source-iotsitewise';
import { AssetSummary } from '@aws-sdk/client-iotsitewise';
import { MaybeSiteWiseAssetTreeSessionInterface } from './types';

export const parseAssetNodes = (assetNodes: SiteWiseAssetTreeNode[]) => {
  const parsed: AssetSummary[] = [];
  if (!assetNodes) return parsed;
  try {
    for (const node in assetNodes) {
      parsed.push(assetNodes[node].asset);
    }
  } catch (err) {
    console.log(err);
  }
  return parsed;
};

export const useBuildProvider = (treeQuery: TreeQuery<SiteWiseAssetTreeNode[], BranchReference, void>) => {
  const [provider, setProvider] = useState<MaybeSiteWiseAssetTreeSessionInterface>(undefined);
  const [errors, setErrors] = useState<ErrorDetails[]>([]);
  const [rootItems, setRootItems] = useState<AssetSummary[] | undefined>(undefined);

  useEffect(() => {
    const nextProvider = treeQuery.build(uuidv4());
    nextProvider.subscribe({
      next: (data: SiteWiseAssetTreeNode[]) => {
        if (rootItems === null) setRootItems(parseAssetNodes(data));
      },
      error: (err: ErrorDetails[]) => {
        setErrors(err);
      },
    });
    setProvider(nextProvider);
    return () => {
      nextProvider.unsubscribe();
    };
  }, [JSON.stringify(treeQuery)]);

  return { provider, errors, rootItems };
};

# IoT App Kit Data

This document describes a multi-threaded approach to evolving the IoT App Kit data layer.

## Consumption of the AWS SDK in React components
- https://tkdodo.eu/blog/leveraging-the-query-function-context 

```
const assetKeys = {
  all: [{ service: 'sitewise', scope: 'assets' }],
  lists: () => [{ ...assetKeys.all[0], resource: 'asset summary' }] as const,
  list: (filter?: 'ALL' | 'TOP_LEVEL', assetModelId?: string) => [{ ...assetKeys.lists()[0], filter, assetModelId } as const,
  descriptions: () => [{ ...todoKeys.all[0], resource: 'asset description' }] as const,
  description: (assetId: string) => [{ ...assetKeys.descriptions()[0], assetId }] as const,
};

async function describeAsset({ queryKey: [{ assetId }], signal }: QueryFunctionContext<ReturnType<typeof assetKeys['description']>>) {
  const command = new DescribeAssetCommand({ filter, assetModelId }, { abortSignal: signal });
  return client.send(command);
}

function useDescribeAsset(input: DescribeAssetCommandInput) {
  return useQuery({
    queryKey: assetKeys.description(input.assetId),
    queryFn: describeAsset,
  });
}
```

### Offline mode
Requests will not be sent when offline.

Tanstack Query will not send notifications when offline.

### Query cancellation
Automatic query cancellation enables the cancellation of queries when a component is unmounted.

Typically, these requests would still fire and the dat would be held in the cache. If the component was remounted and the data is valid, the cached data will be used to hydrate the component instead of sending a new request.

This is not typical. We do not want to waste resources on sending requests we never need the data from.

```typescript
function useDescribeAsset() {
  return useQuery({
    queryFn: ({ signal }) => client.send(new DescribeAssetCommand(input), { abortSignal: signal }),
    // ...
  });
}
```

```typescript
function useListAssets() {
  return useInfiniteQuery({
    queryFn: ({ pageParam, signal }) => client.send(new ListAssetsCommand({ ...input, nextToken: pageParam }, { abortSignal: signal }))
       // ... 
    }
  });
}
```

## Requesting time series data

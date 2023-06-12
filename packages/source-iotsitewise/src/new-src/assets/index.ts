import {
  AssociateAssetsCommand,
  CreateAssetCommand,
  DeleteAssetCommand,
  DescribeAssetCommand,
  DisassociateAssetsCommand,
  ListAssetsCommand,
  ListAssociatedAssetsCommand,
  UpdateAssetCommand,
  type AssociateAssetsCommandInput,
  type CreateAssetCommandInput,
  type DeleteAssetCommandInput,
  type DescribeAssetCommandInput,
  type DisassociateAssetsCommandInput,
  type ListAssetsCommandInput,
  type ListAssociatedAssetsCommandInput,
  type UpdateAssetCommandInput,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import {
  useQuery,
  useQueryClient,
  useInfiniteQuery,
  useMutation,
  type QueryFunctionContext,
} from '@tanstack/react-query';

const iotSiteWiseKey = [{ service: 'iot sitewise' }] as const;

const assetKeys = {
  all: [{ ...iotSiteWiseKey[0], scope: 'assets' }] as const,
  lists: () => [{ ...assetKeys.all[0], resource: 'asset summary' }] as const,
  list: (input: ListAssetsCommandInput) =>
    [{ ...assetKeys.lists()[0], filter: input.filter, assetModelId: input.assetModelId }] as const,
  associatedLists: () => [{ ...assetKeys.all[0], resource: 'associated asset summary' }] as const,
  associatedList: ({ assetId, hierarchyId, traversalDirection }: ListAssociatedAssetsCommandInput) =>
    [{ ...assetKeys.associatedLists()[0], assetId, hierarchyId, traversalDirection }] as const,
  descriptions: () => [{ ...assetKeys.all[0], resource: 'asset description' }] as const,
  description: (input: DescribeAssetCommandInput) =>
    [{ ...assetKeys.descriptions()[0], assetId: input.assetId }] as const,
};

function describeAsset(client: IoTSiteWiseClient) {
  return ({ queryKey: [{ assetId }], signal }: QueryFunctionContext<ReturnType<(typeof assetKeys)['description']>>) => {
    const command = new DescribeAssetCommand({ assetId });
    return client.send(command, { abortSignal: signal });
  };
}

export function useDescribeAssetQuery(input: DescribeAssetCommandInput, client: IoTSiteWiseClient) {
  return useQuery({
    queryKey: assetKeys.description(input),
    queryFn: describeAsset(client),
  });
}

function listAssets(client: IoTSiteWiseClient) {
  return ({
    queryKey: [{ filter, assetModelId }],
    pageParam,
    signal,
  }: QueryFunctionContext<ReturnType<(typeof assetKeys)['list']>>) => {
    const command = new ListAssetsCommand({ filter, assetModelId, nextToken: pageParam });
    return client.send(command, { abortSignal: signal });
  };
}

export function useListAssetsInfiniteQuery(input: ListAssetsCommandInput, client: IoTSiteWiseClient) {
  return useInfiniteQuery({
    queryKey: assetKeys.list(input),
    queryFn: listAssets(client),
    getNextPageParam: (output) => output.nextToken,
  });
}

function listAssociatedAssets(client: IoTSiteWiseClient) {
  return ({
    queryKey: [{ assetId, hierarchyId, traversalDirection }],
    pageParam,
    signal,
  }: QueryFunctionContext<ReturnType<(typeof assetKeys)['associatedList']>>) => {
    const command = new ListAssociatedAssetsCommand({
      assetId,
      hierarchyId,
      traversalDirection,
      nextToken: pageParam,
    });
    return client.send(command, { abortSignal: signal });
  };
}

export function useListAssociatedAssetsInfiniteQuery(
  input: ListAssociatedAssetsCommandInput,
  client: IoTSiteWiseClient
) {
  return useInfiniteQuery({
    queryKey: assetKeys.associatedList(input),
    queryFn: listAssociatedAssets(client),
    getNextPageParam: (output) => output.nextToken,
  });
}

export function useAssociateAssetsMutation(client: IoTSiteWiseClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AssociateAssetsCommandInput) => client.send(new AssociateAssetsCommand(input)),
    onMutate: () => {
      queryClient.cancelQueries(assetKeys.lists());
      queryClient.cancelQueries(assetKeys.associatedLists());
    },
    onSuccess: () => {
      queryClient.invalidateQueries(assetKeys.lists());
      queryClient.invalidateQueries(assetKeys.associatedLists());
    },
  });
}

export function useCreateAssetMutation(client: IoTSiteWiseClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAssetCommandInput) => client.send(new CreateAssetCommand(input)),
    onMutate: () => {
      queryClient.cancelQueries(assetKeys.lists());
      queryClient.cancelQueries(assetKeys.associatedLists());
    },
    onSuccess: () => {
      queryClient.invalidateQueries(assetKeys.lists());
      queryClient.invalidateQueries(assetKeys.associatedLists());
    },
  });
}

export function useDeleteAssetMutation(client: IoTSiteWiseClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DeleteAssetCommandInput) => client.send(new DeleteAssetCommand(input)),
    onMutate: (input) => {
      queryClient.cancelQueries(assetKeys.lists());
      queryClient.cancelQueries(assetKeys.associatedLists());
      queryClient.cancelQueries(assetKeys.description(input));
    },
    onSuccess: (_data, input) => {
      queryClient.invalidateQueries(assetKeys.lists());
      queryClient.invalidateQueries(assetKeys.associatedLists());
      queryClient.invalidateQueries(assetKeys.description(input));
    },
  });
}

export function useDiassociateAssetsMutation(client: IoTSiteWiseClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DisassociateAssetsCommandInput) => client.send(new DisassociateAssetsCommand(input)),
    onMutate: () => {
      queryClient.cancelQueries(assetKeys.lists());
      queryClient.cancelQueries(assetKeys.associatedLists());
    },
    onSuccess: () => {
      queryClient.invalidateQueries(assetKeys.lists());
      queryClient.invalidateQueries(assetKeys.associatedLists());
    },
  });
}

export function useUpdateAssetMutation(client: IoTSiteWiseClient) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateAssetCommandInput) => client.send(new UpdateAssetCommand(input)),
    onMutate: (input) => {
      queryClient.cancelQueries(assetKeys.lists());
      queryClient.cancelQueries(assetKeys.associatedLists());
      queryClient.cancelQueries(assetKeys.description(input));
    },
    onSuccess: (_data, input) => {
      queryClient.invalidateQueries(assetKeys.lists());
      queryClient.invalidateQueries(assetKeys.associatedLists());
      queryClient.invalidateQueries(assetKeys.description(input));
    },
  });
}

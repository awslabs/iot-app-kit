import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
  UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import {
  DescribeAssetCommand,
  DescribeAssetCommandInput,
  DescribeAssetCommandOutput,
  DescribeAssetPropertyCommand,
  DescribeAssetPropertyCommandInput,
  DescribeAssetPropertyCommandOutput,
  DescribeAssetModelCommand,
  DescribeAssetModelCommandInput,
  DescribeAssetModelCommandOutput,
  ListAssetsCommand,
  ListAssetsCommandInput,
  ListAssetsCommandOutput,
  ListAssetPropertiesCommand,
  ListAssetPropertiesCommandInput,
  ListAssetPropertiesCommandOutput,
  IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import React from 'react';

type ListAssetsCommandTriplet = CommandTriplet<
  ListAssetsCommandInput,
  ListAssetsCommandOutput,
  ListAssetsCommand
>;

export type ListAssetPropertiesCommandTriplet = CommandTriplet<
  ListAssetPropertiesCommandInput,
  ListAssetPropertiesCommandOutput,
  ListAssetPropertiesCommand
>;

// types.ts

interface WithIoTSiteWiseClient {
  client: IoTSiteWiseClient;
}

interface Paginated {
  nextToken?: string;
}

interface CommandTriplet<
  Input = unknown,
  Output = unknown,
  Command extends { input: Input } = { input: Input }
> {
  command: Command;
  input: Input;
  output: Output;
}

type ListCommandTriplet<
  Input extends Paginated = Paginated,
  Output extends Paginated = Paginated,
  Command extends { input: Input } = { input: Input }
> = CommandTriplet<Input, Output, Command>;

export type Command<T extends CommandTriplet> = T['command'];
export type CommandInput<T extends CommandTriplet> = T['input'];
export type CommandOutput<T extends CommandTriplet> = T['output'];

export type DescribeCommandOptions<T extends CommandTriplet> = UseQueryOptions<
  CommandOutput<T>,
  Error,
  CommandOutput<T>,
  [CommandInput<T>]
>;

export type ListCommandOptions<T extends ListCommandTriplet> =
  UseInfiniteQueryOptions<
    CommandOutput<T>,
    Error,
    CommandOutput<T>,
    CommandOutput<T>,
    [CommandInput<T>]
  >;

interface UseCommandOptions<T extends CommandTriplet>
  extends WithIoTSiteWiseClient {
    input: CommandInput<T>;
    options?: DescribeCommandOptions<T>;
  }

// useDescribeAssetModel.ts
export type DescribeAssetModelCommandTriplet = CommandTriplet<
  DescribeAssetModelCommandInput,
  DescribeAssetModelCommandOutput,
  DescribeAssetModelCommand
>;

export type UseDescribeAssetModelOptions =
  UseCommandOptions<DescribeAssetModelCommandTriplet>;

export function useDescribeAssetModel({
  client,
  input,
  options,
}: UseDescribeAssetModelOptions) {
  return useDescribeCommand<DescribeAssetModelCommandTriplet>({
    command: new DescribeAssetModelCommand(input),
    client,
    options,
  });
}

// useDescribeAsset.ts

export type DescribeAssetCommandTriplet = CommandTriplet<
  DescribeAssetCommandInput,
  DescribeAssetCommandOutput,
  DescribeAssetCommand
>;

export type UseDescribeAssetOptions =
  UseCommandOptions<DescribeAssetCommandTriplet>;

export function useDescribeAsset({
  client,
  input,
  options,
}: UseDescribeAssetOptions) {
  return useDescribeCommand<DescribeAssetCommandTriplet>({
    command: new DescribeAssetCommand(input),
    client,
    options,
  });
}

// useDescribeAssetProperty.ts

export type DescribeAssetPropertyCommandTriplet = CommandTriplet<
  DescribeAssetPropertyCommandInput,
  DescribeAssetPropertyCommandOutput,
  DescribeAssetPropertyCommand
>;

export type UseDescribeAssetPropertyOptions =
  UseCommandOptions<DescribeAssetPropertyCommandTriplet>;

export function useDescribeAssetProperty({
  client,
  input,
  options,
}: UseDescribeAssetPropertyOptions) {
  return useDescribeCommand<DescribeAssetPropertyCommandTriplet>({
    command: new DescribeAssetPropertyCommand(input),
    client,
    options,
  });
}

// useDescribeCommand.ts

interface UseDescribeCommandOptions<T extends CommandTriplet>
  extends WithIoTSiteWiseClient {
    command: Command<T>;
    options?: DescribeCommandOptions<T>;
  }

function useDescribeCommand<T extends CommandTriplet>({
  client,
  command,
  options = {},
}: UseDescribeCommandOptions<T>) {
  return useQuery({
    queryKey: [command.input as CommandInput<T>],
    queryFn: async ({ signal }) => {
      // @ts-expect-error Command type is hard to get right
      const output = await client.send(command, {
        abortSignal: signal,
      });

      return output;
    },
    ...options,
  });
}

// useListCommand.ts

interface UseListCommandOptions<T extends ListCommandTriplet>
  extends WithIoTSiteWiseClient {
    createCommand(nextToken?: string): Command<T>;
    options?: ListCommandOptions<T>;
  }

export function useListCommand<T extends ListCommandTriplet>({
  client,
  createCommand,
  options = {},
}: UseListCommandOptions<T>) {
  return useInfiniteQuery({
    queryKey: [createCommand().input as CommandInput<T>],
    queryFn: async ({ pageParam: nextToken, signal }) => {
      // @ts-expect-error Command type is hard to get right
      const output = (await client.send(createCommand(nextToken), {
        abortSignal: signal,
      })) as CommandOutput<T>;

      return output;
    },
    getNextPageParam: ({ nextToken }) => nextToken,
    ...options,
  });
}

interface UseListAssetsOptions {
  client: IoTSiteWiseClient;
  input: CommandInput<ListAssetsCommandTriplet>;
  options?: ListCommandOptions<ListAssetsCommandTriplet>;
}

export function useListAssets({
  client,
  input,
  options,
}: UseListAssetsOptions) {
  return useListCommand({
    createCommand: (nextToken) =>
      new ListAssetsCommand({ ...input, nextToken }),
    client,
    options,
  });
}

// AssetCard.tsx

export function AssetCard({ client }: WithIoTSiteWiseClient) {
  const { data: asset, isLoading } = useDescribeAsset({
    client,
    input: {
      assetId: '123',
    },
    options: {
      refetchInterval: 5000,
    },
  });

  return <div>{isLoading ? 'Loading...' : asset?.assetName}</div>;
}

import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import Box from '@cloudscape-design/components/box';

import { useUnmodeledDataStreams } from './useUnmodeledDataStreams/useUnmodeledDataStreams';

import { useAliasPrefix } from './useAliasPrefix';
import type { UnmodeledDataStream } from './types';
import { UnmodeledDataStreamSearchForm } from './unmodeledDataStreamSearchForm';
import { UnmodeledDataStreamTable } from './unmodeledDataStreamTable';

export interface UnmodeledDataStreamExplorerProps {
  onClickAdd: (unmodeledDataStreams: UnmodeledDataStream[]) => void;
  client: IoTSiteWiseClient;
}

export function UnmodeledDataStreamExplorer({
  client,
  onClickAdd,
}: UnmodeledDataStreamExplorerProps) {
  const [aliasPrefix, setAliasPrefix] = useAliasPrefix();
  const {
    unmodeledDataStreams,
    isFetching: isFetchingUnmodeledDataStreams,
    hasNextPage = false,
  } = useUnmodeledDataStreams({
    aliasPrefix: aliasPrefix !== '' ? aliasPrefix : undefined,
    client,
  });

  return (
    <Box padding={{ horizontal: 's' }}>
      <UnmodeledDataStreamSearchForm onSearch={setAliasPrefix} />
      <UnmodeledDataStreamTable
        onClickAdd={onClickAdd}
        unmodeledDataStreams={unmodeledDataStreams}
        isLoading={isFetchingUnmodeledDataStreams}
        client={client}
        hasNextPage={hasNextPage}
      />
    </Box>
  );
}

import { useQuery } from '@tanstack/react-query';
import { ExecuteQueryCommand, IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';

export interface UseKnowledgeGraphQueryProps {
  queryStatement: string;
  workspaceId: string;
  client: IoTTwinMakerClient;
}

export const useKnowledgeGraphQuery = (props: UseKnowledgeGraphQueryProps) => {
  const executeQuery = async () => {
    if (!props.client) return; // TODO: add input check
    return props.client.send(new ExecuteQueryCommand({ ...props }));
  };

  return useQuery({
    queryKey: [props.queryStatement, props.workspaceId],
    queryFn: () => executeQuery(),
    select: (data) => data,
    enabled: !!props.workspaceId,
  });
};

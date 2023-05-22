import { TwinMakerKGQueryDataModule } from '@iot-app-kit/source-iottwinmaker';
import { ExecuteQueryCommandOutput } from '@aws-sdk/client-iottwinmaker';
export interface KnowledgeGraphQueryInterface {
  findEntitiesByName(name: string): Promise<void>;
  findRelatedEntities(entityId: string, numberOfHops: number): Promise<void>;
}
export const createKnowledgeGraphQueryClient = function (
  dataSource: TwinMakerKGQueryDataModule,
  updateQueryResults: (result: ExecuteQueryCommandOutput) => void
) {
  const knowledgeGraphQuery: KnowledgeGraphQueryInterface = {
    findEntitiesByName: async (name: string): Promise<void> => {
      const result = await dataSource.executeQuery({
        queryStatement: `SELECT e FROM EntityGraph MATCH (e) WHERE e.entityName like '%${name}%'`,
      });
      updateQueryResults(result);
    },
    findRelatedEntities: async (entityId: string, numberOfHops: number): Promise<void> => {
      const result = await dataSource.executeQuery({
        queryStatement: `SELECT e1 FROM EntityGraph MATCH (e)-[]-{1,${numberOfHops}}(e1) WHERE e.entityId = '${entityId}'`,
      });
      updateQueryResults(result);
    },
  };
  return knowledgeGraphQuery;
};

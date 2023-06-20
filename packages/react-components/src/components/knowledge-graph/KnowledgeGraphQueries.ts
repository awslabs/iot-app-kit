import { TwinMakerKGQueryDataModule } from '@iot-app-kit/source-iottwinmaker';
import { ExecuteQueryCommandOutput } from '@aws-sdk/client-iottwinmaker';
export interface KnowledgeGraphQueryInterface {
  findEntitiesByName(name: string): Promise<void>;
  findRelatedEntities(entityId: string): Promise<void>;
  executeExternalEntityQuery(entityId: string): Promise<void>;
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
    findRelatedEntities: async (entityId: string): Promise<void> => {
      const result = await dataSource.executeQuery({
        queryStatement: `SELECT e1, r1, e2, r2, e3, r3, e4
        FROM EntityGraph 
        MATCH (e1)-[r1]-(e2)-[r2]-(e3)-[r3]-(e4) WHERE e1.entityId = '${entityId}'`,
      });
      updateQueryResults(result);
    },
    executeExternalEntityQuery: async (entityId: string): Promise<void> => {
      const result = await dataSource.executeQuery({
        queryStatement: `SELECT e FROM EntityGraph MATCH (e) WHERE e.entityId = '${entityId}'`,
      });
      updateQueryResults(result);
    },
  };

  return knowledgeGraphQuery;
};
